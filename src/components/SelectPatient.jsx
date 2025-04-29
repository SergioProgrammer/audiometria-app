import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';

const SelectPatient = ({ user }) => {
  const [patients, setPatients] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching patients:', error.message);
      } else {
        setPatients(data);
      }
    };

    fetchPatients();
  }, [user]);

  const handleSelect = (patient) => {
    // Navega a la página de resultados con el paciente seleccionado
    navigate('/results', { state: { patient } });
  };

  return (
    <div>
      <h2>Select a Patient</h2>
      <ul>
        {patients.map((p) => (
          <li key={p.id}>
            <button onClick={() => handleSelect(p)}>
              {p.name} - {p.dni}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SelectPatient;
