import React from 'react';
import {render, screen} from '@testing-library/react-native';
import Windborn from './Windborn';

jest.mock('./MainContent/MainContent', () => () => (
  <div testID="main-content-modal">Main Content Modal</div>
));
jest.mock('./HomeContent', () => () => (
  <div testID="home-content-modal">Home Content Modal</div>
));

const mockIntentData = {data: 'url', type: 'mime'};

describe('<Windborn />', () => {
  it('should render the Home content intentData is null', () => {
    render(<Windborn />);
    expect(screen.getByTestId('home-content-modal')).toBeTruthy();
  });

  it('should render the Main content when intentData is not null', () => {
    render(<Windborn intentData={mockIntentData as any} />);
    expect(screen.getByTestId('main-content-modal')).toBeTruthy();
  });
});
