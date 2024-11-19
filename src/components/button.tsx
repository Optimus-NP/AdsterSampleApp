import { Pressable, StyleSheet, Text } from 'react-native';

import { GestureResponderEvent } from 'react-native';

interface ButtonProps {
  onPress: (event: GestureResponderEvent) => void;
  title: string;
}

export const Button = ({ onPress, title }: ButtonProps) => {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <Text style={styles.buttonTextStyle}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 50,
    width: '80%',
    backgroundColor: '#43bce9',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonTextStyle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
