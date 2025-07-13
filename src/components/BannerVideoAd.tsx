// src/components/BannerVideoAd.tsx
import React from 'react';
import {
  requireNativeComponent,
  StyleProp,
  ViewStyle,
  NativeSyntheticEvent,
} from 'react-native';

interface BannerVideoAdProps {
  placementId: string;
  style?: StyleProp<ViewStyle>;
  onAdFailedToLoad?: (e: NativeSyntheticEvent<{ error: string }>) => void;
  onAdLoaded?: (e: NativeSyntheticEvent<{}>) => void;
  onAdVisible?: (e: NativeSyntheticEvent<{}>) => void;
}

const RNBannerVideoView = requireNativeComponent<BannerVideoAdProps>(
  'RNBannerVideoView'
);

export const BannerVideoAd: React.FC<BannerVideoAdProps> = ({
  placementId,
  style,
  onAdFailedToLoad,
  onAdLoaded,
  onAdVisible,
}) => (
  <RNBannerVideoView
    style={style}
    placementId={placementId}
    onAdFailedToLoad={onAdFailedToLoad}
    onAdLoaded={onAdLoaded}
    onAdVisible={onAdVisible}
  />
);
