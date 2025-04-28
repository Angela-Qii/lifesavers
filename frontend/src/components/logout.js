import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { getAuth, signOut } from 'firebase/auth';
import { auth, database } from './firebase';

function Logout({user}) {
  const navigateTo = useNavigate();
  const auth = getAuth();
    const [error, setError] = useState('');
  const userLogout = async (event) => {
    event.preventDefault();

    try {
      await signOut(auth);
      navigateTo('/login');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="container">
      <div className="center">
        <h1>Log Out?</h1>
        <form onSubmit={userLogout}>
          <input id="submit" type="submit" value="Logout" />
        </form>
      </div>
    </div>
  );
}

export default Logout;