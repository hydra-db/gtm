// Shared by the factory's scripts: domain and name normalisation.
export const SHARED_HOSTS = [
  "linkedin.com", "github.com", "github.io", "x.com", "twitter.com", "t.co", "t.me",
  "youtube.com", "youtu.be", "substack.com", "medium.com", "linktr.ee", "bit.ly", "hubs.ly",
  "beacons.ai", "notion.site", "instagram.com", "facebook.com", "discord.gg", "discord.com",
  "gmail.com", "calendly.com", "cal.com", "bento.me", "buymeacoffee.com", "patreon.com",
  "gumroad.com", "wordpress.com", "blogspot.com", "hashnode.dev", "dev.to", "huggingface.co",
  "arxiv.org", "ycombinator.com",
];

export const bare = (value: unknown): string => {
  const cleaned = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .split(/[/?#]/)[0];
  if (!cleaned || !cleaned.includes(".") || cleaned.includes(" ")) {
    return "";
  }
  return SHARED_HOSTS.some((host) => cleaned === host || cleaned.endsWith(`.${host}`))
    ? ""
    : cleaned;
};

export const nameKey = (name: string): string => {
  const cleaned = String(name || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
  return cleaned ? `name:${cleaned}` : "";
};
