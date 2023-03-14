/* eslint-disable react/react-in-jsx-scope */
import {ShareData} from 'react-native-share-menu';
import {View, Text, StyleSheet, NativeModules, Image} from 'react-native';
import {useEffect, useState} from 'react';
import Button from './Button';
import RNFetchBlob from 'rn-fetch-blob';

interface MainModalProps {
  intentData: ShareData;
}

const MainModal: React.FC<MainModalProps> = ({intentData}) => {
  const {ClipboardModule} = NativeModules;
  const {data} = intentData;

  const [imageBase64, setImageBase64] = useState<string>();
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const fetchImageBase64 = async () => {
      try {
        const response = await fetch(data as string);
        const html = await response.text();

        const regexForStandardPosts =
          /<meta property="og:image" content="([^"]+)"/i;
        const regexForSlidePosts = /<img\s+src="([^"]*)"/i;

        const matches =
          html.match(regexForStandardPosts) || html.match(regexForSlidePosts);

        const imageUrl = matches?.[1].replace(/&amp;/g, '&');
        const imageResponse = await RNFetchBlob.fetch(
          'GET',
          imageUrl as string,
        );
        const imageData = await imageResponse.base64();
        setImageBase64(imageData);
      } catch (error) {
        setError(true);
      }
    };

    fetchImageBase64();
  }, [data]);

  return (
    <>
      {imageBase64 ? (
        <>
          <Image
            source={{uri: `data:image/png;base64,${imageBase64}`}}
            style={styles.image}
          />
          <View style={styles.buttonContainer}>
            <Button
              title="Copy to Clipboard"
              onPress={async () => {
                ClipboardModule.copyBase64(imageBase64);
              }}
            />
          </View>
        </>
      ) : !error ? (
        <Text>Preparing preview...</Text>
      ) : (
        <Text>Oops, this post doesn't seem to have any images</Text>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    marginTop: 16,
    justifyContent: 'space-evenly',
  },
  button: {
    width: '50%',
  },
  image: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
    borderRadius: 10,
  },
});

export default MainModal;
