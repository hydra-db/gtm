// Shared by the daily outreach query scripts (not a script itself).
// Model-search filters for the daily outreach run, built from the rows found
// so far. A list that comes back empty becomes a value no row has, so the
// search returns nothing instead of everything.

export const NONE = "__none__";

export type Filter = { conjonction: "and" | "or"; groups: Array<Record<string, unknown>> };

export const isIn = (columnSlug: string, values: string[]): Filter => ({
  conjonction: "and",
  groups: [
    {
      conjonction: "and",
      conditions: [
        {
          kind: "string",
          columnSlug,
          operator: "is",
          values: values.length > 0 ? values : [NONE],
        },
      ],
    },
  ],
});

export const strings = (values: unknown[]): string[] => {
  const seen: Record<string, boolean> = {};
  const out: string[] = [];
  for (const value of values) {
    const text = String(value || "").trim();
    if (text && !seen[text]) {
      seen[text] = true;
      out.push(text);
    }
  }
  return out;
};

export type Row = Record<string, unknown>;
