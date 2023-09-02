interface Props {
  data: Array<Record<string, any>>;
}

// TODO use the Union of all possible types for the data
const ResponsesTable: React.FC<Props> = ({ data }) => {
  const errorText = !data
    ? 'Loading...'
    : data.length === 0
    ? 'No responses yet'
    : undefined;
  if (!data || data.length === 0)
    return (
      <div className="p-4 max-w-md mx-auto mx-4 bg-gray-100 border border-gray-300 rounded shadow-md text-center text-gray-600 font-semibold">
        {errorText}
      </div>
    );
  // Assuming all lists have identical structure, so we'll use the first list's first item for headers
  const sampleItem = data[0];
  if (!sampleItem)
    return <div>{`${data.length} responses collected but all are empty`}</div>;

  const headers = Object.keys(sampleItem);

  return (
    <div className="overflow-x-auto shadow-md rounded-lg">
      <table className="min-w-full bg-white table-auto divide-y divide-gray-300 text-xs text-left">
        <thead className="bg-gray-800 text-white">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-2 py-2">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-gray-700 divide-y divide-gray-300">
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`${
                rowIndex % 2 === 0 ? 'bg-gray-50' : ''
              } hover:bg-gray-100`}
            >
              {headers.map((header) => (
                <td key={header} className="border px-2 py-2">
                  {row[header] || 'N/A'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResponsesTable;
