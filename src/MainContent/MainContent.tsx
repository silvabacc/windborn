import React, {useRef} from 'react';
import {ShareData} from 'react-native-share-menu';
import {
  View,
  StyleSheet,
  NativeModules,
  AppState,
  ActivityIndicator,
  Text,
  Dimensions,
  SafeAreaView,
  Image,
  ImageBackground,
} from 'react-native';
import {useEffect, useState} from 'react';
import {Content, ContentURI, fetchContent} from './content';
import Carousel from 'react-native-reanimated-carousel';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Video from 'react-native-video';

interface MainModalProps {
  intentData: ShareData;
}

const MainContent: React.FC<MainModalProps> = ({intentData}) => {
  const {ClipboardModule} = NativeModules;
  const {data, mimeType} = intentData;

  const [contentUri, setContentUri] = useState<ContentURI[]>();
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

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
        let contentUri: ContentURI[] = [];
        if (mimeType.includes('text')) {
          contentUri = await fetchContent(data as string);
        }
        if (mimeType.includes('image')) {
          contentUri = [{uri: data as string, type: Content.VIDEO}];
        }
        setContentUri(contentUri);
      } catch (error) {
        setError(true);
      }
    };

    getContentUri();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  //Indicate to the user's that they are fetching the new intent
  if (loading && !contentUri) {
    return <ActivityIndicator />;
  }

  const width = Dimensions.get('window').width - 40;
  const height = Dimensions.get('window').height * 0.5;

  return (
    <ImageBackground source={require('./loading.gif')} resizeMode={'center'}>
      <Carousel
        loop
        width={width}
        height={height}
        data={contentUri ?? []}
        renderItem={({item}) => {
          return item.type === Content.DEFAULT ? (
            <Image style={styles.content} source={{uri: item.uri}} />
          ) : (
            <Video
              resizeMode="cover"
              repeat
              style={styles.content}
              source={{uri: item.uri}}
            />
          );
        }}
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  content: {
    height: Dimensions.get('window').height * 0.5,
    widith: Dimensions.get('window').width * 0.5,
  },
});

export default MainContent;
