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

test('processed data for Plotly.js', () => {

  const processed = processData(data);

  expect(processed).toEqual({
    'Planet': {
      x: [0, 0.001],
      y: [0.1, 0.1],
      time: [0, 0.01]
    },
    'Satellite': {
      x: [0, 0.01],
      y: [1, 0.1],
      time: [0, 0.01]
    }
  });
});

test('propagated names into trace info', () => {
  const processed = processData(data);
  const traces = addTraceInfo(processed);
  expect(traces['Planet'].name).toEqual('Planet')
  expect(traces['Satellite'].name).toEqual('Satellite')
});

test('collected time data into z dimension', () => {
  const processed = processData(data);
  const traces = addTraceInfo(processed);
  expect(traces['Planet'].z).toEqual([0, 0.01])
  expect(traces['Satellite'].z).toEqual([0, 0.01])
});