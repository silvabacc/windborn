import axios from 'axios';
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
      {uri: contentData.media.reddit_video.fallback_url, type: Content.VIDEO},
    ];
  }

  if (is_gallery) {
    const imagesUri = Object.keys(contentData.media_metadata).map(media => {
      const format =
        contentData.media_metadata[media].m.match(/^image\/(.+)$/)[1];
      return {
        uri: `https://i.redd.it/${media}.${format}`,
        type: Content.DEFAULT,
      };
    });
    return imagesUri;
  }

  return [{uri: contentData.url, type: Content.DEFAULT}];
};
