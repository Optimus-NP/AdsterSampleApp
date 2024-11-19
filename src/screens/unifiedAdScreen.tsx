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
  testPlacementNames,
  UnifiedAdEvent,
  UnifiedAdView,
} from 'adster-react-native-client';
import {showToastMessage} from '../utils/showToastMessage';

export const UnifiedAdScreen = ({
  navigation,
}: {
  navigation: NavigationProp<any>;
}) => {
  const [loadUnifiedAdError, setLoadUnifiedAdError] = useState(false);
  const [toastMessages, setToastMessages] = useState<string[]>([]);
  const [loadingUnifiedAd, setLoadingUnifiedAd] = useState(true);
  return (
    <View style={styles.container}>
      <Header
        title="Unified Ad Screen"
        back={true}
        onPressBack={() => {
          if (navigation.canGoBack()) {
            navigation.goBack();
          }
        }}
      />

      <View style={styles.viewContainer}>
        {loadingUnifiedAd && <ActivityIndicator size="large" color="#0000ff" />}

        <UnifiedAdView
          placementName={testPlacementNames.unified}
          nativeContainerStyle={styles.nativeAdWrapperContainer}
          bannerContainerStyle={styles.bannerContainer}
          style={styles.unifiedAdStyle}
          onBannerAdLoaded={(event: UnifiedAdEvent) => {
            const message = event.nativeEvent.message;
            console.log('Unified Banner Ad loaded: ', message);
            showToastMessage('Unified Banner Ad loaded');
            setLoadUnifiedAdError(false);
            setToastMessages(prev => [...prev, message]);
            setLoadingUnifiedAd(false);
          }}
          onNativeAdLoaded={event => {
            const message = event.nativeEvent.message;
            console.log('Unified Native Ad loaded: ', message);
            showToastMessage('Unified Native Ad loaded');
            setLoadUnifiedAdError(false);
            setToastMessages(prev => [...prev, message]);
            setLoadingUnifiedAd(false);
          }}
          onFailure={event => {
            const error = event.nativeEvent.error;
            console.error('Unified Ad failed to load:', error);
            showToastMessage('Unified Ad failed to load');
            setLoadUnifiedAdError(true);
            setToastMessages(prev => [
              ...prev,
              'Unified Ad failed to load: ' + error,
            ]);
            setLoadingUnifiedAd(false);
          }}
          onAdClicked={event => {
            const message = event.nativeEvent.message;
            console.log('Unified Ad Clicked:', message);
            showToastMessage('Unified Ad clicked');
            setToastMessages(prev => [...prev, message]);
          }}
          onAdImpression={event => {
            const message = event.nativeEvent.message;
            console.log('Unified Ad Impression:', message);
            showToastMessage('Unified Ad impression');
            setToastMessages(prev => [...prev, message]);
          }}>
          <View style={styles.nativeAdContainer}>
            <View style={styles.iconHeadingRowContainer}>
              <IconView style={styles.iconViewStyle} />
              <View style={styles.headingBodyContainer}>
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
        </UnifiedAdView>

        {loadUnifiedAdError && (
          <Button
            title="Reload Unified Ad"
            onPress={() => {
              setToastMessages([]);
              //@ts-ignore
              navigation.replace('UnifiedAdScreen');
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
  nativeAdWrapperContainer: {
    backgroundColor: '#E2F2FF',
    borderRadius: 20,
    width: '90%',
    marginBottom: 20,
  },
  unifiedAdStyle: {
    marginVertical: 20,
  },
  nativeAdContainer: {
    width: '100%',
    padding: 10,
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
  bannerContainer: {
    marginVertical: 20,
    width: '90%',
    height: 280,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'green',
  },
});
