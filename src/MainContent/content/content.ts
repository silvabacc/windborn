import axios from 'axios';
import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';
import RNFetchBlob from 'rn-fetch-blob';
import {Content, ContentType, RedditResponse} from './types';

/**
 * This is the name given when using RNFetchBlob requests
 * A session is a group of requests. We want session so that we can dispose
 * of any temporary files when downloading content
 */
const SESSION_NAME = 'videoconversion';

/**
 *
 * @param data Intent data
 * @returns string of URIs of the content
 */
export const fetchContent = async (data: string): Promise<Content[]> => {
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

/**
 * This function downloads and saves the resource found in the URL to a temporary file
 * Everytme we make a new request to a url, the previous files will be disposed
 *
 * @param url A URL to a resource like an image/mp4
 * @param contentType The type of content this is e.g. if resource is jpeg,
 *                    then the content should be Content.Image
 * @returns A URI location to the file
 */

export const convertToUri = async (url: string, contentType: ContentType) => {
  RNFetchBlob.session(SESSION_NAME).dispose();

  const fileExtension =
    contentType === ContentType.VIDEO ? 'mp4' : url.split('.').pop();
  const randomFileName = `${uuidv4()}`;
  const dirs = RNFetchBlob.fs.dirs;

  const response = await RNFetchBlob.config({
    session: SESSION_NAME,
    path: `${dirs.DocumentDir}/${randomFileName}.${fileExtension}`,
    fileCache: true,
  }).fetch('GET', url);

  return response.path();
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
 * @returns an array of Content that is assicoated with ID
 *          this involves both images/videos and can include text posts as well
 */
const redditCommentContent = async (id: string): Promise<Content[]> => {
  const redditCommentJson = `https://www.reddit.com/${id}.json`;
  const response = await axios.get<RedditResponse[]>(redditCommentJson);

  const contentData = response.data[0].data.children[0].data;
  const {is_video, is_gallery} = contentData;

  if (is_video) {
    return [
      {
        uri: await convertToUri(
          contentData.media.reddit_video.fallback_url,
          ContentType.VIDEO,
        ),
        type: ContentType.VIDEO,
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
          uri: await convertToUri(url, ContentType.IMAGE),
          type: ContentType.IMAGE,
        };
      },
    );
    return Promise.all(imagesUri);
  }

  return [
    {
      uri: await convertToUri(contentData.url, ContentType.IMAGE),
      type: ContentType.IMAGE,
    },
  ];
};