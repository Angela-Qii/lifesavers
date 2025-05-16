import './style/topbar.css';

function TopBar({ user }) {
  return (
    <nav className="topbar">
      <ul>
        <li className="left-section">
          <a href="/"><img src="imgs/logo.png" alt="Circular FitCheck logo" /></a>
          <a href="/">FitCheck</a>
        </li>
        <li>
          {user ? <a href="/logout">Sign Out</a> : null}
          <a href="/account"><img src="imgs/person.png" alt="Person icon" /></a>
          <a href="/account">{user ? `Hello ${user.displayName}!` : 'Sign In'}</a>
        </li>
      </ul>
    </nav>
  );
}

export default TopBar;