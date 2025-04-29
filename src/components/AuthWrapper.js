import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import Login from './components/Login';
import AddPatient from './AddPatient';
import './Spinner.css'; // Importamos los estilos del spinner

const AuthWrapper = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      authListener?.subscription?.unsubscribe?.();
    };
  }, []);

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner" />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      {user ? (
        <AddPatient user={user} />
      ) : (
        <Login setUser={setUser} />
      )}
    </div>
  );
};

export default AuthWrapper;
