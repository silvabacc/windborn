import {render, screen} from '@testing-library/react-native';
import React from 'react';
import {act} from 'react-test-renderer';
import {fetchContent} from './content/content';
import {Content, ContentType} from './content/types';
import MainContent from './MainContent';

jest.mock('./content/content');
jest.mock('react-native-share', () => ({
  default: jest.fn(),
}));
jest.mock('react-native-reanimated');

const mockFetchContent = fetchContent as jest.Mocked<any>;

describe('<MainContent />', () => {
  it('should render the carouel', async () => {
    mockFetchContent.mockResolvedValueOnce([
      {uri: 'dummy', type: ContentType.IMAGE} as Content,
    ]);

    const intentData = {url: 'dummy', mimeType: 'text/plain'};

    render(<MainContent intentData={intentData} />);

    expect(await screen.findByTestId('carousel')).toBeTruthy();
  });

  it('should render loading', async () => {
    const data = {url: 'dummy', mimeType: 'text/plain'};
    mockFetchContent.mockResolvedValueOnce([]);
    render(<MainContent intentData={data as any} />);

    expect(await screen.findByTestId('loading-indicator')).toBeTruthy();
  });
});
