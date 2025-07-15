import { useIsFocused } from '@react-navigation/native';
import React from 'react';
import {
  requireNativeComponent,
  StyleProp,
  ViewStyle,
  NativeSyntheticEvent,
} from 'react-native';

interface BannerVideoAdProps {
  placementId: string;
  paused?: boolean;
  style?: StyleProp<ViewStyle>;
  onAdFailedToLoad?: (e: NativeSyntheticEvent<{ error: string }>) => void;
  onAdLoaded?: (e: NativeSyntheticEvent<{}>) => void;
}

// Require the native component with the new 'paused' prop
const RNBannerVideoView = requireNativeComponent<BannerVideoAdProps>(
  'RNBannerVideoView'
);

export const YourAdScreen = () => {
  const isFocused = useIsFocused()
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    setPaused(!isFocused)  // pause when screen is unfocused
  }, [isFocused])

  return (
    <BannerVideoAd
      placementId="bannervideo_0"
      paused={paused}
      onAdFailedToLoad={handleAdFailed}
      onAdLoaded={handleAdLoaded}
    />
  )
}

export const BannerVideoAd: React.FC<BannerVideoAdProps> = ({
  placementId,
  paused = false,
  style,
  onAdFailedToLoad,
  onAdLoaded,
}) => {
  // default 100% width, 200px height
  const fallbackStyle: StyleProp<ViewStyle> = { width: '100%', height: 200 };

  return (
    <RNBannerVideoView
      placementId={placementId}
      paused={paused}
      style={[fallbackStyle, style]}
      onAdFailedToLoad={onAdFailedToLoad}
      onAdLoaded={onAdLoaded}
    />
  );
};
