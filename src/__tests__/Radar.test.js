// @flow
import React from 'react';
import renderer from 'react-test-renderer';
import Radar from '../Radar';

test('Renders component', () => {
  const component = renderer.create(
    <Radar
      highlighted={null}
      width={500}
      height={500}
      padding={70}
      domainMax={10}
      data={{
        variables: [
          {key: 'resilience', label: 'Resilience'},
          {key: 'strength', label: 'Strength'},
          {key: 'adaptability', label: 'Adaptability'},
          {key: 'creativity', label: 'Creativity'},
          {key: 'openness', label: 'Open to Change'},
          {key: 'confidence', label: 'Confidence'},
        ],
        sets: [
          {
            key: 'me',
            label: 'My Scores',
            values: {
              resilience: 4,
              strength: 6,
              adaptability: 7,
              creativity: 2,
              openness: 8,
              confidence: 1,
            },
          },
          {
            key: 'everyone',
            label: 'Everyone',
            values: {
              resilience: 10,
              strength: 8,
              adaptability: 6,
              creativity: 4,
              openness: 2,
              confidence: 0,
            },
          },
        ],
      }}
    />,
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
