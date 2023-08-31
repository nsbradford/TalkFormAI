interface Props {
  data: Array<Record<string, any>>;
}

const ResponsesTable: React.FC<Props> = ({ data }) => {
  if (!data || data.length === 0) return <div>No data available.</div>;

  // Assuming all lists have a similar structure, so we'll use the first list's first item for headers
  const sampleItem = data[0];
  if (!sampleItem)
    return <div>{`${data.length} responses collected but all are empty`}</div>;

  const headers = Object.keys(sampleItem);

  return (
    <div className="overflow-x-auto">
      {data.map((list, listIndex) => (
        <div key={listIndex} className="mb-8">
          <table className="min-w-full bg-white table-auto">
            <thead className="bg-gray-800 text-white">
              <tr>
                {headers.map((header) => (
                  <th key={header} className="px-4 py-2">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {headers.map((header) => (
                    <td key={header} className="border px-4 py-2">
                      {row[header] || 'N/A'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default ResponsesTable;
