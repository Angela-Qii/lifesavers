import CheckinNavbar from './checkin_navbar';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PeriodPhaseLength = 28;

function Checkin({user}) {
  const [message, setMessage] = useState('');

  const [medications, setMedications] = useState([]);
  const [dailyNotes, setDailyNotes] = useState('');

  let currSection = 'lesion';
  let period_today = false;
  let weather_location = undefined;

  useEffect(() => {
    // TODO: Make page not usable if user isn't logged in?
    loadRoutines();
    qsa('#checkin_nav button').forEach(button => {
      button.addEventListener('click', showSection);
    });
    // copy go_next for skip button 
    id('go_next').addEventListener('click', showSection);
    //make a go back button 

    id('show_calc_lesion').addEventListener('click', calcLesion);
    id('lesion_next').addEventListener('click', lesionNext);
    
    // make a go back lesion button 
    qs('#checkin_stress button').addEventListener('click', calcStress);
    qs('.search_bar').addEventListener('input', filterDiets);
    id('period_start').addEventListener('click', (evt) => {
      evt.preventDefault();
      periodToday();
    });
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
    id('submit_checkin').addEventListener("click", (evt) => {
      submitCheckin(evt);
      id('checkin_submitted').style.display = 'block';
    });
  }, []); // Empty dependency array ensures this runs only on mount/unmount

    /**
 * Fetches user's routines and diets from database and shows them in their sections.
 */
async function loadRoutines() {
  try {
    const res = await axios.get(
      `/api/checkin/routines/${encodeURIComponent(user.displayName)}`,
    );
    if (!res) {
      return;
    }
    const result = res.data;
    for (let i = 0; i < result.diets.length; i++) {
      dietHelper(result.diets[i], `diet${i}`);
    }
    // for (let i = 0; i < result.clean_routines.length; i++) {
    //   addRoutine(result.clean_routines[i], 'cleansing');
    // }
    // for (let i = 0; i < result.mois_routines.length; i++) {
    //   addRoutine(result.mois_routines[i], 'moisturizer');
    // }
    if (result.last_period) {
      const lastPeriodDate = new Date(result.last_period).setHours(0, 0, 0, 0);
      const today = new Date().setHours(0, 0, 0, 0);
      const diffInMs = today - lastPeriodDate;
      let daysAgo = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
      daysAgo = daysAgo % PeriodPhaseLength;
      let phase;
      if (daysAgo <= 7) {
        phase = 'Menstrual';
      } else if (daysAgo <= 12) {
        phase = 'Follicular';
      } else if (daysAgo <= 15) {
        phase = 'Ovulation';
      } else {
        phase = 'Luteal';
      }
      id('period_date').textContent = result.last_period;
      id('period_phase').textContent = phase;
    }
  } catch (err) {
    handleError('Routines error: ' + err);
    console.error('Error:', err);
  }
}

  /**
 * Submits daily checkin.
 */
async function submitCheckin(evt) {
  evt.preventDefault();
  let formData = new FormData();
  const lesionRatings = {
    lesion_1_1: parseInt(qs('input[name="lesion_1-1"]:checked')?.value),
    lesion_1_2: parseInt(qs('input[name="lesion_1-2"]:checked')?.value),
    lesion_1_3: parseInt(qs('input[name="lesion_1-3"]:checked')?.value),
    lesion_1_4: parseInt(qs('input[name="lesion_1-4"]:checked')?.value),
    lesion_2_1: parseInt(qs('input[name="lesion_2-1"]:checked')?.value),
    lesion_2_2: parseInt(qs('input[name="lesion_2-2"]:checked')?.value),
    lesion_2_3: parseInt(qs('input[name="lesion_2-3"]:checked')?.value),
    lesion_2_4: parseInt(qs('input[name="lesion_2-4"]:checked')?.value),
    lesion_3_1: parseInt(qs('input[name="lesion_3-1"]:checked')?.value),
    lesion_3_2: parseInt(qs('input[name="lesion_3-2"]:checked')?.value),
    lesion_3_3: parseInt(qs('input[name="lesion_3-3"]:checked')?.value),
    lesion_3_4: parseInt(qs('input[name="lesion_3-4"]:checked')?.value),
    lesion_4_1: parseInt(qs('input[name="lesion_4-1"]:checked')?.value),
    lesion_4_2: parseInt(qs('input[name="lesion_4-2"]:checked')?.value),
    lesion_4_3: parseInt(qs('input[name="lesion_4-3"]:checked')?.value),
    lesion_4_4: parseInt(qs('input[name="lesion_4-4"]:checked')?.value),
  };
  const itchyValue = parseFloat(id('slider_itchy').value);
  const painValue = parseFloat(id('slider_pain').value);
  if (!isNaN(itchyValue)) {
    formData.append('lesion_itchy', itchyValue.toString());
  }
  if (!isNaN(painValue)) {
    formData.append('lesion_pain', painValue.toString());
  }
  Object.entries(lesionRatings).forEach(([key, value]) => {
    if (!isNaN(value)) {
      formData.append(key, value.toString());
    }
  });
  let inputs = [
      id('lesion_1-5'),
      id('lesion_2-5'),
      id('lesion_3-5'),
      id('lesion_4-5'),
    ];
  let fileCount = 0;
  inputs.forEach((input) => {
    if (input.files[0]) {
      formData.append('image', input.files[0]);
      fileCount++;
    }
  });
  const stressRatings = {
    stress_1: qs('input[name="stress_1"]:checked')?.value,
    stress_2: qs('input[name="stress_2"]:checked')?.value,
    stress_3: qs('input[name="stress_3"]:checked')?.value,
  };
  Object.entries(stressRatings).forEach(([key, value]) => {
    if (value !== undefined) {
      formData.append(key, value);
    }
  });
  const sun_hr = id('sun_hr')?.value;
  const sun_min = id('sun_min')?.value;
  if (sun_hr !== undefined && sun_hr !== '') {
    formData.append('sun_hr', sun_hr);
  }
  if (sun_min !== undefined && sun_min !== '') {
    formData.append('sun_min', sun_min);
  }
  const diets_add = id('diets_add');
  const diets_ate = id('diets_ate');
  const add_diets = diets_add.querySelectorAll('div p');;
  const ate_diets = diets_ate.querySelectorAll('div p');
  const add_diets_2 = Array.from(add_diets).map(p => p.textContent.trim());
  const ate_diets_2 = Array.from(ate_diets).map(p => p.textContent.trim());
  const both_diets = add_diets_2.concat(ate_diets_2);
  formData.append('user_diets', JSON.stringify(both_diets));
  formData.append('daily_diets', JSON.stringify(ate_diets_2));
  const all_clean_routines = id('cleansing');
  const all_mois_routines = id('moisturizer');
  const checked_clean_routines = all_clean_routines.querySelectorAll('div p');
  const checked_mois_routines = all_mois_routines.querySelectorAll('div p');
  const all_clean_routines2 = Array.from(all_clean_routines).map(p => p.textContent.trim());
  const all_mois_routines2 = Array.from(all_mois_routines).map(p => p.textContent.trim());
  const checked_clean_routines2 = Array.from(checked_clean_routines).map(p => p.textContent.trim());
  const checked_mois_routines2 = Array.from(checked_mois_routines).map(p => p.textContent.trim());
  formData.append('clean_user_routines', JSON.stringify(all_clean_routines2));
  formData.append('clean_daily_routines', JSON.stringify(checked_clean_routines2));
  formData.append('mois_user_routines', JSON.stringify(all_mois_routines2));
  formData.append('mois_daily_routines', JSON.stringify(checked_mois_routines2));
  formData.append('period_today', period_today);
  formData.append('weather_location', weather_location);
  // TODO: Finish routines, period, medication, weather
  try {
    const res = await axios.post(
      `/api/checkin/${encodeURIComponent(user.displayName)}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    // const result = await res.json();
    // setMessage(result.message);
    // TODO: WHY ISN'T THIS WORKING?
    id(currSection).style.display = 'none';
    id('buttons').style.display = 'none';
    id('checkin_nav').style.display = 'none';
    id('done').style.display = 'display';
  } catch (err) {
    handleError(err);
    console.error('Error:', err);
  }
}

/**
 * When user clicks button to mark their period today, it toggles whether their period started.
 */
function periodToday() {
  if (period_today) {
    period_today = false;
    id('period_start').textContent = 'my period started today';
  } else {
    period_today = true;
    id('period_start').textContent = 'my period did not start today';
  }
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
    id(currSection + '-btn').parentElement.style.borderLeft = 'none';
    id(targetSection).style.display = 'block';
    id(targetSection + '-btn').parentElement.style.borderLeft = '10px solid #5d7d9b';
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
    id('submit_checkin').style.display = 'none';
    id('go_next').style.display = 'block';
  } else if (currSection == 'hormone') {
    id('buttons').style.display = 'flex';
    id('submit_checkin').style.display = 'none';
    id('go_next').innerText = 'Record Sun Exposure';
    id('go_next').style.display = 'block';
  } else if (currSection == 'sun') {
    id('buttons').style.display = 'flex';
    id('go_next').innerText = 'Record Medication';
    id('submit_checkin').style.display = 'none';
    id('go_next').style.display = 'block';
  } else if (currSection == 'medication'){
    id('buttons').style.display = 'flex';
    id('go_next').innerText = 'Record Routine';
    id('submit_checkin').style.display = 'none';
    id('go_next').style.display = 'block';
  } else if (currSection == 'routine') {
    id('buttons').style.display = 'flex';
    id('go_next').innerText = 'Record Diet';
    id('submit_checkin').style.display = 'none';
    id('go_next').style.display = 'block';
  } else if (currSection == 'diet') {
    id('buttons').style.display = 'flex';
    id('submit_checkin').style.display = 'none';
    id('go_next').innerText = 'Record Weather';
    id('go_next').style.display = 'block';
  }else{
    id('buttons').style.display = 'flex';
    id('submit_checkin').style.display = 'block';
    id('go_next').style.display = 'none';
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

// make a lesion back button 

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
  id('submit_checkin').style.display = 'none';
  id('go_next').style.display = 'block';
  //  add a go back button 
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
  id('submit_checkin').style.display = 'none';
  id('go_next').style.display = 'block';
  // go back and skip button 
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
 * @param {string} whichDiv - "cleansing" or "moisturizer" depending on user's choice.
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
  let addBtn2 = gen('img');
  addBtn2.src = 'imgs/unchecked_circle.png';
  addBtn2.alt = 'Unchecked circle';
  addBtn2.classList.add('unchecked');
  addBtn2.addEventListener('click', () => {
    checkRoutine(elem.id);
  });
  elem.appendChild(addBtn2);
  id(whichDiv).appendChild(elem);
  id('routine_name').value = '';
}

/**
 * Adds a routine step to the Routine checkin section.
 * @param {string} whichDiv - "cleasing" or "moisturizer" depending on user's choice.
 */
function checkRoutine(newId) {
  let parent = id(newId);
  let img = parent.querySelector('img:nth-child(3)');
  let oldSrc = 'imgs/unchecked_circle.png';
  let oldAlt = 'Unchecked circle';
  let newSrc = 'imgs/checked_circle.png';
  let newAlt = 'Checked circle';
  if (img.src.includes(oldSrc) && img.alt === oldAlt) {
    img.src = newSrc;
    img.alt = newAlt;
    img.classList.remove('unchecked');
    img.classList.add('checked');
  } else {
    img.src = oldSrc;
    img.alt = oldAlt;
    img.classList.remove('checked');
    img.classList.add('unchecked');
  }
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
  let newId = id('diets_add').childElementCount + id('diets_ate').childElementCount + 1;
  newId = 'diet' + newId;
  dietHelper(word, newId);
  id('diet_name').value = '';
}

/**
 * Creates an element in the left Diet section.
 * @param {string} word - Name of the diet.
 */
function dietHelper(word, newId) {
  let elem = gen('div');
  elem.classList.add('white_btn');
  elem.classList.add('single_routine');
  elem.id = newId;
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
  dietHelper(word, newId);
}

/* medication stuff */ 

function debounce(func, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}

function AddMedication() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMedDetails, setSelectedMedDetails] = useState(null);
   
  useEffect(() => {
    const debounced = debounce(function (val) {
      setDebouncedQuery(val);
    }, 500);

    debounced(query);
  }, [query]);

  useEffect(() => {
    if (debouncedQuery.trim() === '') {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    fetch(`https://api.fda.gov/drug/label.json?search=openfda.brand_name:"${debouncedQuery}"&limit=5`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('API error');
        }
        return response.json();
      })
      .then((data) => {
        setResults(data.results || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setError('No results or API error');
        setLoading(false);
      });
  }, [debouncedQuery]);

  function addMedication(item) {
    const name = item.openfda.brand_name?.[0] || 'Unknown';
    if (!medications.includes(name)) {
      setMedications([...medications, name]);
    }
  }

  function removeMedication(name) {
    const updatedList = medications.filter((med) => med !== name);
    setMedications(updatedList);
  }

  function showDetails(item) {
    setSelectedMedDetails(item);
  }

  function closeModal() {
    setSelectedMedDetails(null);
  }

  return (
    <div>
      <h1 className='pageTitle'>Medication</h1>
      <p>what medications did you take today?</p>
      <input
        className="search_bar"
        type="text"
        placeholder="Search drug by brand name..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul className="medicationOptions" style={{ paddingInlineStart: '0px' }}>
        {results.map((item, index) => {
          const name = item.openfda.brand_name?.[0] || 'Unknown';

          return (
            <li
              className="medicationList"
              key={index}
              style={{
                borderColor: 'solid #30A0CD',
                borderWidth: '5px',
                paddingLeft: '10px',
                paddingRight: '10px',
                paddingTop: '5px',
                paddingBottom: '5px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '3px',
                listStyle: 'none',
                borderRadius: '10px',
                backgroundColor: 'transparent',
                fontSize: '15px',
                fontFamily: 'Inter'
              }}
            >
              <div><strong>{name}</strong></div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button
                  onClick={() => showDetails(item)}
                  style={{
                    backgroundColor: '#30A0CD',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '5px 10px',
                    cursor: 'pointer',
                  }}
                >
                  Read details
                </button>

                <button
                  onClick={() => addMedication(item)}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    listStyle: 'none', 
                    display: 'flex', 
                    gap: '10px', 
                    alignItems: 'center'
                  }}
                >
                  <svg
                    width="33"
                    height="33"
                    viewBox="0 0 58 58"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="29" cy="29" r="28.5" stroke="black" />
                    <rect
                      x="26.666"
                      y="19.3335"
                      width="4.66667"
                      height="19.3333"
                      rx="2.33333"
                      fill="#D9D9D9"
                    />
                    <rect
                      x="38.666"
                      y="26.667"
                      width="4.66667"
                      height="19.3333"
                      rx="2.33333"
                      transform="rotate(90 38.666 26.667)"
                      fill="#D9D9D9"
                    />
                  </svg>
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <hr style={{ border: '1px solid #C8CBD9', margin: '20px 0' }} />

      <h3>Today's Medications:</h3>


      {medications.length === 0 ? (
        <p>No medications added yet.</p>
      ) : (
        <ul>
          {medications.map((med, index) => (
            <li key={index} style={{listStyle: 'none', 
                  display: 'flex', 
                  alignItems: 'center',
                  justifyContent: 'space-between', 
                  marginBottom: '10px'
                  }}>
              {med}
              <button
                onClick={() => removeMedication(med)}
                style={{ marginLeft: '10px', 
                  marginRight: '20px',
                  backgroundColor: 'transparent', 
                  border: 'none', 
                  cursor: 'pointer',
                 }}
              >
                <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.5 0.5C25.3366 0.5 32.5 7.66344 32.5 16.5C32.5 25.3366 25.3366 32.5 16.5 32.5C7.66344 32.5 0.5 25.3366 0.5 16.5C0.5 7.66344 7.66344 0.5 16.5 0.5Z" stroke="black" />
                  <rect x="22" y="15" width="2.65517" height="11" rx="1.32759" transform="rotate(90 22 15)" fill="#D9D9D9" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}


      <hr style={{ border: '1px solid #C8CBD9', margin: '20px 0' }} />

      <h3>Daily Notes:</h3>
      <textarea
        value={dailyNotes}
        onChange={(e) => setDailyNotes(e.target.value)}
        rows="5"
        placeholder="How did you feel taking your medications today?"
        style={{
          width: '100%',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '8px',
          resize: 'vertical',
          fontFamily: 'inherit',
          fontSize: '1rem',
          boxSizing: 'border-box',
        }}
      />

      

      {/* Modal for Medication Details */}
      {selectedMedDetails && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '10px',
            width: '80%',
            maxHeight: '80%',
            overflowY: 'scroll'
          }}>
            <h2>{selectedMedDetails.openfda.brand_name?.[0] || 'Unknown'}</h2>
            <p><strong>Dosage:</strong> {selectedMedDetails.dosage_and_administration?.[0] || 'N/A'}</p>
            <p><strong>Route:</strong> {selectedMedDetails.openfda.route?.[0] || 'N/A'}</p>
            <p><strong>Substance Name:</strong> {selectedMedDetails.openfda.substance_name?.[0] || 'N/A'}</p>
            <p><strong>Usage:</strong> {selectedMedDetails.indications_and_usage?.[0] || 'N/A'}</p>
            <p><strong>Warnings:</strong> {selectedMedDetails.warnings?.[0] || 'N/A'}</p>
            <p><strong>Prescription Required:</strong> {
              selectedMedDetails.openfda.product_type?.[0]?.toLowerCase().includes("prescription") ? "Yes" : "No"
            }</p>
            <button onClick={closeModal} style={{
              marginTop: '15px',
              padding: '10px 20px',
              backgroundColor: '#F44336',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* weather stuff*/

function AddWeather() {
  const [location, setLocation] = useState('');
  const [weatherDataList, setWeatherDataList] = useState([]);
  const [error, setError] = useState('');
  const [currentLocationId, setCurrentLocationId] = useState(null);


  const apiKey = '895284fb2d2c50a520ea537456963d9c';


  const searchWeather = (event) => {
    if (event.key === 'Enter') {
      if (!location.trim()) return;


      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&units=imperial&appid=${apiKey}`;


      axios.get(url)
        .then(response => {
          setWeatherDataList(prev => [...prev, response.data]);
          setError('');
        })
        .catch(error => {
          console.error('Error fetching weather:', error);
          setError('Location not found.');
        });


      setLocation('');
    }
  };


  const setAsCurrent = (id) => {
    setCurrentLocationId(id);
  };


  return (
    <>
      {/* Import Inter font */}
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Outfit:wght@100..900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet" />


      <style>{`
  * {
    box-sizing: border-box;
  }


  .inter-font {
    font-family: 'Inter', sans-serif !important;
  }


  #weather {
    background-color: #fffff;
    padding: 0.1rem;
    margin-top: 0.1px;
  }


  #weather h1 {
    font-size: 40px;
    font-weight: 700;
    margin-bottom: 0.5rem;
    font-family: Poppins;
  }


  .question {
    color: #444;
    font-size: 16px;
    margin-bottom: 20px;
  }


  .search_container {
    position: relative;
    width: 100%;
    margin-bottom: 1.5rem;
  }


  .search_icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #aaa;
    pointer-events: none;
    font-size: 16px;
  }


  .search_bar {
    font-family: 'Inter', sans-serif;
    width: 100%;
    padding: 12px 16px 12px 36px;
    font-size: 15px;
    border: 1px solid #ececec;
    border-radius: 10px;
    background-color: #ececec;
    color: #333;
    outline: none;
  }


  .search_bar::placeholder {
    color: #aaa;
  }


  .white_btn {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid #292a2a;
    background-color: white;
    padding: 16px;
    border-radius: 8px;
    font-size: 14px;
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }


  .white_btn:hover {
    background-color: #f0f8ff;
  }


  .weather_text {
    margin: 0;
    margin-bottom: 6px;
    font-weight: 600;
    color: #222;
  }


  .question {
    font-size: 13px;
    color: #808080;
  }
  .weather_text.inter-font {
    font-size: 20px;




  }


  .weather_detail {
    margin: 0;
    color: #333;
    font-size: 14px;
    font-family: 'Inter', sans-serif;
  }




  .set_btn {
    background-color: #39a0cd;
    color: white;
    border: none;
    padding: 6px 12px;
    border-radius: 6px;
    font-family: 'Inter', sans-serif !important;
    font-size: 13px;
    cursor: pointer;
    margin-left: auto;
    margin-top: 8px;
  }


  .set_btn:hover {
    background-color: #004086;
  }


  .current-tag {
    font-size: 13px;
    color: green;
    font-weight: bold;
    margin-left: 8px;
  }


  #weather_add {
    margin-top: 1rem;
  }


  .weather_info {
    flex: 1;
  }
 `}</style>




      <div id="weather2">
        <h1 class="pageTitle">Weather</h1>
        <p className="question inter-font">What was the weather like in your location today?</p>


        <div className="search_container">
          <input
            type="text"
            className="search_bar"
            id="weather_search"
            placeholder="Search Location"
            value={location}
            onChange={e => setLocation(e.target.value)}
            onKeyDown={searchWeather}
          />
        </div>


        <div id="weather_add">
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {weatherDataList.map((weatherData, index) => (
            <div key={index} className="white_btn">
              <div className="weather_info">
                <p className="weather_text inter-font">
                  Weather Today in {weatherData.name}
                  {currentLocationId === index && (
                    <span className="current-tag"> (Current)</span>
                  )}
                </p>
                <p className="weather_detail">
                  {weatherData.main.temp}°F, {weatherData.weather[0].description}
                </p>
              </div>
              <button className="set_btn" onClick={() => {
                weather_location = weatherData.name;
                setAsCurrent(index);
              }}>
                Current Location
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
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

/**
 * Shows error message.
 * @param {string} err - Error message.
 */
function handleError(err) {
  id('error_info').textContent = 'Error: ' + err;
}

  return (
    <div className="checkin_container">
    <div id="content">
          {/* Will only display info when an error occurs */}
          <p id="error_info"></p>
      <p>Daily-Check in for {user.displayName}</p>

      <div id="lesion">
        <h1 class="pageTitle">Lesions</h1>
        <div id="lesion_start">
          <h2>Section 1   -    Filling PASI Score</h2>
          <p>The <span class="bold">Psoriasis Area and Severity Index (PASI)</span> score is a tool dermatologists use to classify psoriasis and help determine treatment. It helps classify severity of your psoriasis.</p>
          <p>In general, <span class="bold">a PASI score of 5 to 10 is considered moderate disease</span>, and a score over 10 is considered severe.</p>
          <p>In order to calculate PASI score, you will need to input information for these parts of the body:</p>
          <div class="horizontal">
            <div>
              <svg width="127" height="231" viewBox="0 0 127 231" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="63.2732" cy="21" r="21" fill="#3473C1"/>
                <rect x="34.2734" y="46" width="57" height="98" rx="10" fill="#DFDFDF"/>
                <rect x="68.2734" y="51.418" width="20" height="94.2982" rx="10" transform="rotate(-24.8912 68.2734 51.418)" fill="#DFDFDF"/>
                <rect width="20" height="91.5092" rx="10" transform="matrix(-0.907109 -0.420896 -0.420896 0.907109 56.6582 52.418)" fill="#DFDFDF"/>
                <rect x="34.2734" y="128" width="22" height="103" rx="10" fill="#DFDFDF"/>
                <rect x="69.2734" y="127" width="22" height="104" rx="10" fill="#DFDFDF"/>
              </svg>
              <h2>Head</h2>
            </div>
            <div>
              <svg width="127" height="230" viewBox="0 0 127 230" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="63.2732" cy="21" r="21" fill="#DFDFDF"/>
                <rect x="68.2732" y="50.418" width="20" height="94.2982" rx="10" transform="rotate(-24.8912 68.2732 50.418)" fill="#3473C1"/>
                <rect width="20" height="91.5092" rx="10" transform="matrix(-0.907109 -0.420896 -0.420896 0.907109 56.658 51.418)" fill="#3473C1"/>
                <rect x="34.2732" y="127" width="22" height="103" rx="10" fill="#DFDFDF"/>
                <rect x="69.2732" y="126" width="22" height="104" rx="10" fill="#DFDFDF"/>
                <rect x="34.2732" y="45" width="57" height="98" rx="10" fill="#DFDFDF"/>
              </svg>
              <h2>Arms</h2>
            </div>
            <div>
              <svg width="127" height="230" viewBox="0 0 127 230" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="63.2732" cy="21" r="21" fill="#DFDFDF"/>
                <rect x="68.2732" y="50.418" width="20" height="94.2982" rx="10" transform="rotate(-24.8912 68.2732 50.418)" fill="#DFDFDF"/>
                <rect width="20" height="91.5092" rx="10" transform="matrix(-0.907109 -0.420896 -0.420896 0.907109 56.658 51.418)" fill="#DFDFDF"/>
                <rect x="34.2732" y="127" width="22" height="103" rx="10" fill="#DFDFDF"/>
                <rect x="69.2732" y="126" width="22" height="104" rx="10" fill="#DFDFDF"/>
                <rect x="34.2732" y="45" width="57" height="98" rx="10" fill="#3473C1"/>
              </svg>
              <h2>Trunk</h2>
            </div>
            <div>
              <svg width="127" height="230" viewBox="0 0 127 230" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="63.2732" cy="21" r="21" fill="#DFDFDF"/>
                <rect x="68.2732" y="50.418" width="20" height="94.2982" rx="10" transform="rotate(-24.8912 68.2732 50.418)" fill="#DFDFDF"/>
                <rect width="20" height="91.5092" rx="10" transform="matrix(-0.907109 -0.420896 -0.420896 0.907109 56.658 51.418)" fill="#DFDFDF"/>
                <rect x="34.2732" y="127" width="22" height="103" rx="10" fill="#3473C1"/>
                <rect x="69.2732" y="126" width="22" height="104" rx="10" fill="#3473C1"/>
                <rect x="34.2732" y="45" width="57" height="98" rx="10" fill="#DFDFDF"/>
              </svg>
              <h2>Legs</h2>
            </div>
          </div>
        </div>
        <div id="lesion_head" class="lesion_part">
          <form class="checkin_lesion">
            <h2>Head ( 1/4 ) - Inputting PASI Scores</h2>
            <label>Area: % indicates the lesion's area coverage of the affected body part.</label>
            <ul class="radio">
              <li>
                <input type="radio" id="lesion1-1_0" name="lesion_1-1" value="0" />
                <label for="lesion1-1_0">0%</label>
              </li>
              <li>
                <input type="radio" id="lesion1-1_1" name="lesion_1-1" value="1" />
                <label for="lesion1-1_1">&lt;10%</label>
              </li>
              <li>
                <input type="radio" id="lesion1-1_2" name="lesion_1-1" value="2" />
                <label for="lesion1-1_2">10-29%</label>
              </li>
              <li>
                <input type="radio" id="lesion1-1_3" name="lesion_1-1" value="3" />
                <label for="lesion1-1_3">30-49%</label>
              </li>
              <li>
                <input type="radio" id="lesion1-1_4" name="lesion_1-1" value="4" />
                <label for="lesion1-1_4">50-69%</label>
              </li>
              <li>
                <input type="radio" id="lesion1-1_5" name="lesion_1-1" value="5" />
                <label for="lesion1-1_5">70-89%</label>
              </li>
              <li>
                <input type="radio" id="lesion1-1_6" name="lesion_1-1" value="6" />
                <label for="lesion1-1_6">90-100%</label>
              </li>
            </ul>
            <label>Induration/Thickness</label>
            <ul class="select-choice">
              <li>
                <input type="radio" id="lesion1-2_0" name="lesion_1-2" value="0" />
                <label for="lesion1-2_0">None</label>
              </li>
              <li>
                <input type="radio" id="lesion1-2_1" name="lesion_1-2" value="1" />
                <label for="lesion1-2_1">Slight</label>
              </li>
              <li>
                <input type="radio" id="lesion1-2_2" name="lesion_1-2" value="2" />
                <label for="lesion1-2_2">Moderate</label>
              </li>
              <li>
                <input type="radio" id="lesion1-2_3" name="lesion_1-2" value="3" />
                <label for="lesion1-2_3">Severe</label>
              </li>
              <li>
                <input type="radio" id="lesion1-2_4" name="lesion_1-2" value="4" />
                <label for="lesion1-2_4">Very Severe</label>
              </li>
            </ul>
            <label>Erythema/Redness</label>
            <ul class="select-choice">
              <li>
                <input type="radio" id="lesion1-3_0" name="lesion_1-3" value="0" />
                <label for="lesion1-3_0">None</label>
              </li>
              <li>
                <input type="radio" id="lesion1-3_1" name="lesion_1-3" value="1" />
                <label for="lesion1-3_1">Slight</label>
              </li>
              <li>
                <input type="radio" id="lesion1-3_2" name="lesion_1-3" value="2" />
                <label for="lesion1-3_2">Moderate</label>
              </li>
              <li>
                <input type="radio" id="lesion1-3_3" name="lesion_1-3" value="3" />
                <label for="lesion1-3_3">Severe</label>
              </li>
              <li>
                <input type="radio" id="lesion1-3_4" name="lesion_1-3" value="4" />
                <label for="lesion1-3_4">Very Severe</label>
              </li>
            </ul>
            <label>Desquamation/Scaling</label>
            <ul class="select-choice">
              <li>
                <input type="radio" id="lesion1-4_0" name="lesion_1-4" value="0" />
                <label for="lesion1-4_0">None</label>
              </li>
              <li>
                <input type="radio" id="lesion1-4_1" name="lesion_1-4" value="1" />
                <label for="lesion1-4_1">Slight</label>
              </li>
              <li>
                <input type="radio" id="lesion1-4_2" name="lesion_1-4" value="2" />
                <label for="lesion1-4_2">Moderate</label>
              </li>
              <li>
                <input type="radio" id="lesion1-4_3" name="lesion_1-4" value="3" />
                <label for="lesion1-4_3">Severe</label>
              </li>
              <li>
                <input type="radio" id="lesion1-4_4" name="lesion_1-4" value="4" />
                <label for="lesion1-4_4">Very Severe</label>
              </li>
            </ul>
            <p>Upload Pictures  ( optional )</p>
            <div class="upload-image">
              <input type="file" id="lesion_1-5" name="image" accept="image/*" />
              <label for="lesion_1-5"><img src="imgs/image-icon.png" alt="Upload image icon" /></label>
            </div>
          </form>
          <div className='lesion-part-icon'>
            <svg width="250" height="380" viewBox="0 0 127 231" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="63.2732" cy="21" r="21" fill="#3473C1"/>
                <rect x="34.2734" y="46" width="57" height="98" rx="10" fill="#DFDFDF"/>
                <rect x="68.2734" y="51.418" width="20" height="94.2982" rx="10" transform="rotate(-24.8912 68.2734 51.418)" fill="#DFDFDF"/>
                <rect width="20" height="91.5092" rx="10" transform="matrix(-0.907109 -0.420896 -0.420896 0.907109 56.6582 52.418)" fill="#DFDFDF"/>
                <rect x="34.2734" y="128" width="22" height="103" rx="10" fill="#DFDFDF"/>
                <rect x="69.2734" y="127" width="22" height="104" rx="10" fill="#DFDFDF"/>
           </svg>
          </div>
          
        </div>
        <div id="lesion_arms" class="lesion_part">
          <form class="checkin_lesion">
            <h2>Arms ( 2/4 ) - Inputting PASI Scores</h2>
            <label>Area: % indicates the lesion's area coverage of the affected body part.</label>
            <ul class="radio">
              <li>
                <input type="radio" id="lesion2-1_0" name="lesion_2-1" value="0" />
                <label for="lesion2-1_0">0%</label>
              </li>
              <li>
                <input type="radio" id="lesion2-1_1" name="lesion_2-1" value="1" />
                <label for="lesion2-1_1">&lt;10%</label>
              </li>
              <li>
                <input type="radio" id="lesion2-1_2" name="lesion_2-1" value="2" />
                <label for="lesion2-1_2">10-29%</label>
              </li>
              <li>
                <input type="radio" id="lesion2-1_3" name="lesion_2-1" value="3" />
                <label for="lesion2-1_3">30-49%</label>
              </li>
              <li>
                <input type="radio" id="lesion2-1_4" name="lesion_2-1" value="4" />
                <label for="lesion2-1_4">50-69%</label>
              </li>
              <li>
                <input type="radio" id="lesion2-1_5" name="lesion_2-1" value="5" />
                <label for="lesion2-1_5">70-89%</label>
              </li>
              <li>
                <input type="radio" id="lesion2-1_6" name="lesion_2-1" value="6" />
                <label for="lesion2-1_6">90-100%</label>
              </li>
            </ul>
            <label>Induration/Thickness</label>
            <ul class="select-choice">
              <li>
                <input type="radio" id="lesion2-2_0" name="lesion_2-2" value="0" />
                <label for="lesion2-2_0">None</label>
              </li>
              <li>
                <input type="radio" id="lesion2-2_1" name="lesion_2-2" value="1" />
                <label for="lesion2-2_1">Slight</label>
              </li>
              <li>
                <input type="radio" id="lesion2-2_2" name="lesion_2-2" value="2" />
                <label for="lesion2-2_2">Moderate</label>
              </li>
              <li>
                <input type="radio" id="lesion2-2_3" name="lesion_2-2" value="3" />
                <label for="lesion2-2_3">Severe</label>
              </li>
              <li>
                <input type="radio" id="lesion2-2_4" name="lesion_2-2" value="4" />
                <label for="lesion2-2_4">Very Severe</label>
              </li>
            </ul>
            <label>Erythema/Redness</label>
            <ul class="select-choice">
              <li>
                <input type="radio" id="lesion2-3_0" name="lesion_2-3" value="0" />
                <label for="lesion2-3_0">None</label>
              </li>
              <li>
                <input type="radio" id="lesion2-3_1" name="lesion_2-3" value="1" />
                <label for="lesion2-3_1">Slight</label>
              </li>
              <li>
                <input type="radio" id="lesion2-3_2" name="lesion_2-3" value="2" />
                <label for="lesion2-3_2">Moderate</label>
              </li>
              <li>
                <input type="radio" id="lesion2-3_3" name="lesion_2-3" value="3" />
                <label for="lesion2-3_3">Severe</label>
              </li>
              <li>
                <input type="radio" id="lesion2-3_4" name="lesion_2-3" value="4" />
                <label for="lesion2-3_4">Very Severe</label>
              </li>
            </ul>
            <label>Desquamation/Scaling</label>
            <ul class="select-choice">
              <li>
                <input type="radio" id="lesion2-4_0" name="lesion_2-4" value="0" />
                <label for="lesion2-4_0">None</label>
              </li>
              <li>
                <input type="radio" id="lesion2-4_1" name="lesion_2-4" value="1" />
                <label for="lesion2-4_1">Slight</label>
              </li>
              <li>
                <input type="radio" id="lesion2-4_2" name="lesion_2-4" value="2" />
                <label for="lesion2-4_2">Moderate</label>
              </li>
              <li>
                <input type="radio" id="lesion2-4_3" name="lesion_2-4" value="3" />
                <label for="lesion2-4_3">Severe</label>
              </li>
              <li>
                <input type="radio" id="lesion2-4_4" name="lesion_2-4" value="4" />
                <label for="lesion2-4_4">Very Severe</label>
              </li>
            </ul>
            <p>Upload Pictures  ( optional )</p>
            <div class="upload-image">
              <input type="file" id="lesion_2-5" name="image" accept="image/*" />
              <label for="lesion_2-5"><img src="imgs/image-icon.png" alt="Upload image icon" /></label>
            </div>
          </form>
          <div className='lesion-part-icon'>
            <svg width="250" height="380" viewBox="0 0 127 230" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="63.2732" cy="21" r="21" fill="#DFDFDF"/>
                <rect x="68.2732" y="50.418" width="20" height="94.2982" rx="10" transform="rotate(-24.8912 68.2732 50.418)" fill="#3473C1"/>
                <rect width="20" height="91.5092" rx="10" transform="matrix(-0.907109 -0.420896 -0.420896 0.907109 56.658 51.418)" fill="#3473C1"/>
                <rect x="34.2732" y="127" width="22" height="103" rx="10" fill="#DFDFDF"/>
                <rect x="69.2732" y="126" width="22" height="104" rx="10" fill="#DFDFDF"/>
                <rect x="34.2732" y="45" width="57" height="98" rx="10" fill="#DFDFDF"/>
            </svg>
          </div>
        </div>
        <div id="lesion_body" class="lesion_part">
          <form class="checkin_lesion">
            <h2>Trunk ( 3/4 ) - Inputting PASI Scores</h2>
            <label>Area: % indicates the lesion's area coverage of the affected body part.</label>
            <ul class="radio">
              <li>
                <input type="radio" id="lesion3-1_0" name="lesion_3-1" value="0" />
                <label for="lesion3-1_0">0%</label>
              </li>
              <li>
                <input type="radio" id="lesion3-1_1" name="lesion_3-1" value="1" />
                <label for="lesion3-1_1">&lt;10%</label>
              </li>
              <li>
                <input type="radio" id="lesion3-1_2" name="lesion_3-1" value="2" />
                <label for="lesion3-1_2">10-29%</label>
              </li>
              <li>
                <input type="radio" id="lesion3-1_3" name="lesion_3-1" value="3" />
                <label for="lesion3-1_3">30-49%</label>
              </li>
              <li>
                <input type="radio" id="lesion3-1_4" name="lesion_3-1" value="4" />
                <label for="lesion3-1_4">50-69%</label>
              </li>
              <li>
                <input type="radio" id="lesion3-1_5" name="lesion_3-1" value="5" />
                <label for="lesion3-1_5">70-89%</label>
              </li>
              <li>
                <input type="radio" id="lesion3-1_6" name="lesion_3-1" value="6" />
                <label for="lesion3-1_6">90-100%</label>
              </li>
            </ul>
            <label>Induration/Thickness</label>
            <ul class="select-choice">
              <li>
                <input type="radio" id="lesion3-2_0" name="lesion_3-2" value="0" />
                <label for="lesion3-2_0">None</label>
              </li>
              <li>
                <input type="radio" id="lesion3-2_1" name="lesion_3-2" value="1" />
                <label for="lesion3-2_1">Slight</label>
              </li>
              <li>
                <input type="radio" id="lesion3-2_2" name="lesion_3-2" value="2" />
                <label for="lesion3-2_2">Moderate</label>
              </li>
              <li>
                <input type="radio" id="lesion3-2_3" name="lesion_3-2" value="3" />
                <label for="lesion3-2_3">Severe</label>
              </li>
              <li>
                <input type="radio" id="lesion3-2_4" name="lesion_3-2" value="4" />
                <label for="lesion3-2_4">Very Severe</label>
              </li>
            </ul>
            <label>Erythema/Redness</label>
            <ul class="select-choice">
              <li>
                <input type="radio" id="lesion3-3_0" name="lesion_3-3" value="0" />
                <label for="lesion3-3_0">None</label>
              </li>
              <li>
                <input type="radio" id="lesion3-3_1" name="lesion_3-3" value="1" />
                <label for="lesion3-3_1">Slight</label>
              </li>
              <li>
                <input type="radio" id="lesion3-3_2" name="lesion_3-3" value="2" />
                <label for="lesion3-3_2">Moderate</label>
              </li>
              <li>
                <input type="radio" id="lesion3-3_3" name="lesion_3-3" value="3" />
                <label for="lesion3-3_3">Severe</label>
              </li>
              <li>
                <input type="radio" id="lesion3-3_4" name="lesion_3-3" value="4" />
                <label for="lesion3-3_4">Very Severe</label>
              </li>
            </ul>
            <label>Desquamation/Scaling</label>
            <ul class="select-choice">
              <li>
                <input type="radio" id="lesion3-4_0" name="lesion_3-4" value="0" />
                <label for="lesion3-4_0">None</label>
              </li>
              <li>
                <input type="radio" id="lesion3-4_1" name="lesion_3-4" value="1" />
                <label for="lesion3-4_1">Slight</label>
              </li>
              <li>
                <input type="radio" id="lesion3-4_2" name="lesion_3-4" value="2" />
                <label for="lesion3-4_2">Moderate</label>
              </li>
              <li>
                <input type="radio" id="lesion3-4_3" name="lesion_3-4" value="3" />
                <label for="lesion3-4_3">Severe</label>
              </li>
              <li>
                <input type="radio" id="lesion3-4_4" name="lesion_3-4" value="4" />
                <label for="lesion3-4_4">Very Severe</label>
              </li>
            </ul>
            <p>Upload Pictures  ( optional )</p>
            <div class="upload-image">
              <input type="file" id="lesion_3-5" name="image" accept="image/*" />
              <label for="lesion_3-5"><img src="imgs/image-icon.png" alt="Upload image icon" /></label>
            </div>
          </form>
          <div className='lesion-part-icon'>
             <svg width="250" height="380" viewBox="0 0 127 230" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="63.2732" cy="21" r="21" fill="#DFDFDF"/>
                <rect x="68.2732" y="50.418" width="20" height="94.2982" rx="10" transform="rotate(-24.8912 68.2732 50.418)" fill="#DFDFDF"/>
                <rect width="20" height="91.5092" rx="10" transform="matrix(-0.907109 -0.420896 -0.420896 0.907109 56.658 51.418)" fill="#DFDFDF"/>
                <rect x="34.2732" y="127" width="22" height="103" rx="10" fill="#DFDFDF"/>
                <rect x="69.2732" y="126" width="22" height="104" rx="10" fill="#DFDFDF"/>
                <rect x="34.2732" y="45" width="57" height="98" rx="10" fill="#3473C1"/>
            </svg>
          </div>
         
        </div>
        <div id="lesion_legs" class="lesion_part">
          <form class="checkin_lesion">
            <h2>Legs ( 4/4 ) - Inputting PASI Scores</h2>
            <label>Area: % indicates the lesion's area coverage of the affected body part.</label>
            <ul class="radio">
              <li>
                <input type="radio" id="lesion4-1_0" name="lesion_4-1" value="0" />
                <label for="lesion4-1_0">0%</label>
              </li>
              <li>
                <input type="radio" id="lesion4-1_1" name="lesion_4-1" value="1" />
                <label for="lesion4-1_1">&lt;10%</label>
              </li>
              <li>
                <input type="radio" id="lesion4-1_2" name="lesion_4-1" value="2" />
                <label for="lesion4-1_2">10-29%</label>
              </li>
              <li>
                <input type="radio" id="lesion4-1_3" name="lesion_4-1" value="3" />
                <label for="lesion4-1_3">30-49%</label>
              </li>
              <li>
                <input type="radio" id="lesion4-1_4" name="lesion_4-1" value="4" />
                <label for="lesion4-1_4">50-69%</label>
              </li>
              <li>
                <input type="radio" id="lesion4-1_5" name="lesion_4-1" value="5" />
                <label for="lesion4-1_5">70-89%</label>
              </li>
              <li>
                <input type="radio" id="lesion4-1_6" name="lesion_4-1" value="6" />
                <label for="lesion4-1_6">90-100%</label>
              </li>
            </ul>
            <label>Induration/Thickness</label>
            <ul class="select-choice">
              <li>
                <input type="radio" id="lesion4-2_0" name="lesion_4-2" value="0" />
                <label for="lesion4-2_0">None</label>
              </li>
              <li>
                <input type="radio" id="lesion4-2_1" name="lesion_4-2" value="1" />
                <label for="lesion4-2_1">Slight</label>
              </li>
              <li>
                <input type="radio" id="lesion4-2_2" name="lesion_4-2" value="2" />
                <label for="lesion4-2_2">Moderate</label>
              </li>
              <li>
                <input type="radio" id="lesion4-2_3" name="lesion_4-2" value="3" />
                <label for="lesion4-2_3">Severe</label>
              </li>
              <li>
                <input type="radio" id="lesion4-2_4" name="lesion_4-2" value="4" />
                <label for="lesion4-2_4">Very Severe</label>
              </li>
            </ul>
            <label>Erythema/Redness</label>
            <ul class="select-choice">
              <li>
                <input type="radio" id="lesion4-3_0" name="lesion_4-3" value="0" />
                <label for="lesion4-3_0">None</label>
              </li>
              <li>
                <input type="radio" id="lesion4-3_1" name="lesion_4-3" value="1" />
                <label for="lesion4-3_1">Slight</label>
              </li>
              <li>
                <input type="radio" id="lesion4-3_2" name="lesion_4-3" value="2" />
                <label for="lesion4-3_2">Moderate</label>
              </li>
              <li>
                <input type="radio" id="lesion4-3_3" name="lesion_4-3" value="3" />
                <label for="lesion4-3_3">Severe</label>
              </li>
              <li>
                <input type="radio" id="lesion4-3_4" name="lesion_4-3" value="4" />
                <label for="lesion4-3_4">Very Severe</label>
              </li>
            </ul>
            <label>Desquamation/Scaling</label>
            <ul class="select-choice">
              <li>
                <input type="radio" id="lesion4-4_0" name="lesion_4-4" value="0" />
                <label for="lesion4-4_0">None</label>
              </li>
              <li>
                <input type="radio" id="lesion4-4_1" name="lesion_4-4" value="1" />
                <label for="lesion4-4_1">Slight</label>
              </li>
              <li>
                <input type="radio" id="lesion4-4_2" name="lesion_4-4" value="2" />
                <label for="lesion4-4_2">Moderate</label>
              </li>
              <li>
                <input type="radio" id="lesion4-4_3" name="lesion_4-4" value="3" />
                <label for="lesion4-4_3">Severe</label>
              </li>
              <li>
                <input type="radio" id="lesion4-4_4" name="lesion_4-4" value="4" />
                <label for="lesion4-4_4">Very Severe</label>
              </li>
            </ul>
            <p>Upload Pictures  ( optional )</p>
            <div class="upload-image">
              <input type="file" id="lesion_4-5" name="image" accept="image/*" />
              <label for="lesion_4-5"><img src="imgs/image-icon.png" alt="Upload image icon" /></label>
            </div>
          </form>
          <div className='lesion-part-icon'>
            <svg width="250" height="380" viewBox="0 0 127 230" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="63.2732" cy="21" r="21" fill="#DFDFDF"/>
                <rect x="68.2732" y="50.418" width="20" height="94.2982" rx="10" transform="rotate(-24.8912 68.2732 50.418)" fill="#DFDFDF"/>
                <rect width="20" height="91.5092" rx="10" transform="matrix(-0.907109 -0.420896 -0.420896 0.907109 56.658 51.418)" fill="#DFDFDF"/>
                <rect x="34.2732" y="127" width="22" height="103" rx="10" fill="#3473C1"/>
                <rect x="69.2732" y="126" width="22" height="104" rx="10" fill="#3473C1"/>
                <rect x="34.2732" y="45" width="57" height="98" rx="10" fill="#DFDFDF"/>
            </svg>
          </div>
        </div>
        <div id="calc_lesion">
          <div>
            <div>
              <p>Current PASI Score</p>
              <p class="big_num">0</p>
            </div>
            <h2 class="big_word">Moderate</h2>
            <div>
              <p>Key:</p>
              <br />
              <p>0-4: Low psoriasis level</p>
              <p>5-10: Moderate psoriasis level</p>
              <p>10-72: High psoriasis level</p>
            </div>
          </div>
          <h2>Section 2   -    Filling out itchiness and pain of leisons</h2>
          <form>
            <div>
              <label for="slider_itchy">Itchiness</label>
              <input type="range" min="0" max="10" value="5" step="0.5" id="slider_itchy" />
              <span id="slider_itchy_val">5.0</span>
              <div>
                <p>0</p>
                <p>10</p>
              </div>
            </div>
            <div>
              <label for="slider_pain">Pain</label>
              <input type="range" min="0" max="10" value="5" step="0.5" id="slider_pain" />
              <span id="slider_pain_val">5.0</span>
              <div>
                <p>0</p>
                <p>10</p>
              </div>
            </div>
          </form>
        </div>
        <div id="lesion_buttons">
          <button class="skipLesion" id="show_calc_lesion">Skip to Lesions Section 2</button>
          <button class="lesionNext" id="lesion_next">Next</button>
        </div>
      </div>

      <div id="stress">
        <h1 class="pageTitle">Stress</h1>
        <form id="checkin_stress">
          <p>1 = Not at all,  2 = A little,  3 = Moderately,  4 = Quite a bit,  5 = Extremely</p>
          <label for="stress_1">1. How stressed did you feel about your responsibilities today (work, school, personal tasks)?</label>
          <ul class="single-choice">
            <li>
              <input type="radio" id="stress1-1" name="stress_1" value="1" />
              <label for="stress1-1">1</label>
            </li>
            <li>
              <input type="radio" id="stress1-2" name="stress_1" value="2" />
              <label for="stress1-2">2</label>
            </li>
            <li>
              <input type="radio" id="stress1-3" name="stress_1" value="3" />
              <label for="stress1-3">3</label>
            </li>
            <li>
              <input type="radio" id="stress1-4" name="stress_1" value="4" />
              <label for="stress1-4">4</label>
            </li>
            <li>
              <input type="radio" id="stress1-5" name="stress_1" value="5" />
              <label for="stress1-5">5</label>
            </li>
          </ul>
          <label for="stress_2">2. How much emotional stress did you experience today (e.g., anxiety, irritability)?</label>
          <ul class="single-choice">
            <li>
              <input type="radio" id="stress2-1" name="stress_2" value="1" />
              <label for="stress2-1">1</label>
            </li>
            <li>
              <input type="radio" id="stress2-2" name="stress_2" value="2" />
              <label for="stress2-2">2</label>
            </li>
            <li>
              <input type="radio" id="stress2-3" name="stress_2" value="3" />
              <label for="stress2-3">3</label>
            </li>
            <li>
              <input type="radio" id="stress2-4" name="stress_2" value="4" />
              <label for="stress2-4">4</label>
            </li>
            <li>
              <input type="radio" id="stress2-5" name="stress_2" value="5" />
              <label for="stress2-5">5</label>
            </li>
          </ul>
          <label for="stress_3">3. How much physical tension (e.g., headaches, muscle tightness) did you feel today?</label>
          <ul class="single-choice">
            <li>
              <input type="radio" id="stress3-1" name="stress_3" value="1" />
              <label for="stress3-1">1</label>
            </li>
            <li>
              <input type="radio" id="stress3-2" name="stress_3" value="2" />
              <label for="stress3-2">2</label>
            </li>
            <li>
              <input type="radio" id="stress3-3" name="stress_3" value="3" />
              <label for="stress3-3">3</label>
            </li>
            <li>
              <input type="radio" id="stress3-4" name="stress_3" value="4" />
              <label for="stress3-4">4</label>
            </li>
            <li>
              <input type="radio" id="stress3-5" name="stress_3" value="5" />
              <label for="stress3-5">5</label>
            </li>
          </ul>
          <div className="calc_stress_btn_container">
            <button type="button" class="calc_stress_btn">Calculate Stress Level</button>
          </div>
        </form>
        <div id="calc_stress">
          <div>
            <p>Average Stress Score:</p>
            <p class="big_num">0</p>
          </div>
          <h2 class="big_word">Moderate</h2>
          <div>
            <p>Key:</p>
            <br />
            <p>0-2: Low stress level</p>
            <p>2-4: Moderate stress level</p>
            <p>4-5: High stress level</p>
          </div>
        </div>
      </div>

      <div id="hormone">
        <h1 class="pageTitle">Hormone Cycle</h1>
        <div>
          <p>Rise in <span class="bold">estrogen</span> levels may decrease symptoms of psoriasis</p>
          <p>Rise in <span class="bold">progesterone</span> levels may increase symptoms of psoriasis</p>
          <p>Period cycles, puberty, pregnancy and menopause all have an effect on psoriasis symptoms due to the fluctuations of these hormones.</p>
        </div>
        <div class="horizontal">
          <div>
            <h2>Last Recorded Period Start Date</h2>
            <h2 id="period_date" class="lightblue_bg">No data found</h2>
            <button id="period_start" class="white_btn">my period started today</button>
            <h2>Current Phase</h2>
            <h2 id="period_phase" class="lightblue_bg">No data found</h2>
          </div>
          <img src="imgs/hormone-cycle.png" alt="Hormone cycle" aria-describedby="hormone_desc" />
          <div id="hormone_desc" class="aria_described">An image of the hormone cycle and its 4 phases. Menstrual phase is days 1-7 with low estrogen and high progesterone. Follicular phase is days 1-12 with high estrogen and low progesterone. Ovulation phase is days 13-15 with highest estrogen and low progesterone. Menstrual phase is days 16-28 with low estrogen and high progesterone.</div>
        </div>
      </div>

      <div id="sun">
        <h1 class="pageTitle">Sun Exposure</h1>
        <form>
          <p>How long did you stay out directly in the sun?</p>
          <input class="rounded_corners" name="sun_hr" id="sun_hr" type="number" min="0" max="24" />
          <label for="sun_hr">hr</label>
          <input class="rounded_corners" name="sun_min" id="sun_min" type="number" min="0" max="59" />
          <label for="sun_min">min</label>
        </form>
      </div>

      <div id="medication">
        <AddMedication
          medications={medications}
          setMedications={setMedications}
          dailyNotes={dailyNotes}
          setDailyNotes={setDailyNotes}
        />
      </div>

      <div id="routine">
        <h1 class="pageTitle">Skin Care Routine</h1>
        <div>
          <p>How did you treat your skin today?</p>
          <div class="routines">
            <div id="cleansing"><h3 class="white_btn">Cleansing/Bathing</h3></div>
            <div id="moisturizer"><h3 class="white_btn">Moisturizer</h3></div>
          </div>
          <button id="add_routine" class="white_btn">Add a step<img src="imgs/add_circle.png" alt="Plus symbol" /></button>
        </div>
        <form class="popup">
          <label for="routine_select">What type of product is it?</label>
          <select id="routine_select" name="routine_select">
            <option value="cleansing">Cleansing/Bathing</option>
            <option value="moisturizer">Moisturizer</option>
          </select>
          <label for="routine_name">What is the name of the product?</label>
          <input name="routine_name" id="routine_name" maxLength="20" />
          <button id="submit_routine" class="darkblue_btn">Submit Step</button>
          <button id="hide_routine" class="lightblue_btn">Cancel</button>
        </form>
      </div>

      <div id="diet">
        <h1 class="pageTitle">Diet</h1>
        <div>
          <div class="border_right">
            <p>Add a food you ate from the following list.</p>
            <input type="text" class="search_bar" placeholder="search food" />
            <div id="diets_add"></div>
            <button id="add_diet" class="white_btn">Add New Food<img src="imgs/add_circle.png" alt="Plus symbol" /></button>
          </div>
          <div class="margin_left">
            <p>What did you eat today?</p>
            <div id="diets_ate"></div>
          </div>
          <div>
            <form>
              <div>
                <label for="diet_notes"><h1>Notes</h1></label>
                <img src="imgs/notes-icon.png" alt="Notes icon" />
              </div>
              <textarea name="diet_notes" id="diet_notes" placeholder="Type any thoughts or changes you made in your diet today..." maxLength="200"></textarea>
              <label for="diet_weight"><h4>Today's Weight:</h4></label>
              <input name="diet_weight" id="diet_weight" placeholder="Lbs/Kg" type="number" min="0" max="1000" />
            </form>
          </div>
        </div>
        <form class="popup">
          <label for="diet_name"><h1>Food Label</h1></label>
          <input name="diet_name" id="diet_name" maxLength="20" />
          <button id="submit_diet" class="darkblue_btn">Add</button>
          <button id="hide_diet" class="lightblue_btn">Cancel</button>
        </form>
      </div>

      <div id="weather">
        <AddWeather />
      </div>

      <div id="checkin_submitted">
        <h1>Checkin Submitted!</h1>
      </div>

      <div id="buttons">
        <button class="next_button" id="go_next">Record </button>
        <button class="lightblue_btn" id="submit_checkin">Complete Daily-Check In</button>
      </div>
    </div>
    <CheckinNavbar />
    </div>
  );
}

export default Checkin;