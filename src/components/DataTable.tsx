interface DataTableProps {
  columns: string[];
  rows: Array<Record<string, unknown>>;
  maxRows?: number;
}

export function DataTable({ columns, rows, maxRows = 20 }: DataTableProps) {
  if (!rows.length) {
    return <p className="helper-text">No hay filas para mostrar.</p>;
  }

  const limitedRows = rows.slice(0, maxRows);

  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {limitedRows.map((row, index) => (
            <tr key={`${row.id ?? index}`}>
              {columns.map((column) => (
                <td key={column}>{formatCell(row[column])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length > limitedRows.length ? <p className="helper-text">Mostrando {limitedRows.length} de {rows.length} filas</p> : null}
    </div>
  );
}

const formatCell = (value: unknown) => {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'number') {
    return value % 1 === 0 ? value.toLocaleString() : value.toLocaleString(undefined, { maximumFractionDigits: 2 });
  }
  return String(value);
};









