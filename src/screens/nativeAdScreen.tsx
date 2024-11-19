import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {Header} from '../components/header';
import {NavigationProp} from '@react-navigation/native';
import {useState} from 'react';
import {Button} from '../components/button';
import {
  AdvertiserView,
  BodyView,
  CallToActionView,
  HeadlineView,
  IconView,
  NativeAdEvent,
  NativeAdView,
  testPlacementNames,
} from 'adster-react-native-client';
import {showToastMessage} from '../utils/showToastMessage';

export const NativeAdScreen = ({
  navigation,
}: {
  navigation: NavigationProp<any>;
}) => {
  const [loadNativeAdError, setLoadNativeAdError] = useState(false);
  const [toastMessages, setToastMessages] = useState<string[]>([]);
  const [loadingNativeAd, setLoadingNativeAd] = useState(true);
  return (
    <View style={styles.container}>
      <Header
        title="Native Ad Screen"
        back={true}
        onPressBack={() => {
          if (navigation.canGoBack()) {
            navigation.goBack();
          }
        }}
      />
      <View style={styles.viewContainer}>
        {loadingNativeAd && <ActivityIndicator size="large" color="#0000ff" />}

        <NativeAdView
          onNativeAdLoaded={function (event: NativeAdEvent): void {
            const message = event.nativeEvent.message;
            console.log('Native Ad Loaded: ', event.nativeEvent);
            showToastMessage('Native Ad loaded');
            setLoadNativeAdError(false);
            setToastMessages(prev => [...prev, message]);
            setLoadingNativeAd(false);
          }}
          onAdFailedToLoad={(event: NativeAdEvent) => {
            const error = event.nativeEvent.error;
            console.error('Native Ad failed to load:', error);
            showToastMessage('Native Ad failed to load');
            setLoadNativeAdError(true);
            setToastMessages(prev => [
              ...prev,
              'Native Ad failed to load: ' + error,
            ]);
            setLoadingNativeAd(false);
          }}
          onAdClicked={(event: NativeAdEvent) => {
            const message = event.nativeEvent.message;
            console.log('Native Ad Clicked:', message);
            showToastMessage('Native Ad clicked');
            setToastMessages(prev => [...prev, message]);
          }}
          onAdImpression={event => {
            const message = event.nativeEvent.message;
            console.log('Native Ad Impression:', message);
            showToastMessage('Native Ad impression');
            setToastMessages(prev => [...prev, message]);
          }}
          placementName={testPlacementNames.native}
          style={styles.nativeAdWrapperContainer}>
          <View style={styles.nativeAdContainer}>
            <View style={styles.iconHeadingRowContainer}>
              <View style={styles.headingBodyContainer}>
                <IconView style={styles.iconViewStyle} />
                <HeadlineView style={styles.headingStyle} />
                <BodyView numberOfLines={3} style={styles.bodyStyle} />
                <AdvertiserView style={styles.advertiserStyle} />
              </View>
            </View>

            <CallToActionView
              style={styles.ctaContainer}
              allCaps
              textStyle={styles.ctaTextStyle}
            />
          </View>
        </NativeAdView>

        {loadNativeAdError && (
          <Button
            title="Reload Native Ad"
            onPress={() => {
              setToastMessages([]);
              //@ts-ignore
              navigation.replace('NativeAdScreen');
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
  toastMessageStyle: {
    fontSize: 15,
    color: 'black',
    width: '80%',
    textAlign: 'center',
  },
  nativeAdContainer: {
    width: '100%',
    padding: 10,
  },
  nativeAdWrapperContainer: {
    backgroundColor: '#E2F2FF',
    borderRadius: 20,
    width: '90%',
    marginBottom: 20,
  },
  iconViewStyle: {
    width: 100,
    height: 100,
  },
  iconHeadingRowContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  headingBodyContainer: {
    paddingHorizontal: 6,
    flex: 1,
    gap: 6,
    marginLeft: 6,
  },
  headingStyle: {
    fontWeight: 'bold',
    fontSize: 15,
    color: 'black',
  },
  bodyStyle: {
    fontSize: 12,
    color: 'black',
  },
  advertiserStyle: {
    fontSize: 10,
    color: 'gray',
  },
  ctaContainer: {
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    width: '100%',
    backgroundColor: '#43bce9',
    borderRadius: 10,
    minHeight: 40,
  },
  ctaTextStyle: {
    fontSize: 15,
    flexWrap: 'wrap',
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'white',
  },
});
