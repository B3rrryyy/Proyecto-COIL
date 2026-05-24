import { useEffect, useState } from "react";
import fichaService from "../../services/ficha.service";

const HistorialPage = () => {
  const [guardavias, setGuardavias] = useState([]);
  const [senalizaciones, setSenalizaciones] = useState([]);
  const [alcantarillas, setAlcantarillas] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const g = await fichaService.getGuardavias();
      const s = await fichaService.getSenalizaciones();
      const a = await fichaService.getAlcantarillas();

      setGuardavias(g);
      setSenalizaciones(s);
      setAlcantarillas(a);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          Historial de Fichas
        </h1>

        <p className="text-gray-500 mt-2">
          Visualización general de registros guardados.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-semibold">
            Guardavías
          </h2>

          <p className="text-4xl font-bold mt-4">
            {guardavias.length}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-semibold">
            Señalización
          </h2>

          <p className="text-4xl font-bold mt-4">
            {senalizaciones.length}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-semibold">
            Alcantarillas
          </h2>

          <p className="text-4xl font-bold mt-4">
            {alcantarillas.length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HistorialPage;