// Minimal client-side CSV export — no backend needed.

function escapeCell(value: unknown): string {
  const s = value == null ? "" : String(value);
  // Quote if the value contains a comma, quote, or newline.
  if (/[",\n]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

/**
 * Build a CSV string from a list of rows and a column definition.
 * `columns` maps a header label to a value-accessor for each row.
 */
export function toCSV<T>(
  rows: T[],
  columns: { header: string; accessor: (row: T) => unknown }[],
): string {
  const head = columns.map((c) => escapeCell(c.header)).join(",");
  const body = rows
    .map((row) => columns.map((c) => escapeCell(c.accessor(row))).join(","))
    .join("\n");
  return `${head}\n${body}`;
}

/** Trigger a browser download of `content` as `filename`. */
export function downloadCSV(filename: string, content: string): void {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/** Convenience: build + download in one call. */
export function exportCSV<T>(
  filename: string,
  rows: T[],
  columns: { header: string; accessor: (row: T) => unknown }[],
): void {
  downloadCSV(filename, toCSV(rows, columns));
}
