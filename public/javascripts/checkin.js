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
  qs('.search_bar').addEventListener('input', filterDiets);
  id('add_routine').addEventListener('click', () => {
    togglePopup('routine');
  });
  id('hide_routine').addEventListener('click', (evt) => {
    evt.preventDefault();
    togglePopup('routine');
  });
  id('submit_routine').addEventListener('click', (evt) => {
    evt.preventDefault();
    addRoutine(id('routine_select').value);
  });
  id('add_diet').addEventListener('click', () => {
    togglePopup('diet');
  });
  id('hide_diet').addEventListener('click', (evt) => {
    evt.preventDefault();
    togglePopup('diet');
  });
  id('submit_diet').addEventListener('click', (evt) => {
    evt.preventDefault();
    addDiet();
  });
  // Handles Lesion section's sliders
  let slider1 = id("slider_itchy");
  let output1 = id("slider_itchy_val");
  slider1.addEventListener("input", () => {
    lesionSlider(slider1, output1);
  });
  let slider2 = id("slider_pain");
  let output2 = id("slider_pain_val");
  slider2.addEventListener("input", () => {
    lesionSlider(slider2, output2);
  });
  lesionSlider(slider1, output1);
  lesionSlider(slider2, output2);
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
  }
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
  } else if (currSection == 'hormone') {
    id('buttons').style.display = 'flex';
    id('go_next').innerText = 'Record Sun Exposure';
  } else if (currSection == 'sun') {
    id('buttons').style.display = 'flex';
    id('go_next').innerText = 'Record Medication';
  } else if (currSection == 'routine') {
    id('buttons').style.display = 'flex';
    id('go_next').innerText = 'Record Diet';
  } else if (currSection == 'diet') {
    id('buttons').style.display = 'flex';
    id('go_next').innerText = 'Record Weather';
  }
}

/**
 * Hides given popup if shown, or shows it if hidden.
 * @param {string} whichPop - "routine" or "diet" depending on which button clicked.
 */
function togglePopup(whichPop) {
  if (whichPop == 'routine') {
    if (shown(qs('#routine .popup'))) {
      qs('#routine .popup').style.display = 'none';
      qs('#routine > div').style.display = 'flex';
      id('buttons').style.display = 'flex';
    } else {
      qs('#routine .popup').style.display = 'flex';
      qs('#routine > div').style.display = 'none';
      id('buttons').style.display = 'none';
    }
  } else {
    if (shown(qs('#diet .popup'))) {
      qs('#diet .popup').style.display = 'none';
      qs('#diet > div').style.display = 'flex';
      id('buttons').style.display = 'flex';
    } else {
      qs('#diet .popup').style.display = 'flex';
      qs('#diet > div').style.display = 'none';
      id('buttons').style.display = 'none';
    }
  }
}

/**
 * Navigates to next part of Lesion section.
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
 * Shows Lesion section's calculations.
 */
function calcLesion() {
  id('lesion_start').style.display = 'none';
  id('lesion_head').style.display = 'none';
  id('lesion_arms').style.display = 'none';
  id('lesion_body').style.display = 'none';
  id('lesion_legs').style.display = 'none';
  id('calc_lesion').style.display = 'flex';
  id('lesion_buttons').style.display = 'none';
  id('buttons').style.display = 'flex';
  id('go_next').innerText = 'Record Stress';
  let lesion_1_1 = parseInt(qs('input[name="lesion_1-1"]:checked')?.value ?? 0);
  let lesion_1_2 = parseInt(qs('input[name="lesion_1-2"]:checked')?.value ?? 0);
  let lesion_1_3 = parseInt(qs('input[name="lesion_1-3"]:checked')?.value ?? 0);
  let lesion_1_4 = parseInt(qs('input[name="lesion_1-4"]:checked')?.value ?? 0);
  let lesion_2_1 = parseInt(qs('input[name="lesion_2-1"]:checked')?.value ?? 0);
  let lesion_2_2 = parseInt(qs('input[name="lesion_2-2"]:checked')?.value ?? 0);
  let lesion_2_3 = parseInt(qs('input[name="lesion_2-3"]:checked')?.value ?? 0);
  let lesion_2_4 = parseInt(qs('input[name="lesion_2-4"]:checked')?.value ?? 0);
  let lesion_3_1 = parseInt(qs('input[name="lesion_3-1"]:checked')?.value ?? 0);
  let lesion_3_2 = parseInt(qs('input[name="lesion_3-2"]:checked')?.value ?? 0);
  let lesion_3_3 = parseInt(qs('input[name="lesion_3-3"]:checked')?.value ?? 0);
  let lesion_3_4 = parseInt(qs('input[name="lesion_3-4"]:checked')?.value ?? 0);
  let lesion_4_1 = parseInt(qs('input[name="lesion_4-1"]:checked')?.value ?? 0);
  let lesion_4_2 = parseInt(qs('input[name="lesion_4-2"]:checked')?.value ?? 0);
  let lesion_4_3 = parseInt(qs('input[name="lesion_4-3"]:checked')?.value ?? 0);
  let lesion_4_4 = parseInt(qs('input[name="lesion_4-4"]:checked')?.value ?? 0);
  let pasi = lesion_1_1 + lesion_1_2 + lesion_1_3 + lesion_1_4 + lesion_2_1 + lesion_2_2 + lesion_2_3 + lesion_2_4 + lesion_3_1 + lesion_3_2 + lesion_3_3 + lesion_3_4 + lesion_4_1 + lesion_4_2 + lesion_4_3 + lesion_4_4;
  qs('#calc_lesion .big_num').innerText = pasi;
  if (pasi <= 4) {
    qs('#calc_lesion .big_word').innerText = 'Low';
  } else if (pasi >= 11) {
    qs('#calc_lesion .big_word').innerText = 'High';
  } else {
    qs('#calc_lesion .big_word').innerText = 'Moderate';
  }
}

/**
 * Handles the movement of Lesion section's slider circles.
 * @param {object} slider - The slider.
 * @param {object} output - The slider circle.
 */
function lesionSlider(slider, output) {
  let min = parseFloat(slider.min);
  let max = parseFloat(slider.max);
  let value = parseFloat(slider.value);
  let percent = ((value - min) / (max - min)) * 100;
  output.textContent = value.toFixed(1);
  output.style.left = `${percent}%`;
}

/**
 * Shows 2nd Stress page with stress calculations.
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
 * Adds a routine step to the Routine checkin section.
 * @param {string} whichDiv - "cleasing" or "moisturizer" depending on user's choice.
 */
function addRoutine(whichDiv) {
  togglePopup('routine');
  let word = id('routine_name').value;
  if (word === '') return;
  let elem = gen('div');
  elem.classList.add('white_btn');
  elem.classList.add('single_routine');
  let newId = id(whichDiv).childElementCount;
  elem.id = whichDiv + newId;
  let addWord = gen('p');
  addWord.textContent = word;
  elem.appendChild(addWord);
  let addBtn = gen('img');
  addBtn.src = 'imgs/delete_circle.png';
  addBtn.alt = 'Deletion icon';
  addBtn.addEventListener('click', () => {
    del(elem.id);
  });
  elem.appendChild(addBtn);
  id(whichDiv).appendChild(elem);
  id('routine_name').value = '';
}

/**
 * Filters diet items depending on search term.
 */
function filterDiets() {
  let term = qs('.search_bar').value.toLowerCase();
  let items = qsa('#diets_add .single_routine');
  items.forEach(item => {
    let word = item.textContent.toLowerCase();
    item.classList.toggle('hidden', !word.includes(term));
});
}

/**
 * Adds a possible diet item to the Diet checkin section.
 */
function addDiet() {
  togglePopup('diet');
  let word = id('diet_name').value;
  if (word === '') return;
  dietHelper(word);
  id('diet_name').value = '';
}

/**
 * Creates an element in the left Diet section.
 * @param {string} word - Name of the diet.
 */
function dietHelper(word) {
  let elem = gen('div');
  elem.classList.add('white_btn');
  elem.classList.add('single_routine');
  let newId = id('diets_add').childElementCount + id('diets_ate').childElementCount + 1;
  elem.id = 'diet' + newId;
  let addWord = gen('p');
  addWord.textContent = word;
  elem.appendChild(addWord);
  let addBtn = gen('img');
  addBtn.src = 'imgs/delete_circle.png';
  addBtn.alt = 'Deletion icon';
  addBtn.addEventListener('click', () => {
    del(elem.id);
  });
  elem.appendChild(addBtn);
  let addBtn2 = gen('img');
  addBtn2.src = 'imgs/add_circle.png';
  addBtn2.alt = 'Plus icon';
  addBtn2.addEventListener('click', () => {
    ateDiet(elem.id);
  });
  elem.appendChild(addBtn2);
  id('diets_add').appendChild(elem);
}

/**
 * Adds given diet item to eaten list and removes it from diets list.
 * @param {string} newId - ID of the given element.
 */
function ateDiet(newId) {
  let word = qs('#' + newId + ' p').textContent;
  del(newId);
  let elem = gen('div');
  elem.classList.add('rec_btn');
  elem.classList.add('single_routine');
  elem.id = newId;
  let addWord = gen('p');
  addWord.textContent = word;
  elem.appendChild(addWord);
  let addBtn = gen('img');
  addBtn.src = 'imgs/minus_circle.png';
  addBtn.alt = 'Minus icon';
  addBtn.addEventListener('click', () => {
    notAteDiet(elem.id);
  });
  elem.appendChild(addBtn);
  id('diets_ate').appendChild(elem);
}

/**
 * Removes given diet item from eaten list and adds it to diets list.
 * @param {string} newId - ID of the given element.
 */
function notAteDiet(newId) {
  let word = qs('#' + newId + ' p').textContent;
  del(newId);
  dietHelper(word);
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

async function loadRoutines() {

}

async function loadDiets() {

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
 * Deletes element with the given ID.
 * @param {string} newId - ID of the element.
 */
function del(newId) {
  id(newId).remove();
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