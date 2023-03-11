import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';

interface ButtonProps {
  title: string;
  onPress?: () => void;
}

const Button: React.FC<ButtonProps> = ({title, onPress}) => {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: 0.25,
    color: '#6B2D5C',
  },
});

export default Button;
