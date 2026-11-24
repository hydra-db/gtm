import { defineScript } from "@cargo-ai/cdk";

type Star = { starred_at?: string; user?: { login?: string; type?: string } };
type Issue = {
  number?: number;
  html_url?: string;
  created_at?: string;
  pull_request?: unknown;
  user?: { login?: string; type?: string };
};

// Who acted on the repo inside the window: new stargazers, then issue and
// pull request authors. Bots are dropped, one entry per person.
export const pickGithubPeople = defineScript(
  async ({
    stars,
    issues,
    since,
    repo,
    maxPeople,
  }: {
    stars: unknown;
    issues: unknown;
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
