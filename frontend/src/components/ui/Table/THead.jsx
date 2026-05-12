const THead = ({ columns = [], centerText = true }) => {
  const baseRowStyle =
    "text-white text-[14px] uppercase tracking-wide transition-all duration-200";

  return (
    <thead className="overflow-hidden rounded-t-[10px] whitespace-pre-line">
      {Array.isArray(columns[0]) ? (
        // ✅ Multi-row header (array of arrays)
        columns.map((row, rowIdx) => (
          <tr
            key={rowIdx}
            className={`
              ${baseRowStyle}
              ${
                rowIdx === 0
                  ? "bg-linear-to-b bg-(--gray-dark)"
                  : "bg-(--gray-dark)/95"
              }
            `}
          >
            {row.map((column, colIdx) => (
              <th
                key={colIdx}
                colSpan={column.colSpan || 1}
                rowSpan={column.rowSpan || 1}
                className={`py-3.5 px-4.5 ${
                  centerText ? "text-center" : "ltr:text-left rtl:text-right"
                } font-semibold 
                  ltr:border-r rtl:border-l border-[rgba(255,255,255,0.1)]
                  last:ltr:border-r-0 last:rtl:border-r-0
                `}
              >
                {column.label || column}
              </th>
            ))}
          </tr>
        ))
      ) : (
        // ✅ Single-row header
        <tr
          className={`${baseRowStyle} bg-linear-to-b bg-(--gray-dark)`}
        >
          {columns.map((column, idx) => (
            <th
              key={idx}
              className={`py-3.5 px-4.5 ${
                centerText ? "text-center" : "ltr:text-left rtl:text-right"
              } font-semibold
                ltr:border-r rtl:border-l border-[rgba(255,255,255,0.1)]
                last:ltr:border-r-0 last:rtl:border-r-0
              `}
            >
              {column.label || column}
            </th>
          ))}
        </tr>
      )}
    </thead>
  );
};

export default THead;
