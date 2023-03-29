import React, {useRef} from 'react';
import {ShareData} from 'react-native-share-menu';
import {
  View,
  StyleSheet,
  NativeModules,
  AppState,
  ActivityIndicator,
  Dimensions,
  Image,
  ToastAndroid,
  Text,
} from 'react-native';
import {useEffect, useState} from 'react';
import {fetchContent} from './content/content';
import Carousel from 'react-native-reanimated-carousel';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Video from 'react-native-video';
import {Button} from 'react-native-paper';
import Share from 'react-native-share';
import {Content, ContentType} from './content/types';

interface MainModalProps {
  intentData: ShareData;
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const MainContent: React.FC<MainModalProps> = ({intentData}) => {
  const {ClipboardModule} = NativeModules;
  const {data, mimeType} = intentData;

  const [contentUri, setContentUri] = useState<Content[]>();
  const index = useRef(0);
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const appState = useRef(AppState.currentState);

  // //This is required so that if the user shares and comes back to the previous screen
  // //and they want to share once again, the imageBase64 should be reset so that we can
  // //show the new preview with the new intent data and this component should wait and
  // //listen for the changes for the intent data. Listener for intent data is declared in App.tsx
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        setLoading(true);
        setContentUri(undefined);
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    const getContentUri = async () => {
      try {
        if (mimeType.includes('text')) {
          setContentUri(await fetchContent(data as string));
        } else if (mimeType.includes('image')) {
          setContentUri(await fetchContent(data as string));
        } else {
          setError(true);
        }
      } catch (error) {
        setError(true);
      }
    };

    getContentUri();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  if (Array.isArray(data)) {
    return (
      <Text>Can't send multiple files. Only one file sharing is supported</Text>
    );
  }

  if (loading && !contentUri) {
    <ActivityIndicator />;
  }

  if (error) {
    return <Text>Unsupported File Type</Text>;
  }

  return (
    <GestureHandlerRootView>
      {contentUri?.length ? (
        <View style={styles.container}>
          <Carousel
            testID="carousel"
            loop
            width={windowWidth - 40}
            height={windowHeight * 0.5}
            data={contentUri}
            onSnapToItem={prop => (index.current = prop)}
            renderItem={({item}) => {
              return item.type === ContentType.IMAGE ? (
                <Image
                  testID="carousel-image"
                  style={styles.content}
                  source={{
                    uri: `file://${item.uri}`,
                  }}
                />
              ) : (
                <Video
                  testID="carousel-video"
                  resizeMode="cover"
                  repeat
                  style={styles.content}
                  source={{uri: `file://${item.uri}`}}
                />
              );
            }}
          />
          <View style={styles.buttonsContainer}>
            <Button
              mode="contained"
              testID="copy-button"
              onPress={async () => {
                ToastAndroid.show(
                  'Copied to your clipboard!',
                  ToastAndroid.SHORT,
                );
                const {uri, type} = contentUri[index.current];
                const {copyUri, copyText} = ClipboardModule;
                type === ContentType.VIDEO
                  ? copyText(uri)
                  : copyUri(data as string);
              }}>
              Copy to Clipboard
            </Button>
            <Button
              testID="share-button"
              mode="contained"
              icon="share"
              onPress={async () => {
                const {uri} = contentUri[index.current];

                Share.open({
                  url: `file://${uri}`,
                });
              }}>
              Share
            </Button>
          </View>
        </View>
      ) : (
        <ActivityIndicator testID="loading-indicator" />
      )}
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: windowHeight * 0.6,
    justifyContent: 'space-evenly',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  content: {
    height: Dimensions.get('window').height * 0.5,
  },
});

export default MainContent;
