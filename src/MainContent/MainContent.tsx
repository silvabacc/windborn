import React from 'react';
import {ShareData} from 'react-native-share-menu';
import {
  View,
  Text,
  StyleSheet,
  NativeModules,
  Image,
  ToastAndroid,
} from 'react-native';
import {useEffect, useState} from 'react';
import Button from '../Common/Button';
import {convertImageToBase64, fetchImageBase64} from './imageBase64';

interface MainModalProps {
  intentData: ShareData;
}

const MainContent: React.FC<MainModalProps> = ({intentData}) => {
  const {ClipboardModule} = NativeModules;
  const {data} = intentData;

  const [imageBase64, setImageBase64] = useState<string>();
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const getImageBase64 = async () => {
      try {
        const image = intentData.mimeType.includes('image')
          ? await convertImageToBase64(data as string)
          : await fetchImageBase64(data as string);
        setImageBase64(image);
      } catch (error) {
        setError(true);
      }
    };

    getImageBase64();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <View testID="main-content-view">
      {imageBase64 ? (
        <View testID="clipboard-menu">
          <Image
            source={{uri: `data:image/png;base64,${imageBase64}`}}
            style={styles.image}
          />
          <View style={styles.buttonContainer}>
            <Button
              title="Copy to Clipboard"
              onPress={() => {
                ToastAndroid.show(
                  'Copied to your clipboard!',
                  ToastAndroid.SHORT,
                );
                ClipboardModule.copyBase64(imageBase64);
              }}
            />
          </View>
        </View>
      ) : !error ? (
        <Text>Preparing preview...</Text>
      ) : (
        <Text>Oops, this post doesn't seem to have any images</Text>
      )}
    </View>
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

export default MainContent;
