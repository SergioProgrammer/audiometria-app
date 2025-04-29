import React, { useState } from 'react';
import { supabase } from '../supabase';

const AddPatient = ({ user }) => {
  const [name, setName] = useState('');
  const [dni, setDni] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name || !dni) {
      setError('Name and DNI are required');
      return;
    }

    if (!user) {
      setError('You must be logged in to add a patient');
      return;
    }

    try {
      // Insertar paciente con el user_id del usuario autenticado
      const { error } = await supabase.from('patients').insert([
        {
          name,
          dni,
          user_id: user.id, // ← Guardamos el técnico que creó el paciente
        },
      ]);

      if (error) {
        setError(error.message);
      } else {
        setSuccess('Patient added successfully');
        setName('');
        setDni('');
      }
    } catch (err) {
      setError('Error adding patient');
    }
  };

  return (
    <div>
      <h2>Add New Patient</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Patient Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Patient DNI"
          value={dni}
          onChange={(e) => setDni(e.target.value)}
        />
        <button type="submit">Add Patient</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
};

export default AddPatient;
