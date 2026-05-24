import { Trash2, Pencil } from "lucide-react";

interface Guardavia {
  id_ficha: string;
  provincia: string;
  canton: string;
  fecha: string;
  tramo_via: string;
}

interface Props {
  data: Guardavia[];
  onEdit: (item: Guardavia) => void;
  onDelete: (id: string) => void;
}

const GuardaviaTable = ({ data, onEdit, onDelete }: Props) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left">
            <th className="py-3">Provincia</th>
            <th>Cantón</th>
            <th>Fecha</th>
            <th>Tramo Vía</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item) => (
            <tr
              key={item.id_ficha}
              className="border-b hover:bg-gray-50"
            >
              <td className="py-3">{item.provincia}</td>
              <td>{item.canton}</td>
              <td>{item.fecha}</td>
              <td>{item.tramo_via}</td>

              <td className="flex gap-2 py-3">
                <button
                  onClick={() => onEdit(item)}
                  className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200"
                >
                  <Pencil size={16} />
                </button>

                <button
                  onClick={() => onDelete(item.id_ficha)}
                  className="p-2 rounded-lg bg-red-100 hover:bg-red-200"
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GuardaviaTable;