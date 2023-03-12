import React from 'react';
import {Text, StyleSheet, Image} from 'react-native';

const HomeContent: React.FC = () => {
  return (
    <>
      <Text style={[styles.modalText, styles.modalHeader]}>Windborn</Text>
      <Text style={styles.modalText}>
        You can copy images/videos to your clipboard via the share button on
        Reddit and selecting Windborn
      </Text>
      <Image style={styles.image} source={require('./guide.png')} />
    </>
  );
};

const styles = StyleSheet.create({
  modalHeader: {
    fontWeight: 'bold',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: 'black',
  },
  image: {
    width: '100%',
    height: undefined,
    aspectRatio: 1.12,
    borderRadius: 10,
  },
});

export default HomeContent;
