import axios from 'axios';
import {mockConfig, mockFetch} from '../../../testHelpers/rn-fetch-blob-mock';
import getConfig from '../../config';
import {convertToBase64, convertToUri, redditCommentContent} from './content';

jest.mock('rn-fetch-blob');
jest.mock('axios');
jest.mock('nanoid', () => ({
  nanoid: () => 'randomnanoid',
}));

const {RAPID_SAVE_URL} = getConfig();

const singleImageResponse = {
  data: [
    {
      data: {
        children: [
          {
            data: {
              post_hint: 'image',
              url: 'www.dummmy.com/image.png',
            },
          },
        ],
      },
    },
  ],
};

const videoResponse = {
  data: [
    {
      data: {
        children: [
          {
            data: {
              is_video: true,
              post_hint: 'hosted:video',
              url: 'www.reddit.com/123456',
              media: {
                reddit_video: {
                  fallback_url: 'www.fallbackurl.com/video.mp4?source=fallback',
                },
              },
            },
          },
        ],
      },
    },
  ],
};

const galleryResponse = {
  data: [
    {
      data: {
        children: [
          {
            data: {
              is_gallery: true,
              media_metadata: {
                slfz80hz7ipa1: {m: 'image/gif'},
                y1o4u5az7ipa1: {m: 'image/jpg'},
              },
            },
          },
        ],
      },
    },
  ],
};

const errorResponse = {
  data: [
    {
      data: {
        children: [
          {
            data: {},
          },
        ],
      },
    },
  ],
};

const crosspostResponse = {
  data: [
    {
      data: {
        children: [
          {
            data: {
              post_hint: 'link',
              url: 'www.dummmy.com/crosspost',
              is_video: false,
              crosspost_parent_list: [
                {
                  post_hint: 'image',
                  url: 'www.dummy.com/parentpost',
                  is_video: false,
                },
              ],
            },
          },
        ],
      },
    },
  ],
};

const mockAxios = axios as jest.Mocked<any>;
const mockAxiosGet = jest.fn();
mockAxios.get = mockAxiosGet;

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

    it('should convert gifv to gif', async () => {
      const url = 'https://dummy.com/funnycat.gifv';

      await convertToUri(url);

      expect(mockConfig).toHaveBeenCalledWith({
        fileCache: true,
        path: 'undefined/randomnanoid.gif',
        session: 'videoconversion',
      });
      expect(mockFetch).toHaveBeenCalledWith(
        'GET',
        'https://dummy.com/funnycat.gif',
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

  describe('redditCommentContent', () => {
    it('should make the correct call for single images', async () => {
      mockAxiosGet.mockResolvedValue(singleImageResponse);

      await redditCommentContent('dummyId', 'redditUrl');

      expect(mockAxiosGet).toHaveBeenCalledWith(
        'https://www.reddit.com/dummyId.json',
      );
      expect(mockFetch).toHaveBeenCalledWith('GET', 'www.dummmy.com/image.png');
    });

    it('should make the correct call for videos', async () => {
      mockAxiosGet.mockResolvedValue(videoResponse);
      await redditCommentContent('dummyId', 'redditUrl');

      expect(mockAxiosGet).toHaveBeenCalledWith(
        'https://www.reddit.com/dummyId.json',
      );
      expect(mockFetch).toHaveBeenCalledWith(
        'GET',
        `${RAPID_SAVE_URL}?permalink=redditUrl&video_url=www.fallbackurl.com/video.mp4?source=fallback&audio_url=www.reddit.com/123456/DASH_audio.mp4`,
      );
    });

    it('should make the correct call for galleries', async () => {
      mockAxiosGet.mockResolvedValue(galleryResponse);
      await redditCommentContent('dummyId', 'redditUrl');

      expect(mockAxiosGet).toHaveBeenCalledWith(
        'https://www.reddit.com/dummyId.json',
      );
      expect(mockFetch).toHaveBeenNthCalledWith(
        6,
        'GET',
        'https://i.redd.it/slfz80hz7ipa1.gif',
      );
      expect(mockFetch).toHaveBeenNthCalledWith(
        7,
        'GET',
        'https://i.redd.it/y1o4u5az7ipa1.jpg',
      );
    });

    it('should reference parent link for crossposts', async () => {
      mockAxiosGet.mockResolvedValue(crosspostResponse);
      await redditCommentContent('dummyId', 'redditUrl');

      expect(mockAxiosGet).toHaveBeenCalledWith(
        'https://www.reddit.com/dummyId.json',
      );
      expect(mockFetch).toHaveBeenCalledWith('GET', 'www.dummy.com/parentpost');
    });

    it('should throw an error', async () => {
      mockAxiosGet.mockReturnValue(errorResponse);

      await expect(
        redditCommentContent('dummyId', 'redditUrl'),
      ).rejects.toThrow('Content not found');
    });
  });
});
