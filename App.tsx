/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';

import ShareMenu, {ShareData} from 'react-native-share-menu';
import Windborn from './src/Windborn';

function App(): JSX.Element {
  const [intentData, setIntentData] = useState<ShareData>();

  useEffect(() => {
    ShareMenu.getInitialShare(data => setIntentData(data));
  }, []);

  return <Windborn intentData={intentData} />;
}

export default App;
