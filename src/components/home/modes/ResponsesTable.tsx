interface Props {
  data: Array<Record<string, any>>;
}

const ResponsesTable: React.FC<Props> = ({ data }) => {
  if (!data || data.length === 0) return <div>No data available.</div>;

  // Assuming all lists have identical structure, so we'll use the first list's first item for headers
  const sampleItem = data[0];
  if (!sampleItem)
    return <div>{`${data.length} responses collected but all are empty`}</div>;

  const headers = Object.keys(sampleItem);

  // return (
  //   <div className="overflow-x-auto">
  //     <table className="min-w-full bg-white table-auto">
  //       <thead className="bg-gray-800 text-white">
  //         <tr>
  //           {headers.map((header) => (
  //             <th key={header} className="px-4 py-2">
  //               {header}
  //             </th>
  //           ))}
  //         </tr>
  //       </thead>
  //       <tbody className="text-gray-700">
  //         {data.map((row, rowIndex) => (
  //           <tr key={rowIndex}>
  //             {headers.map((header) => (
  //               <td key={header} className="border px-4 py-2">
  //                 {row[header] || 'N/A'}
  //               </td>
  //             ))}
  //           </tr>
  //         ))}
  //       </tbody>
  //     </table>
  //   </div>
  // );
  return (
    <div className="overflow-x-auto shadow-md rounded-lg">
      <table className="min-w-full bg-white table-auto divide-y divide-gray-300">
        <thead className="bg-gray-800 text-white">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-4 py-2">
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
                <td key={header} className="border px-4 py-2">
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
