import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import React from 'react';
import {fetchContent} from './content/content';
import {Content, ContentType} from './content/types';
import MainContent from './MainContent';
import {NativeModules, ToastAndroid} from 'react-native';

const mockOpen = jest.fn();

jest.mock('./content/content');
jest.mock('react-native-share', () => ({
  open: (value: any) => mockOpen(value),
}));
jest.mock('react-native-reanimated');

const mockFetchContent = fetchContent as jest.Mocked<any>;
const mockCopyUri = jest.fn();
const mockCopyText = jest.fn();
const mockToast = jest.fn();

mockFetchContent.mockReturnValue([
  {uri: 'dummy', type: ContentType.IMAGE} as Content,
]);

describe('<MainContent />', () => {
  it('should render the carouel', async () => {
    const intentData = {data: 'dummy', mimeType: 'text/plain'};

    render(<MainContent intentData={intentData} />);

    expect(await screen.findByTestId('carousel')).toBeTruthy();
  });

  it.each([Object.values(ContentType)])(
    'should render %s type with the correct component',
    async type => {
      mockFetchContent.mockReturnValueOnce([{uri: 'dummy', type} as Content]);

      const intentData = {data: '', mimeType: 'text/plain'};

      render(<MainContent intentData={intentData} />);

      expect(await screen.findByTestId('carousel')).toBeTruthy();
      await waitFor(
        () => expect(screen.findByTestId(`carousel-${type}`)).toBeTruthy(),
        {timeout: 5000},
      );
    },
  );

  it('should render %s type with the correct component', async () => {
    const intentData = {data: '', mimeType: 'text/plain'};

    render(<MainContent intentData={intentData} />);

    expect(await screen.findByTestId('carousel')).toBeTruthy();
    await waitFor(
      () =>
        expect(
          screen.findByTestId(`carousel-${ContentType.IMAGE}`),
        ).toBeTruthy(),
      {timeout: 5000},
    );
  });

  it('should render loading', async () => {
    const data = {url: 'dummy', mimeType: 'text/plain'};
    mockFetchContent.mockReturnValueOnce([]);
    render(<MainContent intentData={data as any} />);

    expect(await screen.findByTestId('loading-indicator')).toBeTruthy();
  });

  it('should copy content to clipboard for images', async () => {
    mockFetchContent.mockReturnValueOnce([
      {uri: 'dummy', type: ContentType.IMAGE} as Content,
    ]);

    const intentData = {data: 'dummy', mimeType: 'text/plain'};
    NativeModules.ClipboardModule = {copyUri: mockCopyUri};
    ToastAndroid.show = mockToast;

    render(<MainContent intentData={intentData} />);

    const copyButton = await screen.findByTestId('copy-button');

    expect(screen.getByTestId('copy-button')).toBeTruthy();

    fireEvent.press(copyButton);

    expect(mockCopyUri).toHaveBeenCalled();
    expect(mockCopyUri).toHaveBeenCalledWith('dummy');
    expect(mockToast).toHaveBeenCalledWith(
      'Copied to your clipboard!',
      undefined,
    );
  });

  it('should copy url to clipboard for videos', async () => {
    mockFetchContent.mockReturnValueOnce([
      {uri: 'dummy', type: ContentType.VIDEO} as Content,
    ]);

    const intentData = {data: 'dummy', mimeType: 'text/plain'};
    NativeModules.ClipboardModule = {copyText: mockCopyText};
    ToastAndroid.show = mockToast;

    render(<MainContent intentData={intentData} />);

    const copyButton = await screen.findByTestId('copy-button');

    expect(screen.getByTestId('copy-button')).toBeTruthy();

    fireEvent.press(copyButton);

    expect(mockCopyText).toHaveBeenCalled();
    expect(mockCopyText).toHaveBeenCalledWith('dummy');
    expect(mockToast).toHaveBeenCalledWith(
      'Copied to your clipboard!',
      undefined,
    );
  });

  it('should share the content', async () => {
    const intentData = {data: 'dummy', mimeType: 'text/plain'};
    render(<MainContent intentData={intentData} />);

    const shareButton = await screen.findByTestId('share-button');
    fireEvent.press(shareButton);

    expect(mockOpen).toHaveBeenCalledWith({url: 'file://dummy'});
  });

  it('should render the error message if mimetype is not supproted', () => {
    const intentData = {data: 'dummy', mimeType: 'unknown'};

    render(<MainContent intentData={intentData} />);

    expect(screen.getByText('Unsupported File Type')).toBeTruthy();
  });

  it('should render the error message if something went wrong', () => {
    const intentData = {data: 'dummy', mimeType: 'unknown'};
    mockFetchContent.mockImplementation(() => {
      throw new Error('Something went wrong');
    });

    render(<MainContent intentData={intentData} />);

    expect(screen.getByText('Unsupported File Type')).toBeTruthy();
  });

  it('should render message for unsupported multiple files', () => {
    const intentData = {data: ['dummy', 'dummy2'], mimeType: 'image/jpeg'};

    render(<MainContent intentData={intentData} />);

    expect(
      screen.getByText(
        "Can't send multiple files. Only one file sharing is supported",
      ),
    ).toBeTruthy();
  });
});
