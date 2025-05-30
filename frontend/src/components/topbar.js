import './style/topbar.css';

function TopBar({ user }) {  
  return (
    <nav className="topbar" id="topNav">

      <div className="overlay-box"></div>

      <div className="total_content_top">
        <div className="left-section">
          <a href="/"> {
            <svg width="50" height="50" viewBox="0 0 314 314" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="88" y="18" width="10" height="61" fill="#30A0CD"/>
              <rect x="45" y="47" width="10" height="109" fill="#30A0CD"/>
              <rect x="117" y="250" width="10" height="55" fill="#30A0CD"/>
              <path d="M48.1088 235.536C46.5449 215.343 62.2274 209.431 70.2642 209L88.5098 230.359C92.4196 237.262 99.7178 253.141 97.6326 261.426C95.5474 269.71 78.5181 264.878 70.2642 261.426C63.5307 261.21 49.6727 255.73 48.1088 235.536Z" fill="#30A0CD" stroke="#30A0CD"/>
              <path d="M157 305V261.129C177.422 256.548 221.013 242.946 231.999 225.186C242.984 207.426 254.181 172.329 258.407 157H306.997C307.173 174.267 299.075 218.314 265.273 256.371C231.47 294.429 179.007 304.648 157 305Z" fill="#30A0CD" stroke="#30A0CD"/>
              <path d="M236 93.9735C241.49 80.1383 252.941 58.1223 254.824 80.7399C256.706 103.357 243.059 98.9863 236 93.9735Z" fill="#30A0CD" stroke="#30A0CD"/>
              <path d="M237.639 96.351C252.549 90.9717 279.164 84.9183 266.343 103.739C253.522 122.559 241.865 106.655 237.639 96.351Z" fill="#30A0CD" stroke="#30A0CD"/>
              <path d="M154 56.4255V10.3339C167.184 -2.75379 271.454 43.9068 235.499 34.2333C199.543 24.5597 231.903 92.8436 216.323 79.1868C203.858 68.2614 169.581 59.4604 154 56.4255Z" fill="#30A0CD" stroke="#30A0CD"/>
              <circle cx="157" cy="157" r="152" stroke="#204173" stroke-width="10"/>
              <circle cx="157.5" cy="156.5" r="99.5" stroke="#204173" stroke-width="10"/>
              <line x1="3" y1="159" x2="61" y2="159" stroke="#204173" stroke-width="10"/>
              <line x1="256" y1="159" x2="314" y2="159" stroke="#204173" stroke-width="10"/>
              <line x1="159" y1="258" x2="159" y2="311" stroke="#204173" stroke-width="10"/>
              <line x1="159" y1="5" x2="159" y2="58" stroke="#204173" stroke-width="10"/>
              <circle cx="245" cy="56" r="9" fill="#30A0CD"/>
              <circle cx="131.5" cy="31.5" r="4.5" fill="#30A0CD"/>
              <circle cx="277.5" cy="133.5" r="4.5" fill="#30A0CD"/>
              <circle cx="36" cy="195" r="7" fill="#30A0CD"/>
            </svg>
          } </a>
          <a href="/">FitCheck</a>
        </div>

        <div className = "buttonContainer">
          <div className = "loginAccount"> 
            <a href="/account"><img src="imgs/person.png" alt="Person icon" /></a>
            <a href="/account">{user ? `Hello ${user.displayName}!` : 'Sign In'}</a>
          </div>
          
          <div className = "logoutTopbar">
            {user ? <a href="/logout">Sign Out</a> : null}
          </div>
          
        </div>

      </div>
    </nav>
  );
}

export default TopBar;

