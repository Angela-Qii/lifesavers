"use strict";
(function() {
  window.addEventListener("load", init);

  function init() {
    fetch('/navbar.html')
      .then(response => response.text())
      .then(html => {
        document.getElementById('main-nav').innerHTML = html;
      })
      .catch(err => console.error('Error loading navbar:', err));
  }
})();