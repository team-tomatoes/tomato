import React from 'react'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'

export const PinnedMap = () => {
  return (
    <MapView
      style={{ flex: 1 }}
      provider={PROVIDER_GOOGLE}
      initialRegion={{
        latitude: 40.77949,
        longitude: -73.96634,
        latitudeDelta: 0.055,
        longitudeDelta: 0.055,
      }}
    />
  )
}
