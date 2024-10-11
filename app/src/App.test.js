import { processData } from "./dataUtils";

test('correctly transforms data for Plotly.js', () => {
  const data = [
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
