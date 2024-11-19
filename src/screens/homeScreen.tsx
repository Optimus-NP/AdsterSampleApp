import { StyleSheet, View } from 'react-native';
import { Button } from '../components/button';
import { Header } from '../components/header';
import { NavigationProp } from '@react-navigation/native';

export const HomeScreen = ({
  navigation,
}: {
  navigation: NavigationProp<any>;
}) => {
  return (
    <View style={styles.container}>
      <Header title="Home Screen" />
      <View style={styles.buttonsContainer}>
        <Button
          title="Banner Ad"
          onPress={() => {
            navigation.navigate('BannerAdScreen');
          }}
        />
        <Button
          title="Native Ad"
          onPress={() => {
            navigation.navigate('NativeAdScreen');
          }}
        />
        <Button
          title="Unified Ad"
          onPress={() => {
            navigation.navigate('UnifiedAdScreen');
          }}
        />
        <Button
          title="Interstitial Ad"
          onPress={() => {
            navigation.navigate('InterstitialAdScreen');
          }}
        />
        <Button
          title="Rewarded Ad"
          onPress={() => {
            navigation.navigate('RewardedAdScreen');
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
});
