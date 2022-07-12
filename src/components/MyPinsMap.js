import React, { useEffect, useState, useContext } from 'react'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'
import * as Location from 'expo-location'
import {
  collection,
  query,
  where,
  doc,
  getDoc,
  setDoc,
  getDocs,
} from 'firebase/firestore'
import { mapStyle } from '../constants/mapStyle'
import { UserDataContext } from '../context/UserDataContext'
import { firestore } from '../firebase/config'

export const MyPinsMap = () => {
  const { userData } = useContext(UserDataContext)
  const [errorMessage, setErrorMessage] = useState(null)
  const [location, setLocation] = useState(null)
  const [currLatitude, setLatitude] = useState(null)
  const [currLongitude, setLongitude] = useState(null)
  const [pins, setPins] = useState([])

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync()
    if (status !== 'granted') {
      setErrorMessage('Permission not granted')
    } else {
      const userLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      })
      setLatitude(Number(userLocation.coords.latitude))
      setLongitude(Number(userLocation.coords.longitude))
      setLocation(userLocation)
    }
  }

  const loadAllPins = async () => {
    try {
      const pinsArr = []
      const q = query(
        collection(firestore, 'pins'),
        where('user', '==', userData.id),
      )

      const querySnapshot = await getDocs(q)

      querySnapshot.forEach((document) => {
        // doc.data() is never undefined for query doc snapshots
        pinsArr.push([
          document.data().coordinates[0],
          document.data().coordinates[1],
          document.data().category,
          document.data().description,
          document.data().user,
          document.id,
        ])
        console.log(document.data())
      })
      setPins(pinsArr)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getLocation()
    loadAllPins()
  }, [])

  console.log(pins)

  return (
    <MapView
      style={{ flex: 1 }}
      provider={PROVIDER_GOOGLE}
      region={{
        latitude: Number(currLatitude),
        longitude: Number(currLongitude),
        latitudeDelta: 0.06,
        longitudeDelta: 0.06,
      }}
      customMapStyle={mapStyle}
    >
      {pins.map((pin) => {
        const icon = () => {
          if (pin[2] === 'Mood') {
            return require('../../assets/pinEmojis/blueSmileyPastel.png')
          }
          if (pin[2] === 'Recommendations') {
            return require('../../assets/pinEmojis/pinkStarPastel.png')
          }
          if (pin[2] === 'Animal-Sightings') {
            return require('../../assets/pinEmojis/orangeDogPastel.png')
          }
          if (pin[2] === 'Safety') {
            return require('../../assets/pinEmojis/yellowSafetyPastel.png')
          }
          if (pin[2] === 'Missed-Connections') {
            return require('../../assets/pinEmojis/greenConnectionsPastel.png')
          }
          if (pin[2] === 'Meetups') {
            return require('../../assets/pinEmojis/purplePeacePastel.png')
          }
        }
        return (
          <MapView.Marker
            key={pin[5]}
            coordinate={{
              latitude: pin[0],
              longitude: pin[1],
            }}
            description={pin[3]}
            image={icon()}
          />
        )
      })}
    </MapView>
  )
}
