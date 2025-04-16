import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, database, app } from '../firebase/config';
import './css/login.css';

function Login() {
  const navigateTo = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const auth = getAuth(app);

  // handling users logging in
  const userLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    
    try {
      // gpted this part
      await signInWithEmailAndPassword(auth, email, password);
      setLoading(false);
      navigateTo('/gratitude');
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <div className="container">
      <div className="center">
        <h1>Login</h1>
        <form onSubmit={userLogin}>
          <div className="txt_field">
            <input type="text" name="email" placeholder="Email" required onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="txt_field">
            <input type="password" name="password" placeholder="Password" required onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && <p className='err'>{error}</p>}
          <input id="submit" type="submit" value="Login" disabled={loading} />
          {loading && <p>Loading...</p>}
          <div className="signup_link">
            Don't Have An Account? <a href="/signup">Sign up</a>
          </div>
        </form>
      </div>
      <img src="/img/welcome-cat.jpg" alt="Cat holding Welcome sign" className="welcome-image" />
    </div>
  );
}

export default Login;