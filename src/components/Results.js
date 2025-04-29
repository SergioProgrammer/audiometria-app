import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase'; // Asegúrate de que la ruta sea correcta

const Results = ({ data = { rightEarValues: [], leftEarValues: [] } }) => {
  const navigate = useNavigate();
  const [diagnosis, setDiagnosis] = useState('');

  const generateDiagnosis = async () => {
    if (!data.rightEarValues.length || !data.leftEarValues.length) {
      setDiagnosis('No data available to generate a diagnosis.');
      return;
    }

    const averageRightEar = data.rightEarValues.reduce((a, b) => a + b, 0) / data.rightEarValues.length;
    const averageLeftEar = data.leftEarValues.reduce((a, b) => a + b, 0) / data.leftEarValues.length;

    let diagnosisText = '';

    if (averageRightEar > 60 && averageLeftEar > 60) {
      diagnosisText = 'Severe hearing loss in both ears. Hearing aids or further evaluation recommended.';
    } else if (averageRightEar > 60) {
      diagnosisText = 'Severe hearing loss in the right ear. Further evaluation recommended.';
    } else if (averageLeftEar > 60) {
      diagnosisText = 'Severe hearing loss in the left ear. Further evaluation recommended.';
    } else if (averageRightEar > 40 || averageLeftEar > 40) {
      diagnosisText = 'Moderate hearing loss. Preventive measures are advised.';
    } else {
      diagnosisText = 'Normal hearing levels. Regular check-ups recommended.';
    }

    setDiagnosis(diagnosisText);

    // Save the diagnosis to the database
    await handleSave(diagnosisText);
  };

  const handleSave = async (diagnosisText) => {
    console.log('handleSave function called');

    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
      console.error('Error getting user:', error.message);
      alert('Error getting user.');
      return;
    }

    if (!user) {
      console.error('No user is logged in.');
      alert('Please log in to save results.');
      return;
    }

    // Prepare the results to save in the database
    const results = data.labels.map((label, index) => ({
      user_id: user.id, // Reference to the authenticated user's ID
      frequency: label, // Use the frequency as the label
      right_ear_value: data.rightEarValues[index],
      left_ear_value: data.leftEarValues[index],
      diagnosis: diagnosisText, // Use the diagnosis passed as a parameter
      created_at: new Date().toISOString(), // Set the creation date
    }));

    try {
      const { error } = await supabase.from('audiometry_results').insert(results);

      if (error) {
        console.error('Error saving results:', error.message);
        alert('Error saving results: ' + error.message);
      } else {
        console.log('Results saved successfully');
        alert('Results saved successfully!');
      }
    } catch (error) {
      console.error('Error inserting data:', error);
      alert('Unexpected error occurred while saving results.');
    }
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
      <button
        onClick={() => {
          if (!diagnosis) {
            alert('Please generate a diagnosis before saving.');
            return;
          }
          handleSave(diagnosis);
        }}
      >
        Save Results
      </button>
    </div>
  );
};

export default Results;
