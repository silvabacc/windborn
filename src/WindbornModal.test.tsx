import React from 'react';
import WindbornModal from './WindbornModal';
import {fireEvent, render, screen} from '@testing-library/react-native';
import {NativeModules} from 'react-native';

const mockExitApp = jest.fn();

const mockRandomComponent = (
  <div testID="random-component">Random Component</div>
);

describe('<WindbornModal />', () => {
  it('should render the component that was passed', () => {
    render(<WindbornModal content={mockRandomComponent} />);

    expect(screen.getByTestId('random-component')).toBeTruthy();
  });

  it('should close the application when clicking outside modal', async () => {
    NativeModules.ExitModule = {exitApp: mockExitApp};

    render(
      <>
        <WindbornModal content={mockRandomComponent} />
      </>,
    );

    const touchableOpacity = screen.getByTestId('modal-container');
    fireEvent.press(touchableOpacity);
    expect(mockExitApp).toHaveBeenCalled();
  });
});
