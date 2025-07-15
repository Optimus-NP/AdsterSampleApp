// src/screens/BannerVideoAdScreen.tsx

import React, { useEffect, useCallback, useState } from 'react'
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Dimensions,
  Alert,
  Text,
  ActivityIndicator,
  NativeSyntheticEvent,
  View,
  ViewStyle,
} from 'react-native'
import { BannerVideoAd } from '../components/BannerVideoAd'

const { width: screenWidth } = Dimensions.get('window')

export default function BannerVideoAdScreen() {
  const [adLoaded, setAdLoaded] = useState(false)

  useEffect(() => {
    console.log('[BannerVideoAdScreen] mounted')
    return () => console.log('[BannerVideoAdScreen] unmounted')
  }, [])

  const handleAdLoaded = useCallback(
    (_e: NativeSyntheticEvent<{}>) => {
      console.log('[BannerVideoAdScreen] Ad Loaded')
      setAdLoaded(true)
    },
    []
  )

  const handleAdVisible = useCallback(
    (_e: NativeSyntheticEvent<{}>) => {
      console.log('[BannerVideoAdScreen] Ad Visible')
    },
    []
  )

  const handleAdFailed = useCallback(
    (e: NativeSyntheticEvent<{ error: string }>) => {
      console.error('[BannerVideoAdScreen] Ad failed:', e.nativeEvent.error)
      Alert.alert('Ad Load Failed', e.nativeEvent.error)
    },
    []
  )

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Banner Video Ad</Text>

        <View style={styles.adContainer}>
          {!adLoaded && <ActivityIndicator style={styles.loader} />}
          <BannerVideoAd
            placementId="bannervideo_0"
            style={styles.banner}
            onAdLoaded={handleAdLoaded}
            onAdVisible={handleAdVisible}
            onAdFailedToLoad={handleAdFailed}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  adContainer: {
    width: screenWidth * 0.9,
    height: (screenWidth * 0.9 * 9) / 16,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#e1e1e1',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
  },
  loader: {
    position: 'absolute',
  },
  banner: {
    flex: 1 as ViewStyle['flex'],
  },
  button: {
    marginTop: 20,
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '500',
  },
})
