import { Link } from 'react-router-dom';

function NavBar() {

return (
    <nav id="navbar" className="sidenav">
      <ul>
        <li><p>MENU</p></li>
        <li><Link to="/content_dashboard"><img src="/imgs/dashboard-icon.png" alt="Dashboard icon"/>Dashboard</Link></li>
        <li><Link to="/"><img src="/imgs/home-icon.png" alt="Home icon"/>Homepage</Link></li>
        <li><a href="/info"><img src="/imgs/info-icon.png" alt="Info icon"/>Information Menu</a></li>
        <li><a href="/checkin"><img src="/imgs/checkin-icon.png" alt="Checkin icon"/>Daily Check-in</a></li>
      </ul>
      <ul>
        <li><p>OTHER</p></li>
        <li><a href="/account"><img src="/imgs/settings-icon.png" alt="Settings icon"/>Settings</a></li>
        <li><a href="/account"><img src="/imgs/account-icon.png" alt="Account icon"/>My Account</a></li>
        <li><a href="/account"><img src="/imgs/help-icon.png" alt="Help icon"/>Help</a></li>
      </ul>
    </nav>
  );
}

export default NavBar;