import {render, screen} from '@testing-library/react-native';
import React from 'react';
import {fetchContent} from './content/content';
import MainContent from './MainContent';

jest.mock('./content/content');

const mockFetchContent = fetchContent as jest.Mocked<any>;

describe('<MainContent />', () => {
  it('should render the carouel', () => {
    const intentData = {url: 'dummy', type: 'text/plain'};
    render(<MainContent intentData={intentData as any} />);

    expect(screen.getByTestId('carousel')).toBeTruthy();
  });
});
