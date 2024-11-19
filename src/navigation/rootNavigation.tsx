import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SdkLoadingScreen} from '../screens/sdkLoadingScreen';
import {HomeScreen} from '../screens/homeScreen';
import {BannerAdScreen} from '../screens/bannerAdScreen';
import {NativeAdScreen} from '../screens/nativeAdScreen';
import {UnifiedAdScreen} from '../screens/unifiedAdScreen';
import {InterstitialAdScreen} from '../screens/interstitialAdScreen';
import {RewardedAdScreen} from '../screens/rewardedAdScreen';
import {BannerTestAdScreen} from '../screens/bannerTestAdScreen';
import {BannerNewAdScreen} from '../screens/bannerNewAdScreen';

const Stack = createNativeStackNavigator();

// enableScreens();

export const RootNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SdkLoadingScreen">
        <Stack.Screen
          name="SdkLoadingScreen"
          component={SdkLoadingScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="BannerAdScreen"
          component={BannerAdScreen}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="BannerTestAdScreen"
          component={BannerTestAdScreen}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="BannerNewAdScreen"
          component={BannerNewAdScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="NativeAdScreen"
          component={NativeAdScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="UnifiedAdScreen"
          component={UnifiedAdScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="InterstitialAdScreen"
          component={InterstitialAdScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="RewardedAdScreen"
          component={RewardedAdScreen}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
