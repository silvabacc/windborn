import React from 'react';
import {Text, StyleSheet, NativeModules, View} from 'react-native';
import Video from 'react-native-video';
import Button from './Common/Button';

const HomeContent: React.FC = () => {
  return (
    <View style={styles.modalContainer}>
      <Text style={[styles.modalText, styles.modalHeader]}>Windborn</Text>
      <Text style={styles.modalText}>
        You can copy images/videos to your clipboard via the share button on
        Reddit and selecting Windborn
      </Text>
      <Video
        source={{uri: 'https://i.imgur.com/bS7Iw3v.mp4'}}
        paused={false}
        repeat={true}
        resizeMode={'stretch'}
        style={styles.video}
      />
      <Button
        title="Close"
        onPress={() => NativeModules.ExitModule.exitApp()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  modalHeader: {
    fontWeight: 'bold',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: 'black',
  },
  image: {
    width: '100%',
    height: undefined,
    aspectRatio: 1.12,
    borderRadius: 10,
  },
  video: {
    height: '70%',
    aspectRatio: 0.6,
  },
});

export default HomeContent;
