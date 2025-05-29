import React, { useState, useEffect } from 'react';
import { Scatter } from 'react-chartjs-2';
import {
 Chart as ChartJS,
 LinearScale,
 PointElement,
 Tooltip,
 Legend
} from 'chart.js';


ChartJS.register(LinearScale, PointElement, Tooltip, Legend);


const ContentDashboard = ({user}) => {
 const [formData, setFormData] = useState({
   date: '',
   pasi: '',
   stress: '',
   hormoneCycleDate: '',
   sunExposure: '',
   medication: 'None',
   skinCareRoutine: 'Basic',
   diet: 'Regular',
   temperature: '',
   humidity: ''
 });


 const [data, setData] = useState([]);
 const [xVar, setXVar] = useState('pasi');
 const [yVar, setYVar] = useState('stress');


 useEffect(() => {
   // Dynamically inject Google Fonts into <head>
   const link = document.createElement('link');
   link.href = 'https://fonts.googleapis.com/css2?family=Inter&family=Poppins:wght@600&display=swap';
   link.rel = 'stylesheet';
   document.head.appendChild(link);
   getCheckinData();
 }, []);

 /**
 * Fetches user's checkin data and displays it.
 */
async function getCheckinData() {
  try {
    const res = await axios.get(
      `/api/checkin/all/${encodeURIComponent(user.displayName)}`,
    );
    if (!res) {
      return;
    }
    const result = res.data;
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


 const handleInputChange = (e) => {
   const { name, value } = e.target;
   setFormData(prev => ({ ...prev, [name]: value }));
 };


 const handleSubmit = (e) => {
   e.preventDefault();
   const entry = { ...formData };
   setData(prev => [...prev, entry]);
   setFormData({
     date: '',
     pasi: '',
     stress: '',
     hormoneCycleDate: '',
     sunExposure: '',
     medication: 'None',
     skinCareRoutine: 'Basic',
     diet: 'Regular',
     temperature: '',
     humidity: ''
   });
 };


 const clearForm = () => {
   setFormData({
     date: '',
     pasi: '',
     stress: '',
     hormoneCycleDate: '',
     sunExposure: '',
     medication: 'None',
     skinCareRoutine: 'Basic',
     diet: 'Regular',
     temperature: '',
     humidity: ''
   });
 };


 const numericFields = [
   { name: 'pasi', label: 'PASI Score' },
   { name: 'stress', label: 'Stress Level' },
   { name: 'hormoneCycleDate', label: 'Hormone Cycle Day' },
   { name: 'sunExposure', label: 'Sun Exposure (hrs)' },
   { name: 'temperature', label: 'Temperature (°C)' },
   { name: 'humidity', label: 'Humidity (%)' }
 ];


 const chartData = {
   datasets: [{
     label: `${xVar} vs ${yVar}`,
     data: data.map(d => ({
       x: parseFloat(d[xVar]),
       y: parseFloat(d[yVar])
     })).filter(d => !isNaN(d.x) && !isNaN(d.y)),
     backgroundColor: '#004082'
   }]
 };


 const chartOptions = {
   responsive: true,
   plugins: {
     legend: { position: 'top' },
     tooltip: { enabled: true }
   },
   scales: {
     x: {
       title: { display: true, text: numericFields.find(f => f.name === xVar)?.label }
     },
     y: {
       title: { display: true, text: numericFields.find(f => f.name === yVar)?.label }
     }
   }
 };


 return (
   <div style={{ padding: '30px', fontFamily: "'Inter', sans-serif" }}>
     {/* Dashboard Title */}
     <h1 style={{ fontSize: '28px', marginBottom: '25px', fontFamily: "'Poppins', sans-serif" }}>
       Skin Health Tracker Dashboard
     </h1>


     {/* Add Entry Form */}
     <form onSubmit={handleSubmit} style={{
       background: '#ffffff',
       border: '1px solid #e9ecef',
       borderRadius: '8px',
       padding: '30px',
       marginBottom: '25px',
       boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
       fontFamily: "'Inter', sans-serif"
     }}>
       <h2 style={{ fontSize: '20px', marginBottom: '20px' }}>Add New Entry</h2>
       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
         {Object.entries(formData).map(([key, value]) => (
           <div key={key}>
             <label style={{ fontWeight: 500 }}>{key.charAt(0).toUpperCase() + key.slice(1)}:</label><br />
             <input
               type={key === 'date' ? 'date' : 'text'}
               name={key}
               value={formData[key]}
               onChange={handleInputChange}
               style={{ width: '100%', padding: '8px', marginTop: '5px', fontFamily: "'Inter', sans-serif" }}
             />
           </div>
         ))}
       </div>
       <div style={{ display: 'flex', gap: '12px', marginTop: '25px', flexDirection: 'row' }}>
         <button type="submit" style={{ flex: 1, background: '#004082', color: 'white', padding: '10px 16px', borderRadius: '4px', fontSize: '14px' }}>Add Entry</button>
         <button type="button" onClick={clearForm} style={{ flex: 1, background: '#6c757d', color: 'white', padding: '10px 16px', borderRadius: '4px', fontSize: '14px' }}>Clear Form</button>
       </div>
     </form>


     {/* Graph Section */}
     <div style={{ background: '#ffffff', border: '1px solid #e9ecef', borderRadius: '8px', padding: '30px', marginBottom: '25px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)', fontFamily: "'Inter', sans-serif" }}>
       <h2 style={{ fontSize: '20px', marginBottom: '20px' }}>Visualize Relationships</h2>
       <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '20px' }}>
         <div>
           <label style={{ fontWeight: 500 }}>X-axis:</label><br />
           <select value={xVar} onChange={e => setXVar(e.target.value)} style={{ padding: '8px', marginTop: '5px', fontFamily: "'Inter', sans-serif" }}>
             {numericFields.map(f => <option key={f.name} value={f.name}>{f.label}</option>)}
           </select>
         </div>
         <div>
           <label style={{ fontWeight: 500 }}>Y-axis:</label><br />
           <select value={yVar} onChange={e => setYVar(e.target.value)} style={{ padding: '8px', marginTop: '5px', fontFamily: "'Inter', sans-serif" }}>
             {numericFields.map(f => <option key={f.name} value={f.name}>{f.label}</option>)}
           </select>
         </div>
       </div>
       <div style={{ maxWidth: '700px', height: '400px' }}>
         <Scatter data={chartData} options={chartOptions} />
       </div>
     </div>


     {/* Data Table */}
     <div style={{ background: '#ffffff', border: '1px solid #e9ecef', borderRadius: '8px', padding: '30px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)', fontFamily: "'Inter', sans-serif" }}>
       <h2 style={{ fontSize: '20px', marginBottom: '20px' }}>Data Table</h2>
       <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
         <thead>
           <tr>
             {Object.keys(formData).map((key, index) => (
               <th key={index} style={{ padding: '8px', borderBottom: '1px solid #e9ecef', background: '#f8f9fa' }}>{key}</th>
             ))}
           </tr>
         </thead>
         <tbody>
           {data.map((entry, i) => (
             <tr key={i}>
               {Object.values(entry).map((val, j) => (
                 <td key={j} style={{ padding: '8px', borderBottom: '1px solid #e9ecef' }}>{val}</td>
               ))}
             </tr>
           ))}
         </tbody>
       </table>
     </div>
   </div>
 );
};


export default ContentDashboard;

// function ContentDashboard() {
//     return (
//       <div id="content">
//       {/* Will only display info when an error occurs */}
//       <p id="error_info"></p>
//       <h1>Dashboard</h1>
//       <div class="horizontal">
//         <div>
//           <div>
//             <div class="gray_box">
//               <h4>Hormonal Influence</h4>
//             </div>
//           </div>
//           <div>
//             <div class="gray_box">
//               <h4>Psoriasis Severity</h4>
//             </div>
//           </div>
//         </div>
//         <div>
//           <div class="gray_box">
//             <h4>Medications</h4>
//           </div>
//         </div>
//       </div>
//     </div>
//     );
// }

// export default ContentDashboard;
