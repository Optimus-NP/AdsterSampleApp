/* eslint-disable react-hooks/exhaustive-deps */
import Adster from 'adster-react-native-client';
import {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {CommonActions} from '@react-navigation/native';

import type {NavigationProp} from '@react-navigation/native';
import {Button} from '../components/button';

export const SdkLoadingScreen = ({
  navigation,
}: {
  navigation: NavigationProp<any>;
}) => {
  const [isSDKInitializationError, setIsSDKInitializationError] =
    useState(false);
  useEffect(() => {
    initializeSDK();
  }, []);

  const initializeSDK = async () => {
    try {
      await Adster.initializeSDK();
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'HomeScreen'}],
        }),
      );
    } catch (error) {
      console.error('SDK Initialization Error:', error);
      setIsSDKInitializationError(true);
    }
  };

  return (
    <View style={styles.container}>
      {!isSDKInitializationError && <Text>SDK is Loading, please wait...</Text>}

      {isSDKInitializationError && <Text>SDK Initialization Error</Text>}
      {isSDKInitializationError && (
        <Button
          title="Retry"
          onPress={() => {
            setIsSDKInitializationError(false);
            initializeSDK();
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  retryButtonStyle: {
    backgroundColor: 'lightblue',
    padding: 10,
    borderRadius: 5,
    width: '30%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
