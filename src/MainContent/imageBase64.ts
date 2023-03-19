import RNFetchBlob from 'rn-fetch-blob';
import RNFS from 'react-native-fs';

export const fetchImageBase64 = async (data: string): Promise<string> => {
  const response = await fetch(data);
  const html = await response.text();

  const regexForStandardPosts = /<meta property="og:image" content="([^"]+)"/i;
  const regexForSlidePosts = /<img\s+src="([^"]*)"/i;

  const matches =
    html.match(regexForStandardPosts) || html.match(regexForSlidePosts);

  const imageUrl = matches?.[1].replace(/&amp;/g, '&');
  const imageResponse = await RNFetchBlob.fetch('GET', imageUrl as string);
  const imageData = await imageResponse.base64();
  return imageData;
};

export const convertImageToBase64 = async (data: string): Promise<string> => {
  const fileContents = await RNFS.readFile(data as string, 'base64');
  return fileContents;
};
