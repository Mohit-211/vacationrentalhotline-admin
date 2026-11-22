type CsvValue = string | number | boolean | null | undefined;

/** Builds a CSV file (quoted per RFC 4180) and downloads it. */
export function downloadCsv(fileName: string, header: string[], rows: CsvValue[][]): void {
  const lines = [header, ...rows].map((row) => row.map(toCsvCell).join(","));
  // The byte-order mark makes Excel read the file as UTF-8.
  const blob = new Blob([`\uFEFF${lines.join("\r\n")}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

function toCsvCell(value: CsvValue): string {
  let text = value === null || value === undefined ? "" : String(value);
  // Stop spreadsheet apps from running user-entered text as a formula.
  if (typeof value === "string" && /^[=+\-@\t\r]/.test(text)) {
    text = `'${text}`;
  }
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}
