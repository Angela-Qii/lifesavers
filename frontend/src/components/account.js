function Account({user}) {
    let info = null;
    if (user) {
        info =
            <div>
                <h1>{user.displayName}</h1>
                <div class="horizontal"><img class="icon" src="/imgs/account-icon-2.png" alt="Settings icon"/><h3>Account Settings</h3>
                    <p>Email: {user.email}</p>
                </div>
                <div class="horizontal"><img class="icon" src="/imgs/notifs-icon.png" alt="Settings icon"/><h3>Notification Settings</h3></div>
                <div class="horizontal"><img class="icon" src="/imgs/feedback-icon.png" alt="Settings icon"/><h3>Feedback</h3></div>
            </div>
    } else {
        info =
            <div className="login_link">
                Not logged in? <a href="/login">Login</a>
            </div>
    }

    return (
        <div id="content">
          {/* Will only display info when an error occurs */}
          <p id="error_info"></p>
            <h1>My Account</h1>
            { info }
        </div>
    )
}

export default Account;
