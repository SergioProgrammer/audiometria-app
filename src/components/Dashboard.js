import React from 'react';

const Dashboard = ({ user, data, setData }) => {
  return (
    <div className="dashboard">
      <h2>Welcome, {user.name}</h2>
      <p>Email: {user.email}</p>
      <div>
        <h3>Audiometry Data</h3>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  );
};

export default Dashboard;