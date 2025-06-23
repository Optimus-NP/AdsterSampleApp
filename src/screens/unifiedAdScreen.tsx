import React, {useState} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  ScrollView,
} from 'react-native';
import {NavigationProp} from '@react-navigation/native';
import {
  UnifiedAdView,
  UnifiedAdEvent,
  IconView,
  HeadlineView,
  BodyView,
  AdvertiserView,
  CallToActionView,
  testPlacementNames,
} from 'adster-react-native-client';

import {Header} from '../components/header';
import {Button} from '../components/button';
import {showToastMessage} from '../utils/showToastMessage';

export const UnifiedAdScreen = ({
  navigation,
}: {
  navigation: NavigationProp<any>;
}) => {
  const [adLoadError, setAdLoadError] = useState(false);
  const [eventLogs, setEventLogs] = useState<string[]>([]);
  const [adLoading, setAdLoading] = useState(true);

  const handleReload = () => {
    setEventLogs([]);
    //@ts-ignore
    navigation.replace('UnifiedAdScreen');
  };

  return (
    <View style={styles.container}>
      <Header
        title="Unified Ad Screen"
        back
        onPressBack={() => {
          if (navigation.canGoBack()) {
            navigation.goBack();
          }
        }}
      />

      <ScrollView
        contentContainerStyle={styles.viewContainer}
        keyboardShouldPersistTaps="handled">
        {adLoading && <ActivityIndicator size="large" color="#007bff" />}

        <UnifiedAdView
          placementName={testPlacementNames.unified}
          nativeContainerStyle={styles.nativeAdWrapperContainer}
          bannerContainerStyle={styles.bannerContainer}
          style={styles.unifiedAdStyle}
          onBannerAdLoaded={(event: UnifiedAdEvent) => {
            const message = event.nativeEvent.message;
            console.log('Unified Banner Ad loaded: ', message);
            showToastMessage('Unified Banner Ad loaded');
            setAdLoadError(false);
            setEventLogs(prev => [...prev, message]);
            setAdLoading(false);
          }}
          onNativeAdLoaded={event => {
            const message = event.nativeEvent.message;
            console.log('Unified Native Ad loaded: ', message);
            showToastMessage('Unified Native Ad loaded');
            setAdLoadError(false);
            setEventLogs(prev => [...prev, message]);
            setAdLoading(false);
          }}
          onFailure={event => {
            const error = event.nativeEvent.error;
            console.error('Unified Ad failed to load:', error);
            showToastMessage('Unified Ad failed to load');
            setAdLoadError(true);
            setEventLogs(prev => [
              ...prev,
              'Unified Ad failed to load: ' + error,
            ]);
            setAdLoading(false);
          }}
          onAdClicked={event => {
            const message = event.nativeEvent.message;
            console.log('Unified Ad Clicked:', message);
            showToastMessage('Unified Ad clicked');
            setEventLogs(prev => [...prev, message]);
          }}
          onAdImpression={event => {
            const message = event.nativeEvent.message;
            console.log('Unified Ad Impression:', message);
            showToastMessage('Unified Ad impression');
            setEventLogs(prev => [...prev, message]);
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

        {adLoadError && (
          <Button title="Reload Unified Ad" onPress={handleReload} />
        )}

        {eventLogs.map((msg, index) => (
          <Text key={index} style={styles.toastMessageStyle}>
            {msg}
          </Text>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  viewContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
    gap: 15,
    padding: 16,
  },
  toastMessageStyle: {
    fontSize: 15,
    color: '#333',
    backgroundColor: '#f0f0f0',
    width: '90%',
    padding: 10,
    borderRadius: 10,
    marginTop: 5,
    textAlign: 'center',
  },
  nativeAdWrapperContainer: {
    backgroundColor: '#E2F2FF',
    borderRadius: 20,
    width: '100%',
    marginBottom: 20,
    overflow: 'hidden',
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
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
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
    marginTop: 10,
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
    width: '100%',
    height: 280,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'green',
    borderRadius: 10,
  },
});
