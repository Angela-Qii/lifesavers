function ContentDashboard() {
    return (
      <div id="content">
      {/* Will only display info when an error occurs */}
      <p id="error_info"></p>
      <h1>Dashboard</h1>
      <div class="horizontal">
        <div>
          <div>
            <div class="gray_box">
              <h4>Hormonal Influence</h4>
            </div>
          </div>
          <div>
            <div class="gray_box">
              <h4>Psoriasis Severity</h4>
            </div>
          </div>
        </div>
        <div>
          <div class="gray_box">
            <h4>Medications</h4>
          </div>
        </div>
      </div>
    </div>
    );
}

export default ContentDashboard;
