"use strict";
(function() {

let currSection = 'lesion';

window.addEventListener("load", init);

/**
 * Sets up event listeners for website's buttons.
 */
async function init() {
  qsa('#checkin_nav button').forEach(button => {
    button.addEventListener('click', showSection);
  });
  id('go_next').addEventListener('click', showSection);
  id('show_calc_lesion').addEventListener('click', calcLesion);
  id('lesion_next').addEventListener('click', lesionNext);
  qs('#checkin_stress button').addEventListener('click', calcStress);
}

/**
 * When Checkin sidenav button clicked, shows that section and hides previous section.
 * If the button is for "next section", shows the next section.
 * @param {object} event - Information about the clicked button.
 */
function showSection(event) {
  let targetSection = '';
  if (event.target.id == 'go_next') {
    if (event.target.innerText == 'Record Hormone Cycle') {
      targetSection = 'hormone';
    } else if (event.target.innerText == 'Record Sun Exposure') {
      targetSection = 'sun';
    } else {
      targetSection = event.target.innerText.replace('Record ', '').toLowerCase();
    }
  } else {
    targetSection = event.target.id.replace('-btn', '');
  }
  id('buttons').style.display = 'none';
  if (targetSection && targetSection !== currSection) {
    id(currSection).style.display = 'none';
    id(currSection + '-btn').style.border = 'none';
    id(targetSection).style.display = 'block';
    id(targetSection + '-btn').style.borderLeft = '5px solid #5d7d9b';
    id(currSection + '-btn').style.color = '#c4cade';
    id(targetSection + '-btn').style.color = '#000';
    currSection = targetSection;
    if (currSection == 'lesion') {
      id('lesion_start').style.display = 'block';
      id('lesion_head').style.display = 'none';
      id('lesion_arms').style.display = 'none';
      id('lesion_body').style.display = 'none';
      id('lesion_legs').style.display = 'none';
      id('calc_lesion').style.display = 'none';
      id('lesion_buttons').style.display = 'flex';
    } else if (currSection == 'stress') {
      id('checkin_stress').style.display = 'block';
      id('calc_stress').style.display = 'none';
    } else if (currSection == 'sun') {
      id('buttons').style.display = 'flex';
      id('go_next').innerText = 'Record Medication';
    }
  }
}

/**
 * Navigates to next part of lesion section.
 */
function lesionNext() {
  if (shown(id('lesion_start'))) {
    id('lesion_start').style.display = 'none';
    id('lesion_head').style.display = 'flex';
  } else if (shown(id('lesion_head'))) {
    id('lesion_head').style.display = 'none';
    id('lesion_arms').style.display = 'flex';
  } else if (shown(id('lesion_arms'))) {
    id('lesion_arms').style.display = 'none';
    id('lesion_body').style.display = 'flex';
  } else if (shown(id('lesion_body'))) {
    id('lesion_body').style.display = 'none';
    id('lesion_legs').style.display = 'flex';
  } else {
    calcLesion();
  }
}

/**
 * Shows lesion section's calculations.
 */
function calcLesion() {
  id('lesion_start').style.display = 'none';
  id('lesion_head').style.display = 'none';
  id('lesion_arms').style.display = 'none';
  id('lesion_body').style.display = 'none';
  id('lesion_legs').style.display = 'none';
  id('calc_lesion').style.display = 'flex';
  id('lesion_buttons').style.display = 'none';
}

/**
 * Shows 2nd stress page with stress calculations.
 * Not selecting is 0 by default, but it isn't used in calculations unless there are no selections.
 */
function calcStress() {
  id('checkin_stress').style.display = 'none';
  id('calc_stress').style.display = 'flex';
  id('buttons').style.display = 'flex';
  id('go_next').innerText = 'Record Hormone Cycle';
  let stress1 = qs('input[name="stress_1"]:checked')?.value;
  let stress2 = qs('input[name="stress_2"]:checked')?.value;
  let stress3 = qs('input[name="stress_3"]:checked')?.value;
  if (stress1 == null) {
    stress1 = 0;
  }
  if (stress2 == null) {
    stress2 = 0;
  }
  if (stress3 == null) {
    stress3 = 0;
  }
  let avg_stress = 0;
  let zeroCount = [stress1, stress2, stress3].filter(value => value === 0).length;
  if (zeroCount == 0) {
    avg_stress = (Number(stress1) + Number(stress2) + Number(stress3)) / 3;
  } else if (zeroCount == 1) {
    avg_stress = (Number(stress1) + Number(stress2) + Number(stress3)) / 2;
  } else if (zeroCount == 2) {
    avg_stress = (Number(stress1) + Number(stress2) + Number(stress3));
  } else {
    avg_stress = 0;
  }
  avg_stress = Math.round(avg_stress * 10) / 10;
  qs('#calc_stress .big_num').innerText = avg_stress;
  if (avg_stress <= 2) {
    qs('#calc_stress .big_word').innerText = 'Low';
    qs('#calc_stress .big_num').style.background = '#aef993';
  } else if (avg_stress >= 4) {
    qs('#calc_stress .big_word').innerText = 'High';
    qs('#calc_stress .big_num').style.background = '#ff9d9d';
  } else {
    qs('#calc_stress .big_word').innerText = 'Moderate';
    qs('#calc_stress .big_num').style.background = '#f5f799';
  }
}

/**
 * Uploads data from form to database.
 * COMMENT: Replace fetchJSON with normal fetch?
 */
async function uploadData() {
  let upData = id('up_data').value;
  await fetchJSON(
    `/api/${apiVersion}/arts/`,
    {
      method: 'POST',
      body: {
        up_data: upData,
      }
    })

  id('art_url').value = '';
  loadData();
}

/**
 * Fetches data to display on main page.
 */
async function loadData(){
  id('display').innerText = "Loading...";
  let postsJson = await fetchJSON(`api/${apiVersion}/data`);
  displayData(postsJson);
}

/**
 * Displays data on main page.
 */
async function displayData(postsJson) {
  let postsHtml = postsJson.map(postInfo => {
    return `
    <div class="post">
      <p>Show user data here. Like this: ${postInfo.upData}</p>
    </div>`
  }).join("\n");
  id('display').innerHTML = postsHtml;
}

/**
 * Deletes specified data from database.
 * @param {int} dataID - data ID
 */
async function deleteData(dataID) {
  await fetchJSON(
    `/api/${apiVersion}/data`,
    {
      method: 'DELETE',
      body: {
        id: dataID
      }
    })
    loadData();
}

// COMMENT: Helpful functions below

/**
 * Returns if the given element is shown via CSS.
 * @param {object} element - Given element.
 * @returns {boolean} Whether the element is shown.
 */
function shown(element) {
  let style = window.getComputedStyle(element);
  return style.display !== 'none' && style.visibility !== 'hidden';
}

/**
 * Returns the element that has the ID attribute with the specified value.
 * @param {string} idName - element ID
 * @returns {object} DOM object associated with id.
 */
function id(idName) {
  return document.getElementById(idName);
}

/**
 * Returns the first element that matches the given CSS selector.
 * @param {string} selector - CSS query selector.
 * @returns {object} The first DOM object matching the query.
 */
function qs(selector) {
  return document.querySelector(selector);
}

/**
 * Returns the array of elements that match the given CSS selector.
 * @param {string} selector - CSS query selector
 * @returns {object[]} array of DOM objects matching the query.
 */
function qsa(selector) {
  return document.querySelectorAll(selector);
}

/**
 * Returns a new element with the given tag name.
 * @param {string} tagName - HTML tag name for new DOM element.
 * @returns {object} New DOM object for given HTML tag.
 */
function gen(tagName) {
  return document.createElement(tagName);
}
}
)();