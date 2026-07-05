export function SkeletonTable({ rows = 6 }: { rows?: number }) {
  return (
    <div className="animate-pulse overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-frame-gray-3">
            <th className="px-4 py-3 text-left">
              <div className="h-4 w-20 rounded bg-frame-gray-3" />
            </th>
            <th className="px-4 py-3 text-right">
              <div className="ml-auto h-4 w-12 rounded bg-frame-gray-3" />
            </th>
            <th className="px-4 py-3 text-right">
              <div className="ml-auto h-4 w-24 rounded bg-frame-gray-3" />
            </th>
            <th className="px-4 py-3 text-right">
              <div className="ml-auto h-4 w-24 rounded bg-frame-gray-3" />
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <tr key={i} className="border-b border-frame-gray-3/50">
              <td className="px-4 py-3">
                <div className="h-4 w-24 rounded bg-frame-gray-3" />
              </td>
              <td className="px-4 py-3 text-right">
                <div className="ml-auto h-4 w-8 rounded bg-frame-gray-3" />
              </td>
              <td className="px-4 py-3 text-right">
                <div className="ml-auto h-4 w-20 rounded bg-frame-gray-3" />
              </td>
              <td className="px-4 py-3 text-right">
                <div className="ml-auto h-4 w-20 rounded bg-frame-gray-3" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
