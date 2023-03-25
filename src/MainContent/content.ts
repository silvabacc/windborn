import axios from 'axios';
import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';
import RNFetchBlob from 'rn-fetch-blob';

interface Children {
  data: {
    url: string;
    media_metadata?: any;
    is_gallery?: boolean;
    is_video: boolean;
    media: {
      reddit_video: {
        fallback_url: string;
      };
    };
  };
}

interface RedditResponse {
  data: {
    children: Children[];
  };
}

export enum Content {
  DEFAULT = 'default',
  VIDEO = 'video',
}

export interface ContentURI {
  uri: string;
  type: Content;
}

const SESSION_NAME = 'videoconversion';

/**
 *
 * @param data Intent data
 * @returns string of URIs of the content
 */
export const fetchContent = async (data: string): Promise<ContentURI[]> => {
  const redditIdRegex = /\/comments\/(\w+)\//;
  const twitterIdRegex = /\/status\/(\d+)/;

  const redditId = data.match(redditIdRegex);
  if (redditId) {
    //Handle Reddit
    return await redditCommentContent(redditId[0]);
  }

  const twitterId = data.match(twitterIdRegex);
  if (twitterId) {
    //Handle Twitter
  }

  return [];
};

export const convertToURL = async (content: ContentURI) => {
  RNFetchBlob.session(SESSION_NAME).dispose();

  const fileExtension = content.uri.split('.').pop();
  const randomFileName = `${uuidv4()}`;

  const dirs = RNFetchBlob.fs.dirs;

  switch (content.type) {
    case Content.DEFAULT:
      const imageResponse = await RNFetchBlob.config({
        session: SESSION_NAME,
        fileCache: true,
        path: `${dirs.DocumentDir}/${randomFileName}.${fileExtension}`,
      }).fetch('GET', content.uri);
      return `${imageResponse.path()}`;
    case Content.VIDEO:
      const videoResponse = await RNFetchBlob.config({
        session: SESSION_NAME,
        path: `${dirs.DocumentDir}/${randomFileName}.mp4`,
        fileCache: true,
      }).fetch('GET', content.uri);
      return `${videoResponse.path()}`;
  }
};

/**
 *
 * @param url Image URL must be locating to a resource of an image
 *            that can be converted into a blob
 * @returns a base64 string representation of given URL
 */
export const convertToBase64 = async (url: string): Promise<string> => {
  const imageResponse = await RNFetchBlob.fetch('GET', url);
  const imageData = await imageResponse.base64();
  return imageData;
};

/**
 *
 * @param id Reddit ID post
 * @returns a string of the URIs of the content that is assicoated with ID
 *          this involves both images/videos and can include text posts as we;;
 */
const redditCommentContent = async (id: string): Promise<ContentURI[]> => {
  const redditCommentJson = `https://www.reddit.com/${id}.json`;
  const response = await axios.get<RedditResponse[]>(redditCommentJson);

  const contentData = response.data[0].data.children[0].data;
  const {is_video, is_gallery} = contentData;

  if (is_video) {
    return [
      {
        uri: await convertToURL({
          uri: contentData.media.reddit_video.fallback_url,
          type: Content.VIDEO,
        }),
        type: Content.VIDEO,
      },
    ];
  }

  if (is_gallery) {
    const imagesUri = Object.keys(contentData.media_metadata).map(
      async media => {
        const format =
          contentData.media_metadata[media].m.match(/^image\/(.+)$/)[1];
        const url = `https://i.redd.it/${media}.${format}`;
        return {
          uri: await convertToURL({
            uri: url,
            type: Content.DEFAULT,
          }),
          type: Content.DEFAULT,
        };
      },
    );
    return Promise.all(imagesUri);
  }

  return [{uri: contentData.url, type: Content.DEFAULT}];
};
