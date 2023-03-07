import React from 'react';
import {ShareData} from 'react-native-share-menu';
import {View} from 'react-native';
import LoadingModal from './LoadingModal';
import MainModal from './MainModal';

interface WindbornProps {
  intentData?: ShareData;
}

const Windborn: React.FC<WindbornProps> = ({intentData}) => {
  //in the future, prepare the data for image, video or gif?
  const isIntentDataNull = !intentData;

  return (
    <View style={{backgroundColor: 'rgba(0, 0, 0, 0)', flex: 1}}>
      {!isIntentDataNull ? (
        <MainModal intentData={intentData} />
      ) : (
        <LoadingModal />
      )}
    </View>
  );
};

export default Windborn;
