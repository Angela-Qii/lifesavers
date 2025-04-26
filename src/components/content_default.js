function ContentDefault() {
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
                        <div className="gray_box"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ContentDefault;
