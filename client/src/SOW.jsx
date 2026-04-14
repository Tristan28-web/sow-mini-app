import React, { useState } from 'react';
import Login from './Login';
import Pricelist from './Pricelist';

function App() {
  const [authToken, setAuthToken] = useState(localStorage.getItem('token') || '');

  const onLoginSuccess = (token) => {
    localStorage.setItem('token', token);
    setAuthToken(token);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuthToken('');
  };

  return (
    <>
      {!authToken ? (
        <Login onLogin={onLoginSuccess} />
      ) : (
        <Pricelist token={authToken} onLogout={handleLogout} />
      )}
    </>
  );
}

export default App;
