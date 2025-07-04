// File: js/screens/AdaptiveBannerAdScreen.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Text,
  Dimensions,
  PixelRatio,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigation';
import { Header } from '../components/header';
import { AdaptiveBannerAd } from '../components/AdaptiveBannerAd';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'AdaptiveBannerAdScreen'
>;

// Get screen width in dp once
const screenWidthDp =
  Dimensions.get('window').width / PixelRatio.get();

export default function AdaptiveBannerAdScreen({
  route,
  navigation,
}: Props) {
  // start in the mode passed, or anchored by default
  const initialMode = route.params?.mode ?? 'anchored';
  const [mode, setMode] = useState<'inline' | 'anchored'>(initialMode);

  const placementId = 'adaptive_banner_test';

  // Inline banners will now request a minimum of 320dp width
  const inlineWidthDp = mode === 'inline' ? 320 : undefined;

  const [height, setHeight] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset loading/error/height whenever mode changes
  useEffect(() => {
    setLoaded(false);
    setError(null);
    setHeight(0);
  }, [mode]);

  return (
    <View style={styles.container}>
      <Header
        title={`Adaptive Banner (${mode})`}
        back
        onPressBack={() => navigation.goBack()}
      />

      {!loaded && !error && (
        <ActivityIndicator style={styles.spinner} />
      )}
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      <View
        style={[
          styles.adWrapper,
          mode === 'inline' && {
            width: `${(inlineWidthDp! / screenWidthDp) * 100}%`,
            alignSelf: 'center',
          },
          { height },
        ]}
      >
        <AdaptiveBannerAd
          placementId={placementId}
          mode={mode}
          inlineWidthDp={inlineWidthDp}
          style={{ width: '100%', height }}
          onAdLoaded={(e) => {
            setHeight(e.nativeEvent.adHeight);
            setLoaded(true);
          }}
          onAdFailedToLoad={(e) => {
            const msg = e.nativeEvent.error;
            // if inline “no fill”, switch to anchored mode
            if (mode === 'inline' && msg.includes('No fill')) {
              setMode('anchored');
            } else {
              setError(msg);
            }
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  spinner: {
    marginTop: 20,
  },
  adWrapper: {
    width: '100%',
    overflow: 'visible',
    marginTop: 16,
    minHeight: 50,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});
