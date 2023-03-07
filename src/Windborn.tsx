import React from 'react';
import {ShareData} from 'react-native-share-menu';
import {View} from 'react-native';
import LoadingModal from './LoadingModal';
import MainModal from './MainModal';

interface WindbornProps {
  intentData?: ShareData;
}

const Windborn: React.FC<WindbornProps> = ({intentData}) => {
  const isIntentDataNull = !intentData;

  console.log(intentData);

  return (
    <View style={{backgroundColor: 'rgba(0, 0, 0, 0)', flex: 1}}>
      {!isIntentDataNull ? (
        <MainModal intentData={intentData!} />
      ) : (
        <LoadingModal />
      )}
    </View>
  );
};

export default Windborn;
