import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { auth } from './components/firebase';
import Login from './components/login';
import Logout from './components/logout';
import Signup from './components/signup';
import Checkin from './components/checkin';
import Info from './components/info';
import NavBar from './components/navbar';
import TopBar from './components/topbar';
import ContentDefault from './components/content_default';
import ContentDashboard from './components/content_dashboard';
import Account from './components/account';
import SingleCheckin from './components/single_checkin';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <div>
        <div id="top_nav" className="topbar">
          <TopBar user={user}/>
        </div>

        <div id="overall_container" className="container">
          <div id="main_nav" className="sidenav">
            <NavBar/>
          </div>
          <div className="container">
          <Routes>
            <Route path="/" element={<ContentDefault />}>
            </Route>
            <Route
                path="/content_dashboard" element={user ? <ContentDashboard user={user} /> : <Navigate to="/login" />}
            />
            {/* TODO: Add more routes. See navbar.js */}
            <Route
                path="/checkin" element={user ? <Checkin user={user} /> : <Navigate to="/login" />}
            />
            <Route
                path="/info" element={<Info />}
            />
            <Route
              path="/single/:checkinDate" element={user ? <SingleCheckin user={user} /> : <Navigate to="/login" />}
            />
            <Route
              path="/login"
              element={!user ? <Login /> : <Navigate to="/" />}
            />
            <Route
              path="/logout"
              element={user ? <Logout user={user}/> : <Navigate to="/" />}
            />
            <Route
              path="/signup"
              element={!user ? <Signup /> : <Navigate to="/" />}
            />
            <Route
              path="/account"
              element={<Account user={user} />}
            />
          </Routes>
          </div>
      </div>
    </div>
    </Router>
  );
}

export default App;