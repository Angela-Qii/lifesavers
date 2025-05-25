import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function SingleCheckin({user}) {

    const { checkinDate } = useParams();

  useEffect(() => {
      // TODO: Make page not usable if user isn't logged in?
      loadCheckin();
    }, []); // Empty dependency array ensures this runs only on mount/unmount

   /**
 * Fetches user's checkin data and displays it.
 */
async function loadCheckin() {
  try {
    const res = await axios.get(
      `/api/checkin/single/${encodeURIComponent(user.displayName)}/${checkinDate}`,
    );
    if (!res) {
      return;
    }
    const result = res.data;
    id('data').textContent = result;
    id('date').textContent = checkinDate;
    console.log(result);
  } catch (err) {
    handleError('Load error: ' + err);
    console.error('Error:', err);
  }
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
 * Shows error message.
 * @param {string} err - Error message.
 */
function handleError(err) {
  id('error_info').textContent = 'Error: ' + err;
}

  return (
    <div id="content">
      {/* <!-- Will only display info when an error occurs --> */}
      <p id="error_info"></p>

      <h1 id="date">Date</h1>
      <p id="data">No data found</p>
    </div>
    );
  }

  export default SingleCheckin;