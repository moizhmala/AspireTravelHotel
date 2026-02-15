export function convertToCsv(rows: Record<string, string>[]) {
  if (!rows.length) return "";

  const headers = Object.keys(rows[0]);

  return [
    headers.join(","),
    ...rows.map(r => headers.map(h => `"${r[h] || ""}"`).join(",")),
  ].join("\n");
}
