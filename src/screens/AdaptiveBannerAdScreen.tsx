// screens/AdaptiveBannerAdScreen.tsx
import React, { useEffect, useState, useMemo } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  View,
  ScrollView,
} from 'react-native';
import {
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import {
  BannerAdView,
  BannerAdEvent,
} from 'adster-react-native-client';
import { Header } from '../components/header';
import { Button } from '../components/button';
import { showToastMessage } from '../utils/showToastMessage';

type RootStackParamList = {
  AdaptiveBannerAdScreen: undefined;
};
type Nav = NativeStackNavigationProp<
  RootStackParamList,
  'AdaptiveBannerAdScreen'
>;

export const AdaptiveBannerAdScreen = ({ navigation }: { navigation: Nav }) => {
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(false);
  const [logMessages, setLog]   = useState<string[]>([]);
  const [adHeight, setAdHeight] = useState(50);

  
  const adWidth = useMemo(() => Math.floor(Dimensions.get('window').width), []);
  useEffect(() => {
    // Google’s inline-adaptive formula: height ≈ width / 6.4 (320 × 50 baseline)
    setAdHeight(Math.floor(adWidth / 6.4));
  }, [adWidth]);

  
  const reloadScreen = () => {
    showToastMessage('Reloading Adaptive Banner Ad');
    setLog(p => [...p, '🔁 Reloading ad...']);
    setLoading(true);
    setError(false);
    navigation.replace('AdaptiveBannerAdScreen');
  };

 
  return (
    <View style={styles.container}>
      <Header
        title="Adaptive Banner Ad"
        back
        onPressBack={() => navigation.canGoBack() && navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {loading && <ActivityIndicator size="large" color="#007bff" />}

        <BannerAdView
            placementName="Adster_Banner_Test"
            bannerContainerStyle={{ ...styles.adContainer, height: adHeight }}
            onAdLoaded={(e: BannerAdEvent) => {
                const msg = e?.nativeEvent?.message ?? 'loaded';
                setLog(p => [...p, `Loaded – ${msg}`]);
                setLoading(false);
                setError(false);
                showToastMessage('Ad Loaded');
            }}
            onAdLoadFailure={(e: BannerAdEvent) => {
                // ⬇️ safest way to read it
                const err = e?.nativeEvent?.error ??
                e?.nativeEvent?.message ??
                'Unknown error – check logs';
                setLog(p => [...p, `Failed – ${err}`]);
                setLoading(false);
                setError(true);
                showToastMessage('Load Failed');
            }}
            onAdClicked={(e: BannerAdEvent) =>
                setLog(p => [...p, `Click – ${e?.nativeEvent?.message ?? ''}`])
            }
            onAdImpression={(e: BannerAdEvent) =>
                setLog(p => [...p, ` Impression – ${e?.nativeEvent?.message ?? ''}`])
            }
        />


        {error && <Button title="Reload Ad" onPress={reloadScreen} />}

        {logMessages.map((msg, i) => (
          <Text key={i} style={styles.logText}>
            {msg}
          </Text>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  content: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 12,
  },
  adContainer: {
    width: '100%',
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logText: {
    backgroundColor: '#f1f1f1',
    padding: 10,
    borderRadius: 8,
    width: '90%',
    color: '#333',
    textAlign: 'center',
  },
});
