function TopBar({user}) {

return (
  <nav class="topbar">
    <ul>
      <li class="lightblue_bg">
        <a href="/"><img src="imgs/logo.png" alt="Circular FitCheck logo"/></a>
        <a href="/">FitCheck</a>
      </li>
      <li>
        {user ? <a href="/logout">Sign Out</a> : null}
        <a href="/account"><img src="imgs/person.png" alt="Person icon"/></a>
        <a href="/account"> {user ? "Hello " + user.displayName + "!" : "Sign In"}</a>
      </li>
    </ul>
  </nav>
  );
}

export default TopBar;