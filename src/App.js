import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import AudiometryChart from './components/AudiometryChart';
import AudiometryTable from './components/AudiometryTable';
import SubscriptionControl from './components/SubscriptionControl';
import Perfil from './components/Perfil';
import Results from './components/Results';
import './index.css';

const App = () => {
  const [user, setUser] = useState(null);
  const [data, setData] = useState({
    labels: ['0Hz', '500Hz', '1000Hz', '2000Hz', '4000Hz'],
    rightEarValues: [0, 0, 0, 0, 0],
    leftEarValues: [0, 0, 0, 0, 0],
  });

  const handleLogin = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (email === "test@example.com" && password === "12345app") {
      setUser({ email, name: "SQ", });
    } else {
      alert("Credenciales incorrectas");
    }
  };

  const handleRegister = () => {
    alert("Funcionalidad de registro aún no implementada.");
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div className="container">
              <div className="form-container">
                {!user ? (
                  <form onSubmit={handleLogin}>
                    <h2>Login</h2>
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
                    <button type="submit">Enter</button>
                    <button
                      type="button"
                      className="register-button"
                      onClick={handleRegister}
                    >
                      Register
                    </button>
                  </form>
                ) : (
                  <Dashboard user={user} data={data} setData={setData} />
                )}
              </div>
            </div>
          }
        />
        <Route path="/subscriptions" element={<SubscriptionControl />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/results" element={<Results data={data} />} />      </Routes>
    </Router>
  );
};

const Dashboard = ({ user, data, setData }) => {
  const navigate = useNavigate();

  const handleDataChange = (updatedData) => {
    setData(updatedData); // Actualiza los datos en el estado principal
  };

  return (
    <div className="dashboard">
      <div className="profile-box">
        <h3>{user.name}</h3>
        <p>{user.email}</p>
        <button onClick={() => navigate('/subscriptions')}>Subscription Settings
        </button>
        <button onClick={() => navigate('/perfil')}>Profile Control</button>
        <button onClick={() => navigate('/results')}>Results</button>
      </div>
      <div className="main-content">
        <div className="chart-container">
          <h2>Audiometry Chart</h2>
          <AudiometryChart data={data} />
        </div>
        <div className="table-container">
          <h2>Audiometry Results Table</h2>
          <AudiometryTable data={data} onDataChange={handleDataChange} />
        </div>
      </div>
    </div>
  );
};

export default App;