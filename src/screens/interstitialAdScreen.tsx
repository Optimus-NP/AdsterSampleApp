import {
  ActivityIndicator,
  DeviceEventEmitter,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Header} from '../components/header';
import {NavigationProp} from '@react-navigation/native';
import {Button} from '../components/button';
import Adster, {
  EAdEvent,
  EInterstitialAdEventType,
  testPlacementNames,
} from 'adster-react-native-client';
import {useEffect, useState} from 'react';
import {showToastMessage} from '../utils/showToastMessage';

export const InterstitialAdScreen = ({
  navigation,
}: {
  navigation: NavigationProp<any>;
}) => {
  const [loadingInterstitialAd, setLoadingInterstitialAd] = useState(false);
  const [toastMessages, setToastMessages] = useState<string[]>([]);

  //Event Listener for Interstitial Ad
  useEffect(() => {
    const onAdEvent = DeviceEventEmitter.addListener(
      EAdEvent.InterstitialAdEvent,
      event => {
        const {event: eventType, message, error} = event;
        switch (eventType) {
          case EInterstitialAdEventType.onInterstitialAdLoaded:
            console.log(message);
            showToastMessage(message);
            setToastMessages(prev => [...prev, message]);
            break;
          case EInterstitialAdEventType.onAdLoadFailure:
            console.error(message + error);
            showToastMessage(message);
            setToastMessages(prev => [...prev, message + ':' + error]);
            break;
          case EInterstitialAdEventType.onAdClicked:
            console.log(message);
            showToastMessage(message);
            setToastMessages(prev => [...prev, message]);
            break;
          case EInterstitialAdEventType.onAdImpression:
            console.log(message);
            showToastMessage(message);
            setToastMessages(prev => [...prev, message]);
            break;
          case EInterstitialAdEventType.onAdOpened:
            console.log(message);
            showToastMessage(message);
            setToastMessages(prev => [...prev, message]);
            break;
          case EInterstitialAdEventType.onAdClosed:
            console.log(message);
            showToastMessage(message);
            setToastMessages(prev => [...prev, message]);
            break;
          default:
            console.log('Unknown event type:', eventType);
            showToastMessage('Interstitial Ad: Unknown event type');
            setToastMessages(prev => [
              ...prev,
              'Interstitial Ad: Unknown event type: ' + eventType,
            ]);
        }
      },
    );
    return () => {
      onAdEvent.remove();
    };
  }, []);

  const loadInterstitialAd = async () => {
    try {
      // setLoadingInterstitialAd(true);
      setToastMessages([]);
      await Adster.loadInterstitialAd(testPlacementNames.interstitial);
    } catch (error) {
      console.log('loadInterstitialAdLoaded: Error', error);
    } finally {
      setLoadingInterstitialAd(false);
    }
  };

  const showInterstitialAd = async () => {
    setToastMessages([]);
    Adster.showInterstitialAd()
      .then(() => {})
      .catch(error => {
        console.log('Error in showInterstitialAd', error);
        showToastMessage('Error in showInterstitialAd' + error);
        setToastMessages(prev => [
          ...prev,
          'Error in showInterstitialAd:' + error,
        ]);
      });
  };

  return (
    <View style={styles.container}>
      <Header
        title="Interstitial Ad Screen"
        back={true}
        onPressBack={() => {
          if (navigation.canGoBack()) {
            navigation.goBack();
          }
        }}
      />
      <View style={styles.viewContainer}>
        {loadingInterstitialAd && (
          <ActivityIndicator size="large" color="#0000ff" />
        )}
        {!loadingInterstitialAd && (
          <Button title="Load Interstitial Ad" onPress={loadInterstitialAd} />
        )}
        <Button title="Show Interstitial Ad" onPress={showInterstitialAd} />
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
  toastMessageStyle: {
    fontSize: 15,
    color: 'black',
    width: '80%',
    textAlign: 'center',
  },
});
