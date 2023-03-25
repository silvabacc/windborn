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
} from 'react-native';
import {useEffect, useState} from 'react';
import {
  ContentType,
  Content,
  convertToUri,
  fetchContent,
} from './content/content';
import Carousel from 'react-native-reanimated-carousel';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Video from 'react-native-video';
import {Button} from 'react-native-paper';
import Share from 'react-native-share';

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

  return (
    <GestureHandlerRootView>
      {contentUri ? (
        <View style={styles.container}>
          <Carousel
            loop
            width={windowWidth - 40}
            height={windowHeight * 0.5}
            data={contentUri}
            onSnapToItem={prop => (index.current = prop)}
            renderItem={({item}) => {
              console.log(item.uri);
              return item.type === ContentType.IMAGE ? (
                <Image
                  style={styles.content}
                  source={{
                    uri: `file://${item.uri}`,
                  }}
                />
              ) : (
                <Video
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
              onPress={async () => {
                ToastAndroid.show(
                  'Copied to your clipboard!',
                  ToastAndroid.SHORT,
                );
                console.log(contentUri[index.current].uri);
                ClipboardModule.copyUri(contentUri[index.current].uri);
              }}>
              Copy to Clipboard
            </Button>
            <Button
              mode="contained"
              icon="share"
              onPress={async () => {
                const url = await convertToUri(contentUri[index.current]);
                Share.open({
                  url,
                  type: 'video/mp4',
                });
              }}>
              Share
            </Button>
          </View>
        </View>
      ) : (
        <ActivityIndicator />
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
