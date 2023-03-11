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
import Button from './Button';
import RNFetchBlob from 'rn-fetch-blob';

interface MainModalProps {
  intentData: ShareData;
}

const MainModal: React.FC<MainModalProps> = ({intentData}) => {
  const {ExitModule, ClipboardModule} = NativeModules;
  const {data} = intentData;

  console.log(data);

  const [imageBase64, setImageBase64] = useState<string>();

  useEffect(() => {
    const fetchImageBase64 = async () => {
      const response = await fetch(data as string);
      const html = await response.text();

      const regex = /<meta property="og:image" content="([^"]+)"/i;
      const matches = html.match(regex);

      const url = matches?.[1].replace(/&amp;/g, '&');
      const imageResponse = await RNFetchBlob.fetch('GET', url as string);
      const imageData = await imageResponse.base64();
      setImageBase64(imageData);
    };

    fetchImageBase64();
  }, [data]);

  const saveImageToClipboard = async () => {
    ClipboardModule.copyBase64(imageBase64);
  };

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
            {imageBase64 ? (
              <>
                <Image
                  source={{uri: `data:image/png;base64,${imageBase64}`}}
                  style={{width: '100%', height: undefined, aspectRatio: 1}}
                />
                <View style={styles.buttonContainer}>
                  <Button
                    title="Copy"
                    onPress={async () => await saveImageToClipboard()}
                  />
                  <Button title="Cancel" onPress={() => ExitModule.exitApp()} />
                </View>
              </>
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
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    marginTop: 16,
    justifyContent: 'space-evenly',
  },
  button: {
    width: '50%',
  },
});

export default MainModal;
