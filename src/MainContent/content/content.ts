import axios from 'axios';
import 'react-native-get-random-values';
import RNFetchBlob from 'rn-fetch-blob';
import RNFS from 'react-native-fs';
import {nanoid} from 'nanoid';
import {Content, ContentType, RedditResponse} from './types';
import getConfig from '../../config';

const {RAPID_SAVE_URL} = getConfig();

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
export const fetchContent = async (
  data: string,
  onProgress?: Function,
): Promise<Content[]> => {
  const redditIdRegex = /\/comments\/(\w+)\//;

  const redditId = data.match(redditIdRegex);
  if (redditId) {
    //Handle Reddit
    return await redditCommentContent(redditId[1], data, onProgress);
  }

  throw new Error('Content not found');
};

/**
 * We store images/videos into a folder called 'files'. The contents should be
 * recursively deleted often
 */
const unlinkFilesFolder = async () => {
  RNFS.unlink(`${RNFS.DocumentDirectoryPath}`);
};

/**
 * This function downloads and saves the Reddit videos to a temporary file
 * Everytme we make a new request to a url, the previous files will be disposed
 * This uses an external API to fetch reddit videos specifically as Reddit hosted videos
 * have no audio and also causes difficulties when sharing to other applications
 *
 * @param videoUrl URL to a reddit video
 * @param audioUrl URL to the reddit audio counterpart of video
 * @param permalink URL to the reddit post. Prefably has to be a comments link
 * @returns A URI location to the file
 */
const fetchRedditVideoURL = async (
  videoUrl: string,
  audioUrl: string,
  permalink: string,
  onProgress?: Function,
) => {
  unlinkFilesFolder();

  const fileExtension = 'mp4';
  const dirs = RNFetchBlob.fs.dirs;

  const redditVideoResponse = await RNFetchBlob.config({
    session: SESSION_NAME,
    path: `${dirs.DocumentDir}/${nanoid()}.${fileExtension}`,
    fileCache: true,
  })
    .fetch(
      'GET',
      `${RAPID_SAVE_URL}?permalink=${permalink}&video_url=${videoUrl}&audio_url=${audioUrl}`,
    )
    .progress({interval: 10}, (received, total) => {
      onProgress && onProgress(received / total);
    });

  return redditVideoResponse.path();
};

/**
 * This function downloads and saves the resource found in the URL to a temporary file
 * Everytme we make a new request to a url, the previous files will be disposed
 * This function will also replace gifv with gif. Ensure the URL has gif counterpart
 *
 * @param url A URL to a resource like an image/mp4
 * @param contentType The type of content this is e.g. if resource is jpeg,
 *                    then the content should be Content.Image
 * @returns A URI location to the file
 */

export const convertToUri = async (url: string, onProgress?: Function) => {
  unlinkFilesFolder();

  const urlWithoutGifv = url.endsWith('gifv')
    ? url.replace('.gifv', '.gif')
    : url;

  const fileExtension = urlWithoutGifv.split('.').pop();
  const dirs = RNFetchBlob.fs.dirs;

  const response = await RNFetchBlob.config({
    session: SESSION_NAME,
    path: `${dirs.DocumentDir}/${nanoid()}.${fileExtension}`,
    fileCache: true,
  })
    .fetch('GET', urlWithoutGifv)
    .progress({interval: 250}, (received, total) => {
      onProgress && onProgress(received / total);
    });

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
export const redditCommentContent = async (
  id: string,
  permalink: string,
  onProgress?: Function,
): Promise<Content[]> => {
  const redditCommentJson = `https://www.reddit.com/${id}.json`;
  const response = await axios.get<RedditResponse[]>(redditCommentJson);

  const contentData = response.data[0].data.children[0].data;
  const {is_video, is_gallery, post_hint} = contentData;

  if (!post_hint && !is_gallery) {
    throw new Error('Content not found');
  }

  if (is_video) {
    return [
      {
        uri: await fetchRedditVideoURL(
          contentData.media.reddit_video.fallback_url,
          `${contentData.url}/DASH_audio.mp4`,
          permalink,
          onProgress,
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
          uri: await convertToUri(url, onProgress),
          type: ContentType.IMAGE,
        };
      },
    );
    return Promise.all(imagesUri);
  }

  return [
    {
      uri: await convertToUri(contentData.url, onProgress),
      type: ContentType.IMAGE,
    },
  ];
};
