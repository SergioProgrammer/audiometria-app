import React, { useEffect, useState } from 'react';

const AudiometryTable = ({ data, onDataChange }) => {
  // Estado local para manejar los datos de la tabla
  const [tableData, setTableData] = useState(
    data.labels.map((label) => ({
      frequency: label,
      rightEar: 0,
      leftEar: 0,
    }))
  );

  // Actualiza los datos en el componente padre cuando cambian los datos locales
  useEffect(() => {
    const updatedData = {
      labels: tableData.map((row) => row.frequency),
      rightEarValues: tableData.map((row) => parseInt(row.rightEar, 10) || 0), // Valores del oído derecho
      leftEarValues: tableData.map((row) => parseInt(row.leftEar, 10) || 0), // Valores del oído izquierdo
    };
    onDataChange(updatedData);
  }, [tableData, onDataChange]);

  // Manejar cambios en las celdas editables
  const handleInputChange = (index, field, value) => {
    const updatedTableData = [...tableData];
    updatedTableData[index][field] = value;
    setTableData(updatedTableData);
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Frecuencia (Hz)</th>
          <th>Oído Derecho (dB)</th>
          <th>Oído Izquierdo (dB)</th>
        </tr>
      </thead>
      <tbody>
        {tableData.map((row, index) => (
          <tr key={index}>
            <td>{row.frequency}</td>
            <td>
              <input
                type="number"
                value={row.rightEar}
                onChange={(e) =>
                  handleInputChange(index, 'rightEar', e.target.value)
                }
              />
            </td>
            <td>
              <input
                type="number"
                value={row.leftEar}
                onChange={(e) =>
                  handleInputChange(index, 'leftEar', e.target.value)
                }
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AudiometryTable;