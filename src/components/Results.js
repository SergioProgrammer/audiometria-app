import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Results = ({ data = { rightEarValues: [], leftEarValues: [] } }) => {
  const navigate = useNavigate();
  const [diagnosis, setDiagnosis] = useState('');

  const generateDiagnosis = () => {
    // Ensure data has valid values
    if (!data.rightEarValues.length || !data.leftEarValues.length) {
      setDiagnosis('No data available to generate a diagnosis.');
      return;
    }

    // Calculate averages for both ears
    const averageRightEar = data.rightEarValues.reduce((a, b) => a + b, 0) / data.rightEarValues.length;
    const averageLeftEar = data.leftEarValues.reduce((a, b) => a + b, 0) / data.leftEarValues.length;

    let diagnosisText = 'Diagnosis Summary:\n';

    // Analyze the data and generate a descriptive diagnosis
    if (averageRightEar > 60 && averageLeftEar > 60) {
      diagnosisText += 'The patient has severe hearing loss in both ears. ';
      diagnosisText += 'It is recommended to consider hearing aids or further audiological evaluation.';
    } else if (averageRightEar > 60) {
      diagnosisText += 'The patient has severe hearing loss in the right ear. ';
      diagnosisText += 'It is recommended to evaluate the right ear further and consider treatment options.';
    } else if (averageLeftEar > 60) {
      diagnosisText += 'The patient has severe hearing loss in the left ear. ';
      diagnosisText += 'It is recommended to evaluate the left ear further and consider treatment options.';
    } else if (averageRightEar > 40 || averageLeftEar > 40) {
      diagnosisText += 'The patient has moderate hearing loss. ';
      diagnosisText += 'Regular monitoring and preventive measures are advised.';
    } else {
      diagnosisText += 'The patient has normal hearing levels. ';
      diagnosisText += 'No immediate action is required, but regular check-ups are recommended.';
    }

    setDiagnosis(diagnosisText);
  };

  return (
    <div className="subscription-container">
      <h2>Results</h2>
      <button onClick={generateDiagnosis}>Generate Diagnosis</button>
      <button onClick={() => navigate('/')}>Back</button>
      {diagnosis && (
        <div className="diagnosis">
          <h3>Diagnosis Summary</h3>
          <p>{diagnosis}</p>
        </div>
      )}
    </div>
  );
};

export default Results;