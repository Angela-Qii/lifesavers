"use strict";
(function() {

window.addEventListener("load", init);

let currSection = 'lesion';

/**
 * Sets up event listeners for website's buttons.
 */
async function init() {
  id('upload_data').addEventListener('submit', (evt) => {
    evt.preventDefault();
    uploadData();
  });
  loadData();
  //await loadIdentity();
}

function showStress(id, text, btn) {
  id(currSection).style.display = 'none';
  id('stress').style.display = 'block';
  currSection = 'stress';
}

/**
 * Uploads data from form to database.
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