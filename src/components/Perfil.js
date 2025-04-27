import React from 'react';
import { useNavigate } from 'react-router-dom';

const SubscriptionControl = () => {
  const navigate = useNavigate();

  const handleUpgrade = () => {
    alert('Funcionalidad de actualización de suscripción aún no implementada.');
  };

  const handleCancel = () => {
    alert('Funcionalidad de cancelación de suscripción aún no implementada.');
  };

  return (
    <div className="subscription-container">
      <h2>Profile Settings</h2>
      <button onClick={handleUpgrade}>User Control</button>
      <button onClick={handleCancel}>Patient control</button>
      <button onClick={() => navigate('/')}>Back</button>
    </div>
  );
};

export default SubscriptionControl;