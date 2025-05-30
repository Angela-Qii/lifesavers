function Info() {
  return (
    <div id="content">
      {/* <!-- Will only display info when an error occurs --> */}
      <p id="error_info"></p>

      <h1 class="blue_font">Find Communities And Resources</h1>
      <p>Utilize these resources to connect with others or find information regarding your psoriasis diagnosis</p>
      <div class="horizontal">
        <div class="box">
          <h3>Communities</h3>
          <ul>
            <li><a href="https://www.reddit.com/r/Psoriasis/">Psoriasis subreddit</a></li>
            <li><a href="https://www.mypsoriasisteam.com/">MyPsoriasisTeam</a></li>
            <li><a href="https://www.facebook.com/groups/2204404890/">Facebook Psoriasis Group</a></li>
            <li><a href="https://www.bezzypsoriasis.com/">Bezzy Psoriasis</a></li>
            <li><a href="https://www.psoriasis.org/ask-a-patient-navigator/">Patient Navigator</a></li>
            <li><a href="https://www.psoriasis-association.org.uk/forums/">Psoriasis Association</a></li>
          </ul>
        </div>
        <div class="box">
          <h3>Learn</h3>
          <ul>
            <li><a href="https://www.healthline.com/health/psoriasis">Healthline Psoriasis</a></li>
            <li><a href="https://www.psoriasis.org/about-psoriasis">The National Psoriasis Foundation</a></li>
            <li><a href="https://www.mayoclinic.org/diseases-conditions/psoriasis/symptoms-causes/syc-20355840">Mayo Clinic</a></li>
            <li><a href="https://psoriasiscouncil.org/resource-library/">International Psoriasis Council</a></li>
          </ul>
        </div>
        <div class="box">
          <h3>Helpful Articles/Blogs</h3>
          <ul>
            <li><a href="https://justagirlwithspots.com/">Justagirlwithspots</a></li>
            <li><a href="https://psoriasis-psucks.tumblr.com/">PsoriasisPsucks</a></li>
            <li><a href="https://www.hannasillitoe.com/blogs/news">HannaSillitoe</a></li>
            <li><a href="https://freedomfrompsoriasis.com/intro/">FreedomFromPsoriasis</a></li>
            <li><a href="https://psoriasis.newlifeoutlook.com/">NewLifeOutlookPsoriasis</a></li>
            <li><a href="https://www.thepsoriasisprogram.com/blog/">thePsoriasisProgram</a></li>
          </ul>
        </div>
      </div>
    </div>
    );
  }

  export default Info;