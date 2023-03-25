import React from 'react';
import {Text, StyleSheet, NativeModules, View, PixelRatio} from 'react-native';
import {Button} from 'react-native-paper';
import Video from 'react-native-video';

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
        resizeMode={'contain'}
        style={styles.video}
      />
      <Button onPress={() => NativeModules.ExitModule.exitApp()}>Close</Button>
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
  video: {
    height: '70%',
    width: PixelRatio.getPixelSizeForLayoutSize(300),
  },
});

export default HomeContent;
