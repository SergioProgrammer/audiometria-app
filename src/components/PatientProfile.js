import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import AudiometryTable from './AudiometryTable';

const PatientProfile = () => {
  const { patientId } = useParams();
  const navigate = useNavigate(); 
  const [patient, setPatient] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedDni, setEditedDni] = useState('');
  const [results, setResults] = useState([]);
  const [newResults, setNewResults] = useState({ rightEarValues: [], leftEarValues: [] });

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
      setResults(resultData || []);
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
    const { error } = await supabase.from('audiometry_results').insert([
      {
        patient_id: patientId,
        right_ear_values: newResults.rightEarValues,
        left_ear_values: newResults.leftEarValues,
        created_at: new Date(),
      },
    ]);
    if (error) {
      console.error('Error adding results', error);
    } else {
      alert('Results added successfully');
    }
  };

  // ✅ Nueva función para eliminar paciente
  const handleDeletePatient = async () => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this patient and all their results?'
    );
    if (!confirmDelete) return;

    // Elimina resultados asociados primero
    await supabase.from('audiometry_results').delete().eq('patient_id', patientId);

    // Luego elimina el paciente
    const { error } = await supabase.from('patients').delete().eq('id', patientId);
    if (error) {
      alert('Error deleting patient');
    } else {
      alert('Patient deleted successfully');
      navigate('/'); // Redirige al home o lista
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
              <button onClick={handleDeletePatient} style={{ color: 'red', marginLeft: '1rem' }}>
                Delete Patient
              </button>
            </div>
          )}
        </>
      )}

      <h3>History of Audiometry Results</h3>
      {results.length ? (
        <AudiometryTable data={results} />
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
