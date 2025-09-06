import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

function App() {
  const [user, setUser] = useState(null); // null=loading, false=loggedout, object=loggedin
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/session`, { withCredentials: true })
      .then((res) => {
        if (res.data.loggedIn) {
          setUser({ email: res.data.email });
        } else {
          setUser(false);
        }
      })
      .catch(() => setUser(false));
  }, []);

  if (user === null) {
    return <div>Loading...</div>; // or spinner
  }

  if (user) {
    return <Dashboard user={user} onLogout={() => setUser(false)} />;
  }

  if (showRegister) {
    return (
      <div>
        <Register onSuccess={() => setShowRegister(false)} />
        <button onClick={() => setShowRegister(false)}>Back to Login</button>
      </div>
    );
  }

  return (
    <div>
      <Login onSuccess={() => setUser(true)} />
      <button onClick={() => setShowRegister(true)}>Register</button>
    </div>
  );
}

export default App;
