import axios, {HttpStatusCode} from 'axios';
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

export const fetchImageShare = async (uri: string): Promise<Content[]> => {
  await unlinkFilesFolder();

  const uriComponents = uri.split('/');
  const fileNameAndExtension = uriComponents[uriComponents.length - 1];
  const destPath = `${RNFS.DocumentDirectoryPath}/${fileNameAndExtension}`;
  await RNFS.copyFile(uri, destPath);
  return [{uri: destPath, type: ContentType.IMAGE}];
};

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
  try {
    if (await RNFS.exists(RNFS.DocumentDirectoryPath)) {
      await RNFS.unlink(RNFS.DocumentDirectoryPath);
    }
    await RNFS.mkdir(RNFS.DocumentDirectoryPath);
  } catch (error) {}
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
export const fetchRedditVideoURI = async (
  videoParameter: string,
  audioParameter: string | false,
  permalink: string,
  onProgress?: Function,
) => {
  await unlinkFilesFolder();

  const fileExtension = 'mp4';
  const dirs = RNFetchBlob.fs.dirs;

  const redditVideoResponse = await RNFetchBlob.config({
    session: SESSION_NAME,
    path: `${dirs.DocumentDir}/${nanoid()}.${fileExtension}`,
    fileCache: true,
  })
    .fetch(
      'GET',
      `${RAPID_SAVE_URL}?permalink=${permalink}&video_url=${videoParameter}&audio_url=${audioParameter}`,
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
  await unlinkFilesFolder();

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

  //Supports Crossposts
  const listingData = response.data[0].data.children[0].data;
  const contentData =
    listingData.post_hint === 'link'
      ? response.data[0].data.children[0].data.crosspost_parent_list![0]
      : response.data[0].data.children[0].data;

  const {is_video, is_gallery, post_hint} = contentData;

  if (!post_hint && !is_gallery) {
    throw new Error('Content not found');
  }

  if (is_video) {
    //We check if audio exists by taking the content url and simply adding DASH_audio.mp4
    //Reddit hosts audio in this way.
    let audioParameter: string | boolean = false;
    const audioUrl = `${contentData.url}/DASH_audio.mp4`;
    try {
      audioParameter =
        (await axios.get(audioUrl)).status !== HttpStatusCode.Forbidden
          ? audioUrl
          : false;
    } catch (error) {}

    return [
      {
        uri: await fetchRedditVideoURI(
          contentData.media.reddit_video.fallback_url,
          audioParameter,
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
