import React, { useEffect, useState } from 'react'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import {
  collection,
  query,
  where,
  doc,
  getDoc,
  setDoc,
  getDocs,
} from 'firebase/firestore'
import { firestore } from '../firebase/config'

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
        const icon = () => {
          if (pin[2] === 'Mood') {
            return require('../../assets/pinEmojis/blueSmiley.png')
          }
          if (pin[2] === 'Recommendations') {
            return require('../../assets/pinEmojis/pinkStar.png')
          }
          if (pin[2] === 'Animal-Sightings') {
            return require('../../assets/pinEmojis/orangeDog.png')
          }
          if (pin[2] === 'Safety') {
            return require('../../assets/pinEmojis/yellowSafety.png')
          }
          if (pin[2] === 'Missed-Connections') {
            return require('../../assets/pinEmojis/greenConnections.png')
          }
          if (pin[2] === 'Meetups') {
            return require('../../assets/pinEmojis/purplePeace.png')
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
