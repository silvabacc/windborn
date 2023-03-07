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
  Image,
} from 'react-native';
import {useEffect, useState} from 'react';

interface MainModalProps {
  intentData: ShareData;
}

const MainModal: React.FC<MainModalProps> = ({intentData}) => {
  const {ExitModule} = NativeModules;
  const {data} = intentData;

  const [imageUrl, setImageUrl] = useState<string>();

  useEffect(() => {
    const fetchImageUrl = async () => {
      const response = await fetch(data as string);
      const html = await response.text();

      const regex = /<meta property="og:image" content="([^"]+)"/i;
      const matches = html.match(regex);

      const url = matches?.[1];
      setImageUrl(url?.replace(/&amp;/g, '&'));
    };

    fetchImageUrl();
  }, [data]);

  return (
    <Modal animationType="fade" transparent={true}>
      <TouchableOpacity
        activeOpacity={1}
        style={styles.centeredView}
        onPressOut={() => {
          ExitModule.exitApp();
        }}>
        <TouchableWithoutFeedback>
          <View style={styles.modalView}>
            {imageUrl ? (
              <Image
                source={{uri: imageUrl}}
                style={{width: '100%', height: undefined, aspectRatio: 1}}
              />
            ) : (
              <Text>Preparing preview...</Text>
            )}
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
    padding: 15,
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
