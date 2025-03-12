import { Link } from "react-router-dom";
export default function NavBar(props) {

    return (
        <nav className="navbar fixed-top bg-body-tertiary">
        {/* Branding/logo image */}
        <a className="navbar-brand" href="/">
            <img src="/img/foodpod logo.png" alt="Logo" width="40" height="32" className="d-inline-block align-text-top"/>
            <div>FoodPod</div>
        </a>

        {/* Navbar body */}
        <div className="container-fluid">
                {/* Active class turns text/icon white, not just on hover */}

                {/* <a className="nav-link active" aria-current="page" href="index.html" id="text">Home</a> */}

                <Link className="nav-link" aria-current="page" to="/" id="text">Home</Link>


                {/* <a class="nav-link" href="profile.html">
                    <i class="bi bi-person" aria-label="profile"></i>
                    <div id="text">Profile</div>
                </a> */}

                <Link className="nav-link" to="/profile">
                        <i className="bi bi-person" aria-label="profile"></i>
                        <div id="text"> Profile</div>
                 </Link>

                {/* <a class="nav-link" href="findfriends.html">
                    <i class="bi bi-people" aria-label="friends"></i>
                    <div id="text">Friends</div>
                </a> */}

                <Link className="nav-link" to="/friends">
                        <i className="bi bi-people" aria-label="friends"></i>
                        <div id="text"> Friends</div>
                </Link>

                {/* <a class="nav-link" href="fridge.html">
                    <i className="bi bi-database" aria-label="fridge"></i>
                    <div id="text">Your Fridge</div>
                </a> */}

                <Link className="nav-link" to="/fridge">
                        <i className="bi bi-database" aria-label="fridge"></i>
                        <div id="text"> Your Fridge</div>
                </Link>

                {/* <a className="nav-link" href="leaderboard.html">
                    <i className="bi bi-joystick"></i>
                    <div id="text"> Leaderboard</div>
                </a> */}

                <Link className="nav-link" to="/leaderboard">
                        <i className="bi bi-joystick"></i>
                        <div id="text"> Leaderboard</div>
                </Link>

                {/* <a class="nav-link" href="proposal.html">
                    <i class="bi bi-question" aria-label="about"></i>
                    <div id="text">About Us</div>
                </a> */}

                <Link className="nav-link" to="/signin">
                        <i className="bi bi-door-open-fill" aria-label="login"></i>
                        <div id="text"> User Sign In</div>
                </Link>


        </div>
    </nav>

    )
}