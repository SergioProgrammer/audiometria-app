import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AudiometryChart from './AudiometryChart';

const MainChart = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedPatient, setSelectedPatient] = useState(location.state?.patient || null);

  useEffect(() => {
    // Redirigir al usuario a la página de búsqueda de pacientes si no hay un paciente seleccionado
    if (!selectedPatient) {
      navigate('/search-patient', { state: { fromChart: true } });
    }
  }, [selectedPatient, navigate]);

  const handleStartTest = () => {
    if (!selectedPatient) {
      alert('Please select a patient before starting the test.');
      return;
    }

    // Aquí puedes iniciar la prueba o redirigir a otra página
    console.log('Starting test for patient:', selectedPatient);
  };

  return (
    <div>
      <h2>Main Chart</h2>
      {selectedPatient ? (
        <div>
          <p>
            <strong>Selected Patient:</strong> {selectedPatient.name} - {selectedPatient.dni}
          </p>
          <AudiometryChart patient={selectedPatient} />
          <button onClick={handleStartTest}>Start Test</button>
        </div>
      ) : (
        <p>Loading patient information...</p>
      )}
    </div>
  );
};

export default MainChart;