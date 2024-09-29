import React, {useEffect, useRef} from 'react';
import {View, Animated, Easing, StyleSheet} from 'react-native';

const AnimatedEllipsis = () => {
  const opacities = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];

  useEffect(() => {
    const createAnimation = (opacity: Animated.AnimatedValue) =>
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]);

    const animate = () => {
      Animated.loop(
        Animated.stagger(300, opacities.map(createAnimation)),
      ).start();
    };

    animate();
  }, []);

  return (
    <View style={styles.container}>
      {opacities.map((opacity, i) => (
        <Animated.View key={i} style={[styles.dot, {opacity}]} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 5,
    backgroundColor: 'black',
    marginHorizontal: 5,
  },
});

export default AnimatedEllipsis;
