import { useTree } from "@/tree-provider.tsx";

export function NodeAttributes() {
  const tree = useTree();
  const node = tree.selectedNode;
  return (
    <div className=" rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-800">{node?.title}</h3>
      </div>

      {node?.attributes.length && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16"
                >
                  Edited
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Title
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Value
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {node.attributes.map((attr, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-4 py-3 whitespace-nowrap">
                    {attr.isEdited && <span>✏️</span>}
                  </td>

                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-gray-900">{attr.title}</span>
                  </td>

                  <td className="px-4 py-3">
                    <div className="relative">
                      <input
                        data-testid={attr.title}
                        type="text"
                        value={attr.value}
                        onInput={(event) =>
                          tree.updateAttribute(
                            tree.selectedPath!,
                            attr.title,
                            (event.target as HTMLInputElement).value,
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                           text-sm transition-colors duration-200"
                      ></input>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
