import React from 'react';
import {Button, Modal, Text, View} from 'react-native';

function App(): JSX.Element {
  return (
    <Modal animationType="slide" transparent={true} visible={true}>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}>
        <View style={{padding: 20, backgroundColor: 'white'}}>
          <Text style={{fontSize: 16, marginBottom: 10}}>Hello!</Text>
          <Button title="Share" />
          <Button title="Cancel" />
        </View>
      </View>
    </Modal>
  );
}

export default App;
