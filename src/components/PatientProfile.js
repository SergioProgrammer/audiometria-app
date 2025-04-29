import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import AudiometryTable from './AudiometryTable';
import AudiometryChart from './AudiometryChart';

const PatientProfile = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedDni, setEditedDni] = useState('');
  const [results, setResults] = useState(null);
  const [newResults, setNewResults] = useState({
    labels: [250, 500, 1000, 2000, 4000, 8000],
    rightEarValues: [0, 0, 0, 0, 0, 0],
    leftEarValues: [0, 0, 0, 0, 0, 0],
  });

  useEffect(() => {
    const fetchPatientData = async () => {
      const { data } = await supabase.from('patients').select('*').eq('id', patientId).single();
      if (data) {
        setPatient(data);
        setEditedName(data.name);
        setEditedDni(data.dni);
      }

      const { data: resultData } = await supabase
        .from('audiometry_results')
        .select('*')
        .eq('patient_id', patientId);

      if (resultData && resultData.length > 0) {
        // Agrupar los resultados por frecuencia
        const labels = resultData.map(r => r.frequency);
        const rightEarValues = resultData.map(r => r.right_ear_value);
        const leftEarValues = resultData.map(r => r.left_ear_value);
        setResults({ labels, rightEarValues, leftEarValues });
      } else {
        setResults(null);
      }
    };

    fetchPatientData();
  }, [patientId]);

  const handleUpdatePatient = async () => {
    const { error } = await supabase
      .from('patients')
      .update({ name: editedName, dni: editedDni })
      .eq('id', patientId);

    if (error) {
      alert('Error updating patient');
    } else {
      setPatient({ ...patient, name: editedName, dni: editedDni });
      setEditing(false);
    }
  };

  const handleAddResults = async () => {
    const frequencies = newResults.labels;
  
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) {
      alert('Error getting current user');
      return;
    }
  
    const inserts = frequencies.map((freq, i) => ({
      user_id: user.id,
      patient_id: patientId,
      frequency: freq,
      right_ear_value: newResults.rightEarValues[i],
      left_ear_value: newResults.leftEarValues[i],
      created_at: new Date().toISOString(),
    }));
  
    const { error } = await supabase.from('audiometry_results').insert(inserts);
  
    if (error) {
      console.error('Error adding results', error);
    } else {
      alert('Results added successfully');
  
      // Actualizar el estado de `results` con los nuevos datos
      setResults((prevResults) => {
        const updatedLabels = [...(prevResults?.labels || []), ...newResults.labels];
        const updatedRightEarValues = [...(prevResults?.rightEarValues || []), ...newResults.rightEarValues];
        const updatedLeftEarValues = [...(prevResults?.leftEarValues || []), ...newResults.leftEarValues];
  
        return {
          labels: updatedLabels,
          rightEarValues: updatedRightEarValues,
          leftEarValues: updatedLeftEarValues,
        };
      });
  
      // Reiniciar los valores de `newResults`
      setNewResults({
        labels: [250, 500, 1000, 2000, 4000, 8000],
        rightEarValues: [0, 0, 0, 0, 0, 0],
        leftEarValues: [0, 0, 0, 0, 0, 0],
      });
    }
  };

  const handleDeletePatient = async () => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this patient and all their results?'
    );
    if (!confirmDelete) return;

    await supabase.from('audiometry_results').delete().eq('patient_id', patientId);
    const { error } = await supabase.from('patients').delete().eq('id', patientId);
    if (error) {
      alert('Error deleting patient');
    } else {
      alert('Patient deleted successfully');
      navigate('/');
    }
  };

  return (
    <div>
      {patient && (
        <>
          <h2>Patient Profile</h2>
          {editing ? (
            <div>
              <input value={editedName} onChange={(e) => setEditedName(e.target.value)} />
              <input value={editedDni} onChange={(e) => setEditedDni(e.target.value)} />
              <button onClick={handleUpdatePatient}>Save</button>
              <button onClick={() => setEditing(false)}>Cancel</button>
            </div>
          ) : (
            <div>
              <p><strong>Name:</strong> {patient.name}</p>
              <p><strong>DNI:</strong> {patient.dni}</p>
              <button onClick={() => setEditing(true)}>Edit Info</button>
              <button onClick={handleDeletePatient} style={{ color: 'white', marginLeft: '0rem', marginTop: '1rem' }}>
                Delete Patient
              </button>
            </div>
          )}
        </>
      )}

      <h3>History of Audiometry Results</h3>
      {console.log('Results:', results)}

      {results ? (
        <>
          <AudiometryChart data={results} /> {/* Renderizar el gráfico */}
          <AudiometryTable data={results} /> {/* Renderizar la tabla */}
        </>
      ) : (
        <p>No results found for this patient.</p>
      )}

      <h3>Add New Results</h3>
      <AudiometryTable data={newResults} onDataChange={setNewResults} />
      <button onClick={handleAddResults}>Save Results</button>
    </div>
  );
};

export default PatientProfile;