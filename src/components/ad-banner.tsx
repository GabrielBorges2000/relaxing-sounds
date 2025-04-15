"use client"

import { View, StyleSheet } from "react-native"
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

export function AdBanner() {
  return (
    <View style={styles.container}>
      <BannerAd
        unitId={TestIds.BANNER}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
          networkExtras: {
            collapsible: "bottom"
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    alignItems: "center",
    backgroundColor: "transparent",
    zIndex: 1,
  },
})
