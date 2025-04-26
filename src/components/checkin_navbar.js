function CheckinNavbar() {
  return (
    <nav id="checkin_nav" className="sidenav">
      <ul>
        <li><p>Tracking Sections</p></li>
        <li><button id="lesion-btn">Lesions</button></li>
        <li><button id="stress-btn">Stress</button></li>
        <li><button id="hormone-btn">Hormone Cycle</button></li>
        <li><button id="sun-btn">Sun Exposure</button></li>
        <li><button id="medication-btn">Medication</button></li>
        <li><button id="routine-btn">Skin Care Routine</button></li>
        <li><button id="diet-btn">Diet</button></li>
        <li><button id="weather-btn">Weather</button></li>
      </ul>
    </nav>
  );
}

export default CheckinNavbar;