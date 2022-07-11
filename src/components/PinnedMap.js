import React from 'react'
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
  const getFirestoreDocs = async () => {
    const querySnapshot = await getDocs(collection(firestore, 'pins'))

    querySnapshot.forEach((document) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(document.data().coordinates)
    })
  }

  const pinCoords = []

  const loadAllPins = async () => {
    const querySnapshot = await getDocs(collection(firestore, 'pins'))

    querySnapshot.forEach((document) => {
      // doc.data() is never undefined for query doc snapshots
      return (
        <MapView.Marker
          coordinate={{
            latitude: document.data().coordinates[0],
            longitude: document.data().coordinates[1],
          }}
        />
      )
    })
  }

  const loadAgain = async () => {
    await loadAllPins()
  }

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
      {loadAgain()}
    </MapView>
  )
}
