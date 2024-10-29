import Animated, {
  useSharedValue,
  withSpring,
  withTiming,
  withDecay,
  useAnimatedStyle,
  Easing,
  
} from 'react-native-reanimated';
import { View, Button, StyleSheet,Text } from 'react-native';

export default function AnimatedStyleUpdateExample() {
  const randomWidth = useSharedValue(50);

  const config = {
    duration: 300,
    easing: Easing.bezier(0.5, 0.01, 0, 1),
  };
  const config_2 = {
    mass: 1,
    stiffness: 200,
    damping: 7,

  };

  const style = useAnimatedStyle(() => {
    return {
      width: withTiming(randomWidth.value, config),
      borderWidth: withSpring(randomWidth.value/12, config_2),
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.box, style]}>
        <Text style={{color:"#fff"}}>rafa</Text>
      </Animated.View>
      <Button
        title="toggle"
        onPress={() => {
          randomWidth.value = Math.random() * 350;
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  box: {
    width: 100,
    height: 80,
    backgroundColor: 'black',
    margin: 30,
    borderColor:"#fd0000"
  },
});
