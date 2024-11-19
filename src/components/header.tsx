import { Pressable, StyleSheet, Text, View } from 'react-native';

export const Header = ({
  title,
  back,
  onPressBack,
}: {
  title: string;
  back?: boolean;
  onPressBack?: () => void;
}) => {
  return (
    <View style={styles.headerContainer}>
      {back && onPressBack && (
        <Pressable style={styles.backButtonStyle} onPress={onPressBack}>
          <Text style={styles.backText}>Back</Text>
        </Pressable>
      )}
      <Text style={styles.headerTitleStyle}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerTitleStyle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
    textAlign: 'center',
  },
  headerContainer: {
    height: 50,
    width: '100%',
    backgroundColor: '#57adda',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  backButtonStyle: {
    position: 'absolute',
    left: 10,
    backgroundColor: '#167cc2',
    height: 30,
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    zIndex: 10,
  },
  backText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
});
