import {mockConfig, mockFetch} from '../../../testHelpers/rn-fetch-blob-mock';
import {convertToBase64, convertToUri} from './content';
import {ContentType} from './types';

jest.mock('rn-fetch-blob');
jest.mock('axios');
jest.mock('nanoid', () => ({
  nanoid: () => 'randomnanoid',
}));

describe('Content', () => {
  describe('convertToUri', () => {
    it('should call with the correct request for images', async () => {
      const url = 'https://dummy.com/image.png';

      await convertToUri(url);

      expect(mockConfig).toHaveBeenCalledWith({
        fileCache: true,
        path: 'undefined/randomnanoid.png',
        session: 'videoconversion',
      });
      expect(mockFetch).toHaveBeenCalledWith(
        'GET',
        'https://dummy.com/image.png',
      );
    });
  });

  describe('convertToBase64', () => {
    it('should make the correct request', async () => {
      mockFetch.mockImplementationOnce(() => ({base64: () => 'base64'}));
      const url = 'www.dummy.com/image.png';

      const response = await convertToBase64(url);
      expect(mockFetch).toHaveBeenCalledWith('GET', 'www.dummy.com/image.png');
      expect(response).toBe('base64');
    });
  });
});
