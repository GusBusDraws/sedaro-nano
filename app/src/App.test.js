import { addTraceInfo, processData } from "./dataUtils";

let data;

beforeEach(() => {
  data = [
    [
      -99,
      0,
      {
        "Planet": {
          "time": 0,
          "x": 0,
          "y": 0.1
        },
        "Satellite": {
          "time": 0,
          "x": 0,
          "y": 1
        }
      }
    ],
    [
      0,
      0.01,
      {
        "Planet": {
          "time": 0.01,
          "x": 0.001,
          "y": 0.1
        }
      }
    ],
    [
      0,
      0.01,
      {
        "Satellite": {
          "time": 0.01,
          "x": 0.01,
          "y": 0.1
        }
      }
    ]
  ];
});

test('correctly transforms data for Plotly.js', () => {

  const processed = processData(data);

  expect(processed).toEqual({
    'Planet': {
      x: [0, 0.001],
      y: [0.1, 0.1]
    },
    'Satellite': {
      x: [0, 0.01],
      y: [1, 0.1]
    }
  });
});

test('adds trace info for plotting', () => {
  const processed = processData(data);
  const traces = addTraceInfo(processed);
  expect(traces).toEqual({
    'Planet': {
      x: [0, 0.001],
      y: [0.1, 0.1],
      name: 'Planet'
      // type: 'scatter3d'
    },
    'Satellite': {
      x: [0, 0.01],
      y: [1, 0.1],
      name: 'Satellite'
      // type: 'scatter3d'
    }
  });
});
