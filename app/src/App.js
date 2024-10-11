import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import { addTraceInfo, processData } from './dataUtils';

const App = () => {
  // Store plot data in state.
  const [plotData, setPlotData] = useState([]);

  useEffect(() => {
    // fetch plot data when the component mounts

    async function fetchData() {
      console.log('calling fetchdata...');

      try {
        // 'data.json' should be populated from a run of sim.py
        const response = await fetch('data.json');
        const data = await response.json();
        // Process data into format for plotting
        const processed = processData(data);
        const updatedPlotData = addTraceInfo(processed);
        setPlotData(Object.values(updatedPlotData));
        console.log('plotData:', Object.values(updatedPlotData));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  return (
    <Plot
      style={{ position: 'fixed', width: '100%', height: '100%', left: 0, top: 0 }}
      data={plotData}
      layout={{
        title: 'Orbit Simulation',
        // yaxis: { scaleanchor: 'x' },
        autosize: true,
      }}
    />
  );
};

export default App;
