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

  useEffect(() => {
    const fetchImageBase64 = async () => {
      const response = await fetch(data as string);
      const html = await response.text();

      const regex = /<meta property="og:image" content="([^"]+)"/i;
      const matches = html.match(regex);

      const imageUrl = matches?.[1].replace(/&amp;/g, '&');
      const imageResponse = await RNFetchBlob.fetch('GET', imageUrl as string);
      const imageData = await imageResponse.base64();
      setImageBase64(imageData);
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
      ) : (
        <Text>Preparing preview...</Text>
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
