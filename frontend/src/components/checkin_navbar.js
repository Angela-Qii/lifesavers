function CheckinNavbar() {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Outfit:wght@100..900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
        rel="stylesheet"
      />

      <style>{`
        #checkin_nav ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        #checkin_nav .check_btn_nav {
          display: flex;
          background-color: #e7f5ff;
          outline: 1px solid #e0f2ff;
          padding-top: 15px; 
          padding-bottom: 15px;
        }
        
        #checkin_nav .check_nav_title {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          background-color: #e7f5ff;
          outline: 1px solid #e0f2ff;
          font-weight: 800;
          padding-top: 15px; 
          padding-bottom: 15px;
          font-family: 'Poppins', sans-serif;
          font-weight: 700;
          padding-left: 13px;
          font-size: 17px;
        }

        #checkin_nav img {
          height: 100%;
          width: auto;
          object-fit: cover;
        }

        #checkin_nav button {
          border: none;
          padding: 1em 0;
          background-color: #e7f5ff;
          width: 100%;
          height: 100%;
          color: #c4cade;
          font-family: 'Poppins', sans-serif;  
          font-weight: 600; 
          font-size: 15px;
          text-align: left;
          padding-left: 13px;
        }

        #checkin_nav .first_sec {
          border-left: 10px solid #5d7d9b;
        }
      `}</style>

      <nav
        id="checkin_nav"
        className="sidenav"
        style={{
          flex: "0 0 200px",
          marginLeft: "auto",
        }}
      >
        <ul>
          <li className="check_nav_title">
            <p>Tracking Sections</p>
          </li>
          <li className="first_sec">
            <button id="lesion-btn">Lesions</button>
          </li>
          <li className="check_btn_nav">
            <button id="stress-btn">Stress</button>
          </li>
          <li className="check_btn_nav">
            <button id="hormone-btn">Hormone Cycle</button>
          </li>
          <li className="check_btn_nav">
            <button id="sun-btn">Sun Exposure</button>
          </li>
          <li className="check_btn_nav">
            <button id="medication-btn">Medication</button>
          </li>
          <li className="check_btn_nav">
            <button id="routine-btn">Skin Care Routine</button>
          </li>
          <li className="check_btn_nav">
            <button id="diet-btn">Diet</button>
          </li>
          <li className="check_btn_nav">
            <button id="weather-btn">Weather</button>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default CheckinNavbar;
