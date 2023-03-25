import React from 'react';
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  View,
  BackHandler,
  NativeModules,
} from 'react-native';

interface WindbornModalProps {
  content: React.ReactElement;
}

const WindbornModal: React.FC<WindbornModalProps> = ({content}) => {
  return (
    <TouchableOpacity
      activeOpacity={1}
      style={styles.centeredView}
      testID="modal-container"
      onPress={() => NativeModules.ExitModule.exitApp()}>
      <TouchableWithoutFeedback>
        <View style={styles.modalView}>{content}</View>
      </TouchableWithoutFeedback>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default WindbornModal;
