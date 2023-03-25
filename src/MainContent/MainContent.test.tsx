import {render} from '@testing-library/react-native';
import React from 'react';
import {fetchContent} from './content/content';
import MainContent from './MainContent';

jest.mock('./content/content');
jest.mock('react-native-gesture-handler');
jest.mock('react-native-video');
jest.mock('uuid', () => ({v4: () => '123456789'}));
jest.mock('react-native-reanimated-carousel', () => () => <div>Carousel</div>);

const mockFetchContent = fetchContent as jest.Mocked<any>;

mockFetchContent.mockReturnValue([{uri: 'dummyUri', type: 'image'}]);

describe('<MainContent />', () => {
  it('should render the carousel', () => {
    const intentData = {
      data: {url: 'dummy', type: 'text/plain'},
    };

    render(<MainContent intentData={intentData as any} />);

    expect();
  });
});
