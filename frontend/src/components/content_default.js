import { Link } from 'react-router-dom';

function ContentDefault() {
    let checkinDate0 = Date.now(); // Timestamp, e.g., 1743035580000
    let checkinDate = new Date(checkinDate0).toISOString().split('T')[0];
    return (
        <div id="content">
      {/* <!-- Will only display info when an error occurs --> */}
      <p id="error_info"></p>
            <h1>Homepage</h1>
            <div className="horizontal">
                <div>
                    <h3>Personal Information</h3>
                    <div className="gray_box"></div>
                </div>
                <div>
                    <div>
                        <h3>Daily-Check in</h3>
                        <div className="gray_box"></div>
                    </div>
                    <div>
                        <h3>Calendar</h3>
                        <div className="gray_box">
                            <Link to={`/single/${checkinDate}`}>
                                View Today's Checkin: ${checkinDate}
                                </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ContentDefault;
