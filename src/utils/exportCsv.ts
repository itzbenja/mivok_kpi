// Utilidad para exportar arrays de objetos a CSV compatible con Excel
// Incluye BOM UTF-8 para que Excel reconozca tildes y caracteres especiales
export interface CSVColumn<T> { key: keyof T; header: string; format?: (value: unknown, row: T) => string | number; }

export function exportToCSV<T extends Record<string, unknown>>(filename: string, data: T[], columns: CSVColumn<T>[]) {
  if (!data || data.length === 0) {
    console.warn('No hay datos para exportar');
    return;
  }
  const sep = ','; // Excel reconoce coma; si deseas semicolon cambiar aquí
  const headerRow = columns.map(c => escapeCell(c.header)).join(sep);
  const lines = data.map(row => {
    return columns.map(col => {
      const raw = row[col.key];
      const value = col.format ? col.format(raw, row) : raw;
      return escapeCell(value);
    }).join(sep);
  });
  const csvContent = [headerRow, ...lines].join('\n');
  // BOM para Excel UTF-8
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.download = filename.endsWith('.csv') ? filename : filename + '.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function escapeCell(value: unknown): string {
  if (value == null) return '';
  const str = String(value);
  if (/[",\n]/.test(str)) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}
