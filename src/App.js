import React, { useState } from 'react';
import AudiometryChart from './components/AudiometryChart';  // Asegúrate de tener este componente
import AudiometryTable from './components/AudiometryTable';  // Y este también
import './index.css';

const App = () => {
  const [user, setUser] = useState(null);
  const [data, setData] = useState({ labels: [], values: [] });
  const [selectedTest, setSelectedTest] = useState('test1'); // Mantener el estado de la prueba seleccionada

  const handleLogin = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    // Aquí simularíamos un login (deberías agregar autenticación real)
    if (email === "test@example.com" && password === "password") {
      setUser({ email });
    } else {
      alert("Credenciales incorrectas");
    }
  };

  const handleDataSubmit = (e) => {
    e.preventDefault();
    // Aquí simularíamos un envío de datos de la prueba de audiometría
    setData({
      labels: ['0Hz', '500Hz', '1000Hz', '2000Hz', '4000Hz'],
      values: [20, 40, 60, 80, 100], // Esto sería un ejemplo de pérdida auditiva
    });
  };

  const handleTestChange = (e) => {
    setSelectedTest(e.target.value);
  };

  return (
    <div className="container">
      <div className="form-container">
        {!user ? (
          <form onSubmit={handleLogin}>
            <h2>Iniciar Sesión</h2>
            <div>
              <input
                name="email"
                type="email"
                placeholder="Correo electrónico"
                required
              />
            </div>
            <div>
              <input
                name="password"
                type="password"
                placeholder="Contraseña"
                required
              />
            </div>
            <button type="submit">Entrar</button>
          </form>
        ) : (
          <div>
            <h2>Bienvenido, {user.email}</h2>
            <form onSubmit={handleDataSubmit}>
              <button type="submit">Cargar Resultados de Audiometría</button>
            </form>
            
            <div>
              <h3>Selecciona el tipo de prueba:</h3>
              <select onChange={handleTestChange} value={selectedTest}>
                <option value="test1">Prueba 1</option>
                <option value="test2">Prueba 2</option>
                <option value="test3">Prueba 3</option>
                <option value="test4">Prueba 4</option>
              </select>
            </div>

            <div className="chart-container">
              <h2>Gráfico de Audiometría</h2>
              <AudiometryChart data={data} />
            </div>

            {/* Mostrar la tabla correspondiente según el tipo de prueba seleccionada */}
            <div className="table-container">
              <h2>Tabla de Resultados de Audiometría</h2>
              {selectedTest === 'test1' && <AudiometryTable test="test1" />}
              {selectedTest === 'test2' && <AudiometryTable test="test2" />}
              {selectedTest === 'test3' && <AudiometryTable test="test3" />}
              {selectedTest === 'test4' && <AudiometryTable test="test4" />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
