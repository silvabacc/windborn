import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

interface ButtonProps {
  title?: string;
  icon?: string;
  style?: any;
  onPress?: () => void;
}

const Button: React.FC<ButtonProps> = ({title, icon, style, onPress}) => {
  return (
    <Pressable style={style} testID="copy-clipboard-button" onPress={onPress}>
      {icon && <Icon size={20} name="share-alt" />}
      {title && <Text style={styles.text}>{title}</Text>}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: 0.25,
    color: 'black',
  },
});

export default Button;
