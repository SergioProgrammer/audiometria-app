import React, { useState } from 'react';
import { supabase } from '../supabase';
import { useNavigate, useLocation } from 'react-router-dom';

const SearchPatient = ({ user }) => {
  const [search, setSearch] = useState('');
  const [patients, setPatients] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .ilike('dni', `%${search}%`)
      .eq('user_id', user.id); // Filtrar por técnico

    if (error) {
      console.error('Error:', error.message);
    } else {
      setPatients(data);
    }
  };

  const handleSelectPatient = (patient) => {
    // Redirigir al componente principal del gráfico con el paciente seleccionado
    if (location.state?.fromChart) {
      navigate('/main-chart', { state: { patient } });
    } else {
      navigate(`/patient-profile/${patient.id}`);
    }
  };

  return (
    <div>
      <h2>Search Patient</h2>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search by DNI"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {patients.length > 0 ? (
        <ul>
          {patients.map((p) => (
            <li key={p.id}>
              <button
                onClick={() => handleSelectPatient(p)}
                style={{ color: 'white', marginLeft: '0rem', marginTop: '1rem' }}
              >
                {p.name} - {p.dni}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No patients found</p>
      )}
    </div>
  );
};

export default SearchPatient;