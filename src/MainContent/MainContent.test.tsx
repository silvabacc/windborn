import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import React from 'react';
import {NativeModules} from 'react-native';
import {fetchImageBase64, convertImageToBase64} from './imageBase64';
import MainContent from './MainContent';

jest.mock('./imageBase64');
jest.mock('rn-fetch-blob');

const mockClipboardModule = jest.fn();

const mockFetchImageBase64 = fetchImageBase64 as jest.Mocked<any>;
const mockConvertImageToBase64 = convertImageToBase64 as jest.Mocked<any>;

mockConvertImageToBase64.mockReturnValue('image');
mockFetchImageBase64.mockReturnValue('image');

describe('<MainContent />', () => {
  it('should handle text mimetype', () => {
    const intentData = {
      data: '',
      mimeType: 'text/plain',
    };
    render(<MainContent intentData={intentData} />);

    expect(mockFetchImageBase64).toHaveBeenCalled();
  });

  it.each(['image/*', 'image/png', 'image/jpg'])(
    'should handle image mimetype',
    mimeType => {
      const intentData = {
        data: '',
        mimeType,
      };

      render(<MainContent intentData={intentData} />);

      expect(mockFetchImageBase64).toHaveBeenCalled();
    },
  );

  it('should render the clipboard menu', async () => {
    const intentData = {
      data: 'dummy_image_url',
      mimeType: 'text/plain',
    };

    render(<MainContent intentData={intentData} />);

    await waitFor(() => {
      expect(screen.getByTestId('clipboard-menu')).toBeTruthy();
    });
  });

  it('should copy the image when clicking on button', async () => {
    NativeModules.ClipboardModule = {copyBase64: mockClipboardModule};

    const intentData = {
      data: 'dummy_image_url',
      mimeType: 'text/plain',
    };

    render(<MainContent intentData={intentData} />);

    await waitFor(() => {
      expect(screen.getByTestId('clipboard-menu')).toBeTruthy();
    });

    fireEvent.press(screen.getByTestId('copy-clipboard-button'));
  });

  it('should be loading', () => {
    const intentData = {
      data: 'dummy_image_url',
      mimeType: 'text/plain',
    };

    render(<MainContent intentData={intentData} />);

    expect(screen.getByText('Preparing preview...')).toBeTruthy();
  });

  it('should render the error message', () => {
    const intentData = {
      data: 'dummy_image_url',
      mimeType: 'text/plain',
    };

    mockFetchImageBase64.mockImplementationOnce(() => {
      throw new Error();
    });

    render(<MainContent intentData={intentData} />);

    expect(
      screen.getByText("Oops, this post doesn't seem to have any images"),
    ).toBeTruthy();
  });
});
