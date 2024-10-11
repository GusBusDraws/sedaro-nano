// Separate data processing
export function processData(data) {
  const updatedPlotData = {};
  data.forEach(([t0, t1, frame]) => {
    for (let [agentId, { x, y }] of Object.entries(frame)) {
      updatedPlotData[agentId] = updatedPlotData[agentId] || { x: [], y: [] };
      updatedPlotData[agentId].x.push(x);
      updatedPlotData[agentId].y.push(y);
    }
  });
  return updatedPlotData;
}
