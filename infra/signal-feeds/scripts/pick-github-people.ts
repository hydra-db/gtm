import { defineScript } from "@cargo-ai/cdk";

type Star = { starred_at?: string; user?: { login?: string; type?: string } };
type Issue = {
  number?: number;
  html_url?: string;
  created_at?: string;
  pull_request?: unknown;
  user?: { login?: string; type?: string };
};
type Login = { login?: string } | null;
type Discussion = {
  number?: number;
  url?: string;
  createdAt?: string;
  author?: Login;
  comments?: { nodes?: ({ author?: Login; createdAt?: string; url?: string } | null)[] };
};

// Who acted on the repo inside the window: issue and pull request authors,
// then discussion authors and commenters, then new stargazers. Bots are
// dropped, one entry per person (the first action found wins).
export const pickGithubPeople = defineScript(
  async ({
    stars,
    issues,
    discussions,
    since,
    repo,
    maxPeople,
  }: {
    stars: unknown;
    issues: unknown;
    discussions?: unknown;
    since: string;
    repo: string;
    maxPeople: number;
  }) => {
    const from = new Date(since).getTime();
    const isPerson = (user?: { login?: string; type?: string }) =>
      Boolean(
        user &&
          user.login &&
          user.type !== "Bot" &&
          !/\[bot\]$|-bot$|^dependabot|^renovate/i.test(user.login),
      );
    const people: {
      login: string;
      action: string;
      url: string;
      occurred_at: string;
      key: string;
    }[] = [];
    for (const issue of Array.isArray(issues) ? (issues as Issue[]) : []) {
      if (
        issue &&
        isPerson(issue.user) &&
        issue.created_at &&
        new Date(issue.created_at).getTime() >= from
      ) {
        const action = issue.pull_request ? "pull_request" : "issue";
        people.push({
          login: String(issue.user?.login),
          action,
          url: String(issue.html_url || ""),
          occurred_at: String(issue.created_at),
          key: `${repo}:${action}:${issue.number}`,
        });
      }
    }
    // The GraphQL response body: data.repository.discussions.nodes. A failed
    // call, a repo with discussions off, or an errors-only body reads as none.
    const body = (discussions || {}) as {
      data?: { repository?: { discussions?: { nodes?: (Discussion | null)[] } } | null };
    };
    const threads = body.data?.repository?.discussions?.nodes;
    // GraphQL authors carry no type: a bot login ends in [bot] or -bot.
    const asUser = (author?: Login) =>
      author && author.login ? { login: author.login, type: "User" } : undefined;
    for (const thread of Array.isArray(threads) ? threads : []) {
      if (!thread) {
        continue;
      }
      if (
        isPerson(asUser(thread.author)) &&
        thread.createdAt &&
        new Date(thread.createdAt).getTime() >= from
      ) {
        people.push({
          login: String(thread.author?.login),
          action: "discussion",
          url: String(thread.url || ""),
          occurred_at: String(thread.createdAt),
          key: `${repo}:discussion:${thread.number}`,
        });
      }
      const comments = thread.comments?.nodes;
      for (const comment of Array.isArray(comments) ? comments : []) {
        if (
          comment &&
          isPerson(asUser(comment.author)) &&
          comment.createdAt &&
          new Date(comment.createdAt).getTime() >= from
        ) {
          people.push({
            login: String(comment.author?.login),
            action: "discussion_comment",
            url: String(comment.url || thread.url || ""),
            occurred_at: String(comment.createdAt),
            key: `${repo}:discussion_comment:${thread.number}:${comment.author?.login}`,
          });
        }
      }
    }
    for (const star of Array.isArray(stars) ? (stars as Star[]) : []) {
      if (
        star &&
        isPerson(star.user) &&
        star.starred_at &&
        new Date(star.starred_at).getTime() >= from
      ) {
        people.push({
          login: String(star.user?.login),
          action: "star",
          url: `https://github.com/${repo}`,
          occurred_at: String(star.starred_at),
          key: `${repo}:star:${star.user?.login}`,
        });
      }
    }
    const seen: Record<string, boolean> = {};
    const unique = people.filter((person) => {
      if (seen[person.login]) {
        return false;
      }
      seen[person.login] = true;
      return true;
    });
    return { people: unique.slice(0, maxPeople), found: unique.length };
  },
);
