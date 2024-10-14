import "./App.css"
import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import { addTraceInfo, processData } from './dataUtils';

const App = () => {
  // Store plot data in state.
  // Since the 'select' element isn't working, the data can be chosen here.
  const [selectedFile, setSelectedFile] = useState(
    'data0.json'
    // 'data1.json'
    // 'data2.json'
  );
  const [plotData, setPlotData] = useState([]);

  async function fetchData(fileName) {
    console.log('calling fetchdata...');

    try {
      // 'data.json' should be populated from a run of sim.py
      const response = await fetch(fileName);
      const data = await response.json();
      // Process data into format for plotting
      const processed = processData(data);
      const updatedPlotData = addTraceInfo(processed);
      setPlotData(Object.values(updatedPlotData));
      console.log('plotData:', Object.values(updatedPlotData));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    // fetch plot data when the component mounts
    fetchData(selectedFile);
  }, [selectedFile]);

  return (
    <div className='app'>
      <div className='menu'>
        <h3>Choose Simulation Data:</h3>
        <p>The div for the dropdown menu.</p>
        <select
          onChange={(e) => {
            console.log('Selected file:', e.target.value);
            setSelectedFile(e.target.value);
          }}
          value={selectedFile}
        >
          <option value="data0.json">Simulation Data</option>
          <option value="data1.json">Simulation Data (-0.0001v)</option>
          <option value="data2.json">Simulation Data (+0.00001)</option>
        </select>
      </div>

      <div className='plot'>
        <p>The div for the plot.</p>
        <Plot
          style={{ position: 'fixed', width: '100%', height: '100%', left: 0, top: 0 }}
          data={plotData}
          layout={{
            title: 'Three Agent Orbit Simulation',
            scene: {
              xaxis: { title: 'x', range: [-250, 100] },
              yaxis: { title: 'y', range: [-250, 100] },
              zaxis: { title: 'time' },
              aspectmode: 'cube'
              // aspectratio: {x: 2, y: 1, z: 2}
            }
          }}
        />
      </div>
    </div>
  );
};

export default App;
