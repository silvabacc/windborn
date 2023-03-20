import React, {useRef} from 'react';
import {ShareData} from 'react-native-share-menu';
import {
  View,
  Text,
  StyleSheet,
  NativeModules,
  Image,
  ToastAndroid,
  AppState,
} from 'react-native';
import {useEffect, useState} from 'react';
import Button from '../Common/Button';
import {convertImageToBase64, fetchImageBase64} from './imageBase64';
import Share from 'react-native-share';

interface MainModalProps {
  intentData: ShareData;
}

const MainContent: React.FC<MainModalProps> = ({intentData}) => {
  const {ClipboardModule} = NativeModules;
  const {data} = intentData;

  const [imageBase64, setImageBase64] = useState<string>();
  const [error, setError] = useState<boolean>(false);

  const appState = useRef(AppState.currentState);

  //This is required so that if the user shares and comes back to the previous screen
  //and they want to share once again, the imageBase64 should be reset so that we can
  //show the new preview with the new intent data and this component should wait and
  //listen for the changes for the intent data. Listener for intent data is declared in App.tsx
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        setImageBase64(undefined);
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

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
              style={styles.copyButton}
              onPress={() => {
                ToastAndroid.show(
                  'Copied to your clipboard!',
                  ToastAndroid.SHORT,
                );
                ClipboardModule.copyBase64(imageBase64);
              }}
            />
            <Button
              onPress={async () => {
                Share.open({
                  url: `data:image/png;base64,${imageBase64}`,
                });
              }}
              icon="share"
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
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  copyButton: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    paddingLeft: 60,
  },
  image: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
    borderRadius: 10,
  },
});

export default MainContent;
