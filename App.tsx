/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';

import ShareMenu, {ShareData} from 'react-native-share-menu';
import Windborn from './src/Windborn';

function App(): JSX.Element {
  const [intentData, setIntentData] = useState<ShareData>();

  useEffect(() => {
    ShareMenu.getInitialShare(data => setIntentData(data));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(intentData)]);

  return <Windborn intentData={intentData} />;
}

export default App;
