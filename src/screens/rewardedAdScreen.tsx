import {
  ActivityIndicator,
  DeviceEventEmitter,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Header} from '../components/header';
import {NavigationProp} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import Adster, {
  EAdEvent,
  ERewardedAdEventType,
  testPlacementNames,
} from 'adster-react-native-client';
import {showToastMessage} from '../utils/showToastMessage';
import {Button} from '../components/button';

export const RewardedAdScreen = ({
  navigation,
}: {
  navigation: NavigationProp<any>;
}) => {
  const [loadingRewardedAd, setLoadingRewardedAd] = useState(false);
  const [toastMessages, setToastMessages] = useState<string[]>([]);

  //Event Listener for Rewarded Ad
  useEffect(() => {
    const onAdEvent = DeviceEventEmitter.addListener(
      EAdEvent.RewardedAdEvent,
      event => {
        const {event: eventType, message, error, reward} = event;
        switch (eventType) {
          case ERewardedAdEventType.onRewardedAdLoaded:
            console.log('Rewarded ad loaded');
            showToastMessage('Rewarded ad loaded');
            setToastMessages(prev => [...prev, message]);
            break;
          case ERewardedAdEventType.onFailure:
            console.log('Ad failed to load:', message);
            showToastMessage(
              'Rewarded Ad failed to load' + error + ':' + message,
            );
            setToastMessages(prev => [...prev, message + ': ' + error]);
            break;
          case ERewardedAdEventType.onAdClicked:
            console.log('Ad clicked');
            showToastMessage('Rewarded Ad clicked');
            setToastMessages(prev => [...prev, message]);
            break;
          case ERewardedAdEventType.onAdImpression:
            console.log('Ad impression');
            showToastMessage('Rewarded Ad impression');
            setToastMessages(prev => [...prev, message]);
            break;
          case ERewardedAdEventType.onUserEarnedReward:
            console.log('User Earned Reward');
            showToastMessage('Rewarded Ad User Earned Reward: ' + reward);
            setToastMessages(prev => [...prev, message + ':' + reward]);
            break;
          case ERewardedAdEventType.onVideoComplete:
            console.log('Video Complete');
            showToastMessage('Rewarded Ad Video Complete');
            setToastMessages(prev => [...prev, message]);
            break;
          case ERewardedAdEventType.onVideoClosed:
            console.log('Video Closed');
            showToastMessage('Rewarded Ad Video Closed');
            setToastMessages(prev => [...prev, message]);
            break;
          case ERewardedAdEventType.onVideoStart:
            console.log('Video Start');
            showToastMessage('Rewarded Ad Video Start');
            setToastMessages(prev => [...prev, message]);
            break;
          default:
            console.log('Unknown event type:', eventType);
            showToastMessage('Rewarded: Unknown event type');
            setToastMessages(prev => [
              ...prev,
              'Unknown event type:' + eventType,
            ]);
        }
      },
    );
    return () => {
      onAdEvent.remove();
    };
  }, []);

  const loadRewardedAd = async () => {
    try {
      // setLoadingRewardedAd(true);
      setToastMessages([]);
      await Adster.loadRewardedAd(testPlacementNames.rewarded);
    } catch (error) {
      console.log('loadRewardedAd: Error', error);
    } finally {
      setLoadingRewardedAd(false);
    }
  };

  const showRewardedAd = async () => {
    setToastMessages([]);
    Adster.showRewardedAd()
      .then(() => {})
      .catch(error => {
        console.log('Error in showRewardedAd', error);
        showToastMessage('Error in showRewardedAd' + error);
        setToastMessages(prev => [...prev, 'Error in showRewardedAd:' + error]);
      });
  };

  return (
    <View style={styles.container}>
      <Header
        title="Rewarded Ad Screen"
        back={true}
        onPressBack={() => {
          if (navigation.canGoBack()) {
            navigation.goBack();
          }
        }}
      />
      <View style={styles.viewContainer}>
        {loadingRewardedAd && (
          <ActivityIndicator size="large" color="#0000ff" />
        )}
        {!loadingRewardedAd && (
          <Button title="Load Rewarded Ad" onPress={loadRewardedAd} />
        )}
        <Button title="Show Rewarded Ad" onPress={showRewardedAd} />
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
