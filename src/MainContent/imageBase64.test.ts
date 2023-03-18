import {mockReadFile} from '../../testHelpers/react-native-fs-mock';
import {mockFetch} from '../../testHelpers/rn-fetch-blob-mock';
import {convertImageToBase64, fetchImageBase64} from './imageBase64';

jest.mock('node-fetch');

const mockText = jest.fn();

global.fetch = jest.fn().mockResolvedValue({
  text: mockText,
});

mockFetch.mockResolvedValue({base64: () => ''});

describe('imageBase64', () => {
  describe('convertImageToBase64', () => {
    it('should convert correctly', async () => {
      await convertImageToBase64('dummy');
      expect(mockReadFile).toHaveBeenCalled();
    });
  });

  describe('fetchImageBase64', () => {
    it('should extract image URL for posts with singular image', async () => {
      mockText.mockResolvedValueOnce(
        '<meta property="og:image" content="https://preview.redd.it/6a5jcbapefoa1.jpg?auto=webp&amp;v=enabled&amp;s=4b"',
      );

      await fetchImageBase64('');

      expect(mockFetch).toHaveBeenCalled();
      expect(mockFetch).toHaveBeenCalledWith(
        'GET',
        'https://preview.redd.it/6a5jcbapefoa1.jpg?auto=webp&v=enabled&s=4b',
      );
    });

    it('should extract image URL for posts from multiple images correctly', async () => {
      mockText.mockResolvedValueOnce(
        '<img src="https://preview.redd.it/fvrralru04na1.jpg?width=640&amp;crop=smart&amp;auto=webp&amp;v=enabled&amp;s=6""',
      );

      await fetchImageBase64('');

      expect(mockFetch).toHaveBeenCalled();
      expect(mockFetch).toHaveBeenCalledWith(
        'GET',
        'https://preview.redd.it/fvrralru04na1.jpg?width=640&crop=smart&auto=webp&v=enabled&s=6',
      );
    });
  });
});
