import React from 'react';

const AudiometryTable = ({ data, onDataChange }) => {
  if (
    !data ||
    !Array.isArray(data.labels) ||
    !Array.isArray(data.rightEarValues) ||
    !Array.isArray(data.leftEarValues)
  ) {
    return <p>Error: Audiometry data is incomplete or malformed.</p>;
  }

  const handleInputChange = (index, field, value) => {
    const updatedValues = [...data[field]];
    updatedValues[index] = parseInt(value, 10) || 0;

    const updatedData = {
      ...data,
      [field]: updatedValues,
    };

    if (onDataChange) onDataChange(updatedData);
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Frequency (Hz)</th>
          <th>Right Ear (dB)</th>
          <th>Left Ear (dB)</th>
        </tr>
      </thead>
      <tbody>
        {data.labels.map((label, index) => (
          <tr key={index}>
            <td>{label}</td>
            <td>
              <input
                type="number"
                value={data.rightEarValues[index] ?? ''}
                onChange={(e) => handleInputChange(index, 'rightEarValues', e.target.value)}
              />
            </td>
            <td>
              <input
                type="number"
                value={data.leftEarValues[index] ?? ''}
                onChange={(e) => handleInputChange(index, 'leftEarValues', e.target.value)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AudiometryTable;
