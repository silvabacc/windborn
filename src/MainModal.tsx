/* eslint-disable react/react-in-jsx-scope */
import {ShareData} from 'react-native-share-menu';
import {
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Text,
  StyleSheet,
  NativeModules,
} from 'react-native';

interface MainModalProps {
  intentData: ShareData;
}

const MainModal: React.FC<MainModalProps> = ({intentData}) => {
  const {ExitModule} = NativeModules;
  return (
    <Modal animationType="fade" transparent={true}>
      <TouchableOpacity
        activeOpacity={1}
        style={styles.centeredView}
        onPressOut={() => {
          ExitModule.exitApp();
          //https://reactnative.dev/docs/native-modules-android
        }}>
        <TouchableWithoutFeedback>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Hello World!</Text>
          </View>
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
    padding: 35,
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
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default MainModal;
