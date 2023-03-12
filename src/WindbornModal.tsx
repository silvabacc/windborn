/* eslint-disable react/react-in-jsx-scope */
import {
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  NativeModules,
  View,
} from 'react-native';

interface WindbornModalProps {
  content: React.ReactElement;
}

const WindbornModal: React.FC<WindbornModalProps> = ({content}) => {
  return (
    <Modal animationType="fade" transparent={true}>
      <TouchableOpacity
        activeOpacity={1}
        style={styles.centeredView}
        onPressOut={() => {
          NativeModules.ExitModule.exitApp();
        }}>
        <TouchableWithoutFeedback>
          <View style={styles.modalView}>{content}</View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
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
