"use strict";
(function() {
  window.addEventListener("load", init);
  window.addEventListener("load", init2);

  function init() {
    fetch('/navbar.html')
      .then(response => response.text())
      .then(html => {
        document.getElementById('main_nav').innerHTML = html;
      })
      .catch(err => console.error('Error loading navbar:', err));
  }

  function init2() {
    fetch('/topbar.html')
      .then(response => response.text())
      .then(html => {
        document.getElementById('top_nav').innerHTML = html;
      })
      .catch(err => console.error('Error loading topbar:', err));
  }
})();