import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import './css/login.css';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getDatabase, ref, serverTimestamp, set, update } from 'firebase/database';
import { auth, database, app } from '../firebase/config';

function Signup() {
    const navigateTo = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmedPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
  
    // used AI to figure out how to validate email for this
    const validateEmail = (email) => {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(String(email).toLowerCase());
    };
  
    // creating an accounts
    const createAccount = async (event) => {
      event.preventDefault();
  
      // check to see if email is valid
      if (!validateEmail(email)) {
        setError('Invalid email format');
        return;
      }
      // check to see if passwords match
      if (password !== confirmedPassword) {
        setError("Passwords don't match!");
        return;
      }
  
      // empty errors
      setError('');
      setLoading(true);
      // account being processed
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await updateProfile(user, {
          displayName: username
        });
        await set(ref(database, 'users/' + user.uid), {
          username: username,
          email: email,
          createdAt: serverTimestamp(),
        });
        setLoading(false);
        alert('Account Created Successfully!');
        navigateTo('/login');
      } catch (error) {
        setLoading(false);
        setError(error.message);
      } 
    };
  
    return (
      <div className="container">
        <div className="center">
          <h1>Sign Up</h1>
          <form onSubmit={createAccount}>
            <div className="txt_field">
              <input type="text" name="username" placeholder="Username" required onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className="txt_field">
              <input type="email" name="email" placeholder="Email" required onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="txt_field">
              <input type="password" name="password" placeholder="Password" required onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="txt_field">
              <input type="password" name="confirm_password" placeholder="Confirm Password" required onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>
            {error && <p className='err'>{error}</p>}
            <input id="submit" type="submit" value="Sign Up" disabled={loading} />
            {loading && <p>Loading...</p>}
            <div className="signup_link">
              Already Have An Account? <a href="/login">Login</a>
            </div>
          </form>
        </div>
      </div>
    );
  }
  
  export default Signup;