import React from 'react';
import {Text, StyleSheet, NativeModules, View, PixelRatio} from 'react-native';
import {Button} from 'react-native-paper';
import {RFPercentage} from 'react-native-responsive-fontsize';
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
      <View style={styles.button}>
        <Button
          mode="contained"
          onPress={() => NativeModules.ExitModule.exitApp()}>
          Close
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  modalHeader: {
    fontWeight: 'bold',
    fontSize: RFPercentage(3),
  },
  modalText: {
    textAlign: 'center',
    color: 'black',
    margin: 16,
    fontSize: RFPercentage(2),
  },
  video: {
    flex: 2,
    width: PixelRatio.getPixelSizeForLayoutSize(300),
  },
  button: {
    padding: 16,
  },
});

export default HomeContent;
