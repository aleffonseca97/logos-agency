export function exportToCsv<T extends Record<string, unknown>>(
  rows: T[],
  columns: { key: keyof T; label: string }[],
  filename: string,
) {
  const header = columns.map((c) => c.label).join(",");
  const body = rows
    .map((row) =>
      columns
        .map((c) => {
          const val = String(row[c.key] ?? "");
          return `"${val.replace(/"/g, '""')}"`;
        })
        .join(","),
    )
    .join("\n");

  const bom = "\uFEFF";
  const blob = new Blob([bom + header + "\n" + body], {
    type: "text/csv;charset=utf-8;",
  });
  downloadBlob(blob, `${filename}.csv`);
}

export function exportToExcel<T extends Record<string, unknown>>(
  rows: T[],
  columns: { key: keyof T; label: string }[],
  filename: string,
) {
  const header = columns.map((c) => c.label).join("\t");
  const body = rows
    .map((row) =>
      columns.map((c) => String(row[c.key] ?? "")).join("\t"),
    )
    .join("\n");

  const bom = "\uFEFF";
  const blob = new Blob([bom + header + "\n" + body], {
    type: "application/vnd.ms-excel;charset=utf-8;",
  });
  downloadBlob(blob, `${filename}.xls`);
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(date));
}
