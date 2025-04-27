import React, { useState } from 'react';
import AudiometryChart from './components/AudiometryChart';
import AudiometryTable from './components/AudiometryTable';
import './index.css';

const App = () => {
  const [user, setUser] = useState(null);
  const [data, setData] = useState({
    labels: ['0Hz', '500Hz', '1000Hz', '2000Hz', '4000Hz'],
    values: [0, 0, 0, 0, 0], // Inicializa los valores en 0
  });

  const handleLogin = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (email === "test@example.com" && password === "password") {
      setUser({ email, name: "John Doe", profilePic: "https://via.placeholder.com/100" });
    } else {
      alert("Credenciales incorrectas");
    }
  };

  const handleRegister = () => {
    alert("Funcionalidad de registro aún no implementada.");
  };

  const handleDataChange = (updatedData) => {
    setData(updatedData); // Actualiza los datos del gráfico cuando cambian en la tabla
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
            <button
              type="button"
              className="register-button"
              onClick={handleRegister}
            >
              Registrarse
            </button>
          </form>
        ) : (
          <div className="dashboard">
            {/* Box de perfil */}
            <div className="profile-box">
              <img src={user.profilePic} alt="Foto de perfil" className="profile-pic" />
              <h3>{user.name}</h3>
              <p>{user.email}</p>
              <button>Configuraciones</button>
              <button>Control de Suscripción</button>
            </div>

            {/* Contenido principal */}
            <div className="main-content">
              <div className="chart-container">
                <h2>Gráfico de Audiometría</h2>
                <AudiometryChart data={data} />
              </div>

              <div className="table-container">
                <h2>Tabla de Resultados de Audiometría</h2>
                <AudiometryTable data={data} onDataChange={handleDataChange} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;