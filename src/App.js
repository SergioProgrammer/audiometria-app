import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import AudiometryChart from './components/AudiometryChart';
import AudiometryTable from './components/AudiometryTable';
import SubscriptionControl from './components/SubscriptionControl';
import Perfil from './components/Perfil';
import Results from './components/Results';
import { auth, db } from './firebase';  // 🔥 Importa Firebase
import { signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import './index.css';

const App = () => {
  const [user, setUser] = useState(null);
  const [data, setData] = useState({
    labels: ['0Hz', '500Hz', '1000Hz', '2000Hz', '4000Hz'],
    rightEarValues: [0, 0, 0, 0, 0],
    leftEarValues: [0, 0, 0, 0, 0],
  });
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // Leer usuario de localStorage al iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Formulario enviado"); // Verifica si el formulario está siendo enviado
  
    const email = e.target.email.value;
    const password = e.target.password.value;
  
    try {
      console.log("Attempting to sign in...");
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Login successful!", userCredential);
  
      const userId = userCredential.user.uid;
      const userDoc = await getDoc(doc(db, "users", userId));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log("User data retrieved:", userData);
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        alert("No profile found.");
      }
    } catch (error) {
      console.error("Login error:", error.message);
      alert('Error during login: ' + error.message);
      if (error.code === 'auth/user-not-found') {
        alert('No user found with this email.');
      } else if (error.code === 'auth/wrong-password') {
        alert('Incorrect password. Please try again.');
      } else {
        alert('An error occurred during login. Please try again later.');
      }
    }
  };
  
  

  const handleLogout = async () => {
    await signOut(auth);
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
      // Intentamos crear un nuevo usuario con el correo y la contraseña
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Guardamos el usuario en el estado y en localStorage
      const newUser = {
        email: user.email,
        name,
        subscription,
      };

      // Guardamos la información del usuario en Firestore
      await setDoc(doc(db, "users", user.uid), newUser);

      // Actualizamos el estado y localStorage
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      setIsRegisterModalOpen(false);
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        alert('This email is already registered. Please use a different email.');
      } else {
        console.error("Registration error:", error);
        alert('An error occurred while registering. Please try again.');
      }
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
        <Route path="/subscriptions" element={<SubscriptionControl />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/results" element={<Results data={data} />} />
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
        <h3>{user.name}</h3>
        <p>{user.email}</p>
        {user.subscription && <p>Subscription: {user.subscription}€/month</p>}
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
