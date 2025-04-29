import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';

const History = () => {
  const [patients, setPatients] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      const { data, error } = await supabase
        .from('patients')
        .select('*');

      if (error) {
        console.error('Error fetching patients:', error.message);
      } else {
        setPatients(data);
      }
    };

    fetchPatients();
  }, []);

  return (
    <div>
      <h2>Patient List</h2>
      {patients.length > 0 ? (
        <ul>
          {patients.map((patient) => (
            <li key={patient.id}>
              <button onClick={() => navigate(`/patient-profile/${patient.id}`)}>
                {patient.name} - {patient.dni}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No patients found.</p>
      )}
    </div>
  );
};

export default History;
