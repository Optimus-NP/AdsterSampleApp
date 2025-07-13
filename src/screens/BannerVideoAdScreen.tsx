// src/screens/BannerVideoAdScreen.tsx

import React, { useEffect, useCallback, useState } from 'react'
import {
  SafeAreaView,
  ScrollView,
  RefreshControl,
  StyleSheet,
  Dimensions,
  Alert,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  NativeSyntheticEvent,
  ViewStyle,
  View,
} from 'react-native'
import { BannerVideoAd } from '../components/BannerVideoAd'

const { width: screenWidth } = Dimensions.get('window')

export default function BannerVideoAdScreen() {
  useEffect(() => {
    console.log('[BannerVideoAdScreen] mounted')
    return () => console.log('[BannerVideoAdScreen] unmounted')
  }, [])

  const [refreshing, setRefreshing] = useState(false)
  const [adKey, setAdKey] = useState(0)
  const [adLoaded, setAdLoaded] = useState(false)

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    setAdLoaded(false)
    setAdKey((k) => k + 1)
    // simulate network delay
    setTimeout(() => setRefreshing(false), 1000)
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
      setRefreshing(false)
    },
    []
  )

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.header}>Banner Video Ad</Text>

        <View style={styles.adContainer}>
          {(!adLoaded || refreshing) && (
            <ActivityIndicator style={styles.loader} />
          )}

          {!refreshing && (
            <BannerVideoAd
              key={adKey}
              placementId="bannervideo_0"
              style={styles.banner}
              onAdLoaded={handleAdLoaded}
              onAdVisible={handleAdVisible}
              onAdFailedToLoad={handleAdFailed}
            />
          )}
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={onRefresh}
          disabled={refreshing}
        >
          <Text style={styles.buttonText}>
            {refreshing ? 'Refreshing...' : 'Refresh Ad'}
          </Text>
        </TouchableOpacity>
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
    flex: 1 as ViewStyle['flex'],  // fill the container
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
