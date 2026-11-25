import { defineScript } from "@cargo-ai/cdk";

// Shapes one new_hires row before any paid step: the keyword its title
// matched, when the role started, and whether that is recent enough.
//
// Sales Navigator gives `tenure_start` to the month ("10/2026"). A role counts
// as new when its start month ends within the last `maxStartAgeDays` days, so
// a role that may have started inside the window is kept; `started_at` is the
// first of that month.
export const newHireLead = defineScript(
  async ({
    row,
    keywords,
    maxStartAgeDays,
  }: {
    row: Record<string, unknown>;
    keywords: string[];
    maxStartAgeDays: number;
  }) => {
    const text = (value: unknown): string =>
      value === null || value === undefined ? "" : String(value).trim();
    const title = text(row.job_title);
    const lowered = title.toLowerCase();
    const keyword = keywords.find((word) => lowered.includes(word.toLowerCase())) || "";

    let startedAt = "";
    let monthEnd = 0;
    const tenure = text(row.tenure_start);
    const monthYear = tenure.match(/^(\d{1,2})\/(\d{4})$/);
    if (monthYear) {
      const month = Number(monthYear[1]);
      const year = Number(monthYear[2]);
      startedAt = `${year}-${String(month).padStart(2, "0")}-01`;
      monthEnd = Date.UTC(year, month, 1);
    } else if (tenure && !Number.isNaN(new Date(tenure).getTime())) {
      startedAt = new Date(tenure).toISOString().slice(0, 10);
      monthEnd = new Date(tenure).getTime();
    }
    const recent = monthEnd > 0 && monthEnd >= Date.now() - maxStartAgeDays * 86400000;

    const fullName =
      text(row.full_name) || [text(row.first_name), text(row.last_name)].filter(Boolean).join(" ");
    const linkedinUrl = text(row.linkedin_profile_url).replace(/\/+$/, "");
    return {
      key: linkedinUrl,
      keyword,
      started_at: startedAt,
      recent,
      route: Boolean(keyword && recent && linkedinUrl && text(row.sales_navigator_company_url)),
      full_name: fullName,
      first_name: text(row.first_name),
      last_name: text(row.last_name),
      title,
      linkedin_url: linkedinUrl,
      company: text(row.company_name) || text(row.current_company),
      location: text(row.location),
    };
  },
);
