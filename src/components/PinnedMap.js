import React, { useEffect, useState } from 'react'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import { Image } from 'react-native'
import {
  collection,
  query,
  where,
  doc,
  getDoc,
  setDoc,
  getDocs,
} from 'firebase/firestore'
import FontIcon from 'react-native-vector-icons/FontAwesome5'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { firestore } from '../firebase/config'
import {
  blueSmiley,
  pinkStar,
  yellowSafety,
  purplePeace,
  greenMeetups,
  orangeDog,
} from '../../assets/pin-emojis'

export const PinnedMap = () => {
  const [pins, setPins] = useState([])

  const loadAllPins = async () => {
    try {
      const pinsArr = []
      const querySnapshot = await getDocs(collection(firestore, 'pins'))
      // console.log(querySnapshot.data())
      querySnapshot.forEach((document) => {
        // doc.data() is never undefined for query doc snapshots
        pinsArr.push([
          document.data().coordinates[0],
          document.data().coordinates[1],
          document.data().category,
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
    loadAllPins()
  }, [])

  console.log(pins)

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
    >
      {pins.map((pin) => {
        return (
          <MapView.Marker
            key={pin[3]}
            coordinate={{
              latitude: pin[0],
              longitude: pin[1],
            }}
            image={require}
          />
        )
      })}
    </MapView>
  )
}
