import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {ToggleButton} from 'react-native-paper';

const ConversionTabs: React.FC = () => {
  const [videoOrGif, setVideoOrGif] = useState('video');

  const onPressToggle = (value: string) => setVideoOrGif(value);

  return (
    <View style={styles.container}>
      <ToggleButton.Row onValueChange={onPressToggle} value={videoOrGif}>
        <ToggleButton value="video" icon="video" />
        <ToggleButton value="gif" icon="file-gif-box" />
      </ToggleButton.Row>
    </View>
  );
};

export default ConversionTabs;

const styles = StyleSheet.create({
  container: {
    marginLeft: 'auto',
    marginRight: 1,
    marginBottom: 4,
  },
});
