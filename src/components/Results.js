import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabase';

const Results = ({ data = { rightEarValues: [], leftEarValues: [], labels: [] } }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [diagnosis, setDiagnosis] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedPatient] = useState(location.state?.patient || null);

  useEffect(() => {
    if (!selectedPatient && location.state?.fromResults) {
      alert('Please select a patient first.');
      navigate('/search-patient');
    }
  }, [selectedPatient, location.state, navigate]);

  const generateDiagnosis = () => {
    const { rightEarValues, leftEarValues } = data;

    if (!rightEarValues?.length || !leftEarValues?.length) {
      setDiagnosis('No data available to generate a diagnosis.');
      return;
    }

    const average = (arr) =>
      arr.reduce((sum, val) => sum + (typeof val === 'number' ? val : 0), 0) / arr.length;

    const avgRight = average(rightEarValues);
    const avgLeft = average(leftEarValues);

    let diagnosisText = '';

    if (avgRight > 60 && avgLeft > 60) {
      diagnosisText = 'Severe hearing loss in both ears. Hearing aids or further evaluation recommended.';
    } else if (avgRight > 60) {
      diagnosisText = 'Severe hearing loss in the right ear. Further evaluation recommended.';
    } else if (avgLeft > 60) {
      diagnosisText = 'Severe hearing loss in the left ear. Further evaluation recommended.';
    } else if (avgRight > 40 || avgLeft > 40) {
      diagnosisText = 'Moderate hearing loss. Preventive measures are advised.';
    } else {
      diagnosisText = 'Normal hearing levels. Regular check-ups recommended.';
    }

    setDiagnosis(diagnosisText);
  };

  const handleAssignResults = async () => {
    if (!selectedPatient) {
      alert('Please select a patient to assign the results.');
      return;
    }

    if (!diagnosis) {
      alert('Please generate a diagnosis before assigning the results.');
      return;
    }

    setLoading(true);

    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData?.user) {
      alert('Failed to get current user.');
      setLoading(false);
      return;
    }

    const results = (data.labels || []).map((label, index) => ({
      user_id: userData.user.id,
      patient_id: selectedPatient.id,
      frequency: label,
      right_ear_value: data.rightEarValues?.[index] ?? 0,
      left_ear_value: data.leftEarValues?.[index] ?? 0,
      diagnosis,
      created_at: new Date().toISOString(),
    }));

    try {
      const { error } = await supabase.from('audiometry_results').insert(results);

      if (error) {
        console.error('Error assigning results:', error.message);
        alert('Error assigning results: ' + error.message);
      } else {
        alert('Results assigned successfully!');
        navigate(`/patient-profile/${selectedPatient.id}`);
      }
    } catch (error) {
      console.error('Unexpected error while assigning results:', error);
      alert('Unexpected error occurred while assigning results.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchPatient = () => {
    navigate('/search-patient', { state: { fromResults: true } });
  };

  return (
    <div className="results-container">
      <h2>Results</h2>

      <button onClick={generateDiagnosis} style={{ color: 'white', marginLeft: '0rem', marginTop: '1rem' }}>Generate Diagnosis</button>

      {diagnosis && (
        <div className="diagnosis">
          <h4>Diagnosis Summary</h4>
          <p>{diagnosis}</p>
        </div>
      )}

      <div>
        <h3>Select a Patient</h3>
        <button onClick={handleSearchPatient} style={{ color: 'white', marginLeft: '0rem', marginTop: '1rem' }}>Search Patient</button>
        {selectedPatient && <p>Selected Patient: <strong>{selectedPatient.name}</strong></p>}
      </div>

      <button
        onClick={handleAssignResults}
        disabled={loading || !selectedPatient || !diagnosis}
      >
        {loading ? 'Assigning...' : 'Assign Results'}
      </button>

      <button onClick={() => navigate('/')} style={{ color: 'white', marginLeft: '0rem', marginTop: '1rem', marginBlock: '0rem'}}>Back</button>
    </div>
  );
};

export default Results;
