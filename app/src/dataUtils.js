export function processData(data) {
  const updatedPlotData = {};
  data.forEach(([t0, t1, frame]) => {
    for (let [agentId, { x, y, time }] of Object.entries(frame)) {
      updatedPlotData[agentId] = updatedPlotData[agentId] || { x: [], y: [], time: []};
      updatedPlotData[agentId].x.push(x);
      updatedPlotData[agentId].y.push(y);
      updatedPlotData[agentId].time.push(time);
    }
  });
  return updatedPlotData;
};

export function addTraceInfo(processed) {
  const traces = {};
  for (let [agentId, { x, y, time }] of Object.entries(processed)) {
    traces[agentId] = {
      x: x,
      y: y,
      z: time,
      name: agentId,
      type: 'scatter3d',
      mode: 'lines',
      line: {
        width: 5
      }
    }
  };
  return traces
};
