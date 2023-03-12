import React from 'react';
import {ShareData} from 'react-native-share-menu';
import {StyleSheet, View} from 'react-native';
import HomeContent from './HomeContent';
import MainModal from './MainContent';
import WindbornModal from './WindbornModal';

interface WindbornProps {
  intentData?: ShareData;
}

const Windborn: React.FC<WindbornProps> = ({intentData}) => {
  //in the future, prepare the data for image, video or gif?
  const isIntentDataNull = !intentData;

  return (
    <View style={styles.appContainer}>
      {!isIntentDataNull ? (
        <WindbornModal content={<MainModal intentData={intentData} />} />
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
