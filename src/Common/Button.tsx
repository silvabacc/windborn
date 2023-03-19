import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';

interface ButtonProps {
  title: string;
  onPress?: () => void;
}

const Button: React.FC<ButtonProps> = ({title, onPress}) => {
  return (
    <Pressable testID="copy-clipboard-button" onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  text: {
    marginTop: 16,
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: 0.25,
    color: 'black',
  },
});

export default Button;
