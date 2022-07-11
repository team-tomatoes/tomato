import React from 'react'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'

const getLocation = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync()
  if (status !== 'granted') {
    setErrorMessage('Permission not granted')
  } else {
    const userLocation = await Location.getCurrentPositionAsync({})
    setLatitude(Number(userLocation.coords.latitude))
    setLongitude(Number(userLocation.coords.longitude))
    setLocation(userLocation)
  }
}
