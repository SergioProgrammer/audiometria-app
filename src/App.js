import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import AudiometryChart from './components/AudiometryChart';
import AudiometryTable from './components/AudiometryTable';
import SubscriptionControl from './components/SubscriptionControl';
import Perfil from './components/Perfil';
import Results from './components/Results';
import { supabase } from './supabase'; 
import './index.css';

// Componente de ruta protegida
const ProtectedRoute = ({ user, children }) => {
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const App = () => {
  const [user, setUser] = useState(null);
  const [data, setData] = useState({
    labels: ['0Hz', '500Hz', '1000Hz', '2000Hz', '4000Hz'],
    rightEarValues: [0, 0, 0, 0, 0],
    leftEarValues: [0, 0, 0, 0, 0],
  });
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  useEffect(() => {
    // Al cargar la app, verificamos si hay sesión activa
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
      }
    };
  
    getSession();
  
    // Escuchar cambios de sesión en tiempo real
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Cambio en la sesión:', event);
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
      }
    });
  
    // Limpiar el listener al desmontar el componente
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);
  

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
  
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
  
      if (error) {
        console.error('Error de inicio de sesión:', error.message);
        alert('Error: ' + error.message);
      } else {
        console.log('Usuario logueado:', data);
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
    } catch (error) {
      console.error('Error inesperado:', error);
      alert('Hubo un error inesperado.');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem('user');
  };

  const handleRegisterOpen = () => {
    setIsRegisterModalOpen(true);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const subscription = e.target.subscription.value;

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            subscription,
          },
        },
      });

      if (error) {
        console.error('Error en el registro:', error.message);
        alert('Hubo un error en el registro: ' + error.message);
      } else {
        console.log('Usuario registrado:', data);
        alert('Te hemos enviado un correo para verificar tu email. Revisa tu bandeja de entrada.');
        setIsRegisterModalOpen(false);
      }
    } catch (error) {
      console.error('Error inesperado:', error);
      alert('Hubo un error inesperado.');
    }
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
                  <>
                    <form onSubmit={handleLogin}>
                      <h2>Login</h2>
                      <div>
                        <input name="email" type="email" placeholder="Email" required />
                      </div>
                      <div>
                        <input name="password" type="password" placeholder="Password" required />
                      </div>
                      <button type="submit">Enter</button>
                      <button type="button" className="register-button" onClick={handleRegisterOpen}>
                        Register
                      </button>
                    </form>

                    {isRegisterModalOpen && (
                      <div className="modal-overlay">
                        <div className="modal-content">
                          <h2>Register</h2>
                          <form onSubmit={handleRegisterSubmit}>
                            <input name="name" type="text" placeholder="Full Name" required />
                            <input name="email" type="email" placeholder="Email Address" required />
                            <input name="password" type="password" placeholder="Password" required />

                            <h3>Choose a subscription:</h3>
                            <div>
                              <label>
                                <input type="radio" name="subscription" value="50" required />
                                Basic Plan - 50€/month
                              </label>
                            </div>
                            <div>
                              <label>
                                <input type="radio" name="subscription" value="120" />
                                Pro Plan - 120€/month
                              </label>
                            </div>
                            <div>
                              <label>
                                <input type="radio" name="subscription" value="200" />
                                Premium Plan - 200€/month
                              </label>
                            </div>

                            <button type="submit">Register</button>
                            <button type="button" onClick={() => setIsRegisterModalOpen(false)}>
                              Close
                            </button>
                          </form>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <Dashboard user={user} data={data} setData={setData} onLogout={handleLogout} />
                )}
              </div>
            </div>
          }
        />

        {/* Rutas protegidas */}
        <Route
          path="/subscriptions"
          element={
            <ProtectedRoute user={user}>
              <SubscriptionControl />
            </ProtectedRoute>
          }
        />
        <Route
          path="/perfil"
          element={
            <ProtectedRoute user={user}>
              <Perfil />
            </ProtectedRoute>
          }
        />
        <Route
          path="/results"
          element={
            <ProtectedRoute user={user}>
              <Results data={data} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

const Dashboard = ({ user, data, setData, onLogout }) => {
  const navigate = useNavigate();

  const handleDataChange = (updatedData) => {
    setData(updatedData);
  };

  return (
    <div className="dashboard">
      <div className="profile-box">
        <h3>{user.user_metadata?.name || "No Name"}</h3>
        <p>{user.email}</p>
        {user.user_metadata?.subscription && <p>Subscription: {user.user_metadata.subscription}€/month</p>}
        <button onClick={() => navigate('/subscriptions')}>Subscription Settings</button>
        <button onClick={() => navigate('/perfil')}>Profile Control</button>
        <button onClick={() => navigate('/results')}>Results</button>
        <button onClick={onLogout}>Logout</button>
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
