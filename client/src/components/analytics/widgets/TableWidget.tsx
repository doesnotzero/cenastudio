import { format } from "date-fns";

interface TableData {
  columns: Array<{
    key: string;
    label: string;
    type?: "text" | "number" | "date" | "badge";
  }>;
  rows: Array<Record<string, any>>;
}

interface TableWidgetProps {
  title: string;
  data: TableData;
  config?: any;
}

export default function TableWidget({ title, data, config }: TableWidgetProps) {
  const formatCellValue = (value: any, type?: string) => {
    if (value === null || value === undefined) return "-";

    switch (type) {
      case "number":
        if (typeof value === "number" && value > 1000) {
          return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
            minimumFractionDigits: 0
          }).format(value);
        }
        return new Intl.NumberFormat("pt-BR").format(value);

      case "date":
        try {
          return format(new Date(value), "dd/MM/yyyy");
        } catch {
          return value;
        }

      case "badge":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-frame-orange/20 text-frame-orange">
            {value}
          </span>
        );

      default:
        return value;
    }
  };

  return (
    <div className="border border-frame-gray-3 bg-frame-gray-1/20 rounded-lg p-6 hover:border-frame-orange/40 transition-colors">
      {/* Title */}
      <div className="mb-6">
        <p className="font-frame-mono text-[0.58rem] uppercase tracking-[0.14em] text-frame-gray-light">
          {title}
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-frame-gray-3">
              {data.columns.map((column) => (
                <th
                  key={column.key}
                  className="text-left py-3 px-2 font-frame-mono text-[0.65rem] uppercase tracking-wider text-frame-gray-light"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.length === 0 ? (
              <tr>
                <td
                  colSpan={data.columns.length}
                  className="text-center py-8 text-frame-gray-light text-xs"
                >
                  Nenhum dado disponível
                </td>
              </tr>
            ) : (
              data.rows.map((row, rowIndex) => (
                <tr
                  key={row.id || rowIndex}
                  className="border-b border-frame-gray-3/50 hover:bg-frame-gray-1/40 transition-colors"
                >
                  {data.columns.map((column) => (
                    <td key={column.key} className="py-3 px-2 text-frame-white">
                      {formatCellValue(row[column.key], column.type)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Row count */}
      {data.rows.length > 0 && (
        <div className="mt-4 text-xs text-frame-gray-light text-right">
          {data.rows.length} registro{data.rows.length !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
}
