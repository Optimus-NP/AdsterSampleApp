import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {Header} from '../components/header';
import {NavigationProp} from '@react-navigation/native';
import {useState} from 'react';
import {BannerAdEvent, BannerAdView} from 'adster-react-native-client';
import {showToastMessage} from '../utils/showToastMessage';
import {Button} from '../components/button';

export const BannerTestAdScreen = ({
  navigation,
}: {
  navigation: NavigationProp<any>;
}) => {
  const [loadBannerAdError, setLoadBannerAdError] = useState(false);
  const [toastMessages, setToastMessages] = useState<string[]>([]);
  const [loadingBannerAd, setLoadingBannerAd] = useState(true);

  return (
    <View style={styles.container}>
      <Header
        title="Banner Test 320X50"
        back={true}
        onPressBack={() => {
          if (navigation.canGoBack()) {
            navigation.goBack();
          }
        }}
      />
      <View style={styles.viewContainer}>
        {loadingBannerAd && <ActivityIndicator size="large" color="#0000ff" />}
        <BannerAdView
          bannerContainerStyle={styles.bannerContainer}
          onAdLoadFailure={(event: BannerAdEvent) => {
            const error = event.nativeEvent.error;
            console.error('Ad failed to load:', error);
            showToastMessage('Banner Ad failed to load');
            setLoadBannerAdError(true);
            setToastMessages(prev => [
              ...prev,
              'Banner Ad failed to load: ' + error,
            ]);
            setLoadingBannerAd(false);
          }}
          onAdLoaded={(event: BannerAdEvent) => {
            const message = event.nativeEvent.message;
            console.log('Ad loaded successfully:', message);
            showToastMessage('Banner Ad loaded successfully');
            setLoadBannerAdError(false);
            setToastMessages(prev => [...prev, message]);
            setLoadingBannerAd(false);
          }}
          onAdClicked={(event: BannerAdEvent) => {
            const message = event.nativeEvent.message;
            console.log('Ad Clicked:', message);
            showToastMessage('Banner Ad clicked');
            setToastMessages(prev => [...prev, message]);
          }}
          onAdImpression={(event: BannerAdEvent) => {
            const message = event.nativeEvent.message;
            console.log('Ad Impression:', message);
            showToastMessage('Banner Ad impression');
            setToastMessages(prev => [...prev, message]);
          }}
          placementName={'Adster_Banner_Test'}
        />
        {loadBannerAdError && (
          <Button
            title="Reload Banner Ad"
            onPress={() => {
              setToastMessages([]);
              //@ts-ignore
              navigation.replace('BannerTestAdScreen');
            }}
          />
        )}
        {toastMessages.map((message, index) => (
          <Text key={index} style={styles.toastMessageStyle}>
            {message}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  viewContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    gap: 15,
  },
  bannerContainer: {
    marginVertical: 20,
    width: 320,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'green',
  },
  toastMessageStyle: {
    fontSize: 15,
    color: 'black',
    width: '80%',
    textAlign: 'center',
  },
});
