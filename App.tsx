import React, {useEffect, useState} from 'react';

import ShareMenu, {ShareData} from 'react-native-share-menu';
import {StatusBar} from 'react-native';
import Windborn from './src/Windborn';

function App(): JSX.Element {
  const [intentData, setIntentData] = useState<ShareData>();

  //Listens for any changes to the intent data (any apps shared to Windborn)
  //Required since application is not closed during sharing images and state are not reset
  useEffect(() => {
    const listener = ShareMenu.addNewShareListener(data => {
      if (data?.data) {
        setIntentData(data);
      }
    });

    return () => {
      listener.remove();
    };
  }, []);

  useEffect(() => {
    ShareMenu.getInitialShare(data => setIntentData(data));
    StatusBar.setBackgroundColor('transparent');
  }, []);

  return <Windborn intentData={intentData} />;
}

export default App;
