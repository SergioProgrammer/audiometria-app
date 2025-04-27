import React, { useState } from 'react';

const AudiometryTable = ({ test }) => {
  // Datos iniciales de la tabla según la prueba seleccionada
  const getInitialTableData = (test) => {
    switch (test) {
      case 'test1':
        return [
          { frequency: '0Hz', rightEar: '20 dB', leftEar: '25 dB' },
          { frequency: '500Hz', rightEar: '30 dB', leftEar: '35 dB' },
          { frequency: '1000Hz', rightEar: '40 dB', leftEar: '45 dB' },
          { frequency: '2000Hz', rightEar: '50 dB', leftEar: '55 dB' },
          { frequency: '4000Hz', rightEar: '60 dB', leftEar: '65 dB' },
        ];
      case 'test2':
        return [
          { frequency: '0Hz', rightEar: '15 dB', leftEar: '20 dB' },
          { frequency: '500Hz', rightEar: '25 dB', leftEar: '30 dB' },
          { frequency: '1000Hz', rightEar: '35 dB', leftEar: '40 dB' },
          { frequency: '2000Hz', rightEar: '45 dB', leftEar: '50 dB' },
          { frequency: '4000Hz', rightEar: '55 dB', leftEar: '60 dB' },
        ];
      case 'test3':
        return [
          { frequency: '0Hz', rightEar: '25 dB', leftEar: '30 dB' },
          { frequency: '500Hz', rightEar: '35 dB', leftEar: '40 dB' },
          { frequency: '1000Hz', rightEar: '45 dB', leftEar: '50 dB' },
          { frequency: '2000Hz', rightEar: '55 dB', leftEar: '60 dB' },
          { frequency: '4000Hz', rightEar: '65 dB', leftEar: '70 dB' },
        ];
      case 'test4':
        return [
          { frequency: '0Hz', rightEar: '30 dB', leftEar: '35 dB' },
          { frequency: '500Hz', rightEar: '40 dB', leftEar: '45 dB' },
          { frequency: '1000Hz', rightEar: '50 dB', leftEar: '55 dB' },
          { frequency: '2000Hz', rightEar: '60 dB', leftEar: '65 dB' },
          { frequency: '4000Hz', rightEar: '70 dB', leftEar: '75 dB' },
        ];
      default:
        return [];
    }
  };

  // Estado para manejar los datos de la tabla
  const [tableData, setTableData] = useState(getInitialTableData(test));

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
            <td>
              <input
                type="text"
                value={row.frequency}
                onChange={(e) =>
                  handleInputChange(index, 'frequency', e.target.value)
                }
              />
            </td>
            <td>
              <input
                type="text"
                value={row.rightEar}
                onChange={(e) =>
                  handleInputChange(index, 'rightEar', e.target.value)
                }
              />
            </td>
            <td>
              <input
                type="text"
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