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
  const [resultsByDate, setResultsByDate] = useState({});
  const [newResults, setNewResults] = useState({
    labels: [250, 500, 1000, 2000, 4000, 8000],
    rightEarValues: [0, 0, 0, 0, 0, 0],
    leftEarValues: [0, 0, 0, 0, 0, 0],
  });

  const fetchPatientData = async () => {
    const { data: patientData } = await supabase
      .from('patients')
      .select('*')
      .eq('id', patientId)
      .single();

    if (patientData) {
      setPatient(patientData);
      setEditedName(patientData.name);
      setEditedDni(patientData.dni);
    }

    const { data: resultData } = await supabase
      .from('audiometry_history_test')
      .select('*')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false });

    if (resultData && resultData.length > 0) {
      const grouped = {};

      resultData.forEach((r) => {
        const date = new Date(r.created_at).toLocaleDateString();
        if (!grouped[date]) {
          grouped[date] = {
            labels: [],
            rightEarValues: [],
            leftEarValues: [],
          };
        }

        grouped[date].labels.push(r.frequency);
        grouped[date].rightEarValues.push(r.right_ear_value);
        grouped[date].leftEarValues.push(r.left_ear_value);
      });

      setResultsByDate(grouped);
    } else {
      setResultsByDate({});
    }
  };

  useEffect(() => {
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
    const inserts = frequencies.map((freq, i) => ({
      patient_id: parseInt(patientId, 10),
      frequency: freq,
      right_ear_value: newResults.rightEarValues[i],
      left_ear_value: newResults.leftEarValues[i],
      created_at: new Date().toISOString(),
    }));

    const { error } = await supabase.from('audiometry_history_test').insert(inserts);

    if (error) {
      console.error('Error adding results', error);
    } else {
      alert('Results added successfully');
      setNewResults({
        labels: [250, 500, 1000, 2000, 4000, 8000],
        rightEarValues: [0, 0, 0, 0, 0, 0],
        leftEarValues: [0, 0, 0, 0, 0, 0],
      });
      await fetchPatientData();
    }
  };

  const handleDeletePatient = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this patient and all their results?');
    if (!confirmDelete) return;

    await supabase.from('audiometry_history_test').delete().eq('patient_id', patientId);
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
              <button onClick={handleDeletePatient} style={{ color: 'white', marginTop: '1rem' }}>
                Delete Patient
              </button>
            </div>
          )}
        </>
      )}

      <h3>History of Audiometry Results</h3>
      {Object.keys(resultsByDate).length > 0 ? (
        Object.entries(resultsByDate).map(([date, data]) => (
          <div key={date}>
            <h4>{date}</h4>
            <AudiometryChart data={data} />
            <AudiometryTable data={data} />
          </div>
        ))
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
