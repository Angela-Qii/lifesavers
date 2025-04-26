import { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from './firebase.bundle.js';

// Check if user is on the home page or login page
const isLoginPage = window.location.pathname.includes('login.html');
const isSignupPage = window.location.pathname.includes('signup.html');
alert("here");
if (isLoginPage || isSignupPage) {
  // Login page logic
  const authForm = document.getElementById('login-form');
  const loginBtn = document.getElementById('login-btn');
  const registerBtn = document.getElementById('signup-btn');
  const errorMessage = document.getElementById('error-message');

  authForm.addEventListener('submit', (e) => {
    alert("here");
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    alert(email);
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        window.location.href = '/';
      })
      .catch((error) => {
        errorMessage.textContent = error.message;
      });
  });

  registerBtn.addEventListener('click', () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        window.location.href = '/';
      })
      .catch((error) => {
        errorMessage.textContent = error.message;
      });
  });
}