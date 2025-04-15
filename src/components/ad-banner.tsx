'use client';

import React from 'react';
import { View } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

const AdBannerComponent = () => (
  <View>
    <BannerAd
      unitId={TestIds.BANNER}
      size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      requestOptions={{
        requestNonPersonalizedAdsOnly: true,
        networkExtras: { collapsible: 'bottom' },
      }}
    />
  </View>
);

export const AdBanner = React.memo(AdBannerComponent);
