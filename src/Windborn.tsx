import React from 'react';
import {ShareData} from 'react-native-share-menu';
import {PixelRatio, StyleSheet, View} from 'react-native';
import HomeContent from './HomeContent';
import MainContent from './MainContent/MainContent';
import WindbornModal from './WindbornModal';

interface WindbornProps {
  intentData?: ShareData;
}

const Windborn: React.FC<WindbornProps> = ({intentData}) => {
  const isIntentDataNull = !intentData;

  return (
    <View style={styles.appContainer}>
      {!isIntentDataNull ? (
        <WindbornModal content={<MainContent intentData={intentData} />} />
      ) : (
        <WindbornModal content={<HomeContent />} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  appContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    flex: 1,
  },
});

export default Windborn;
