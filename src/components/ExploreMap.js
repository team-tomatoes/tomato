import React, { useEffect, useState } from 'react'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'
import Geocoder from 'react-native-geocoding'
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  Image,
} from 'react-native'
import {
  collection,
  query,
  where,
  doc,
  getDoc,
  setDoc,
  getDocs,
} from 'firebase/firestore'
import APIKey from '../../googleAPIKey'
import { mapStyle } from '../constants/mapStyle'
import { firestore } from '../firebase/config'

export const PinnedMap = () => {
  Geocoder.init(APIKey)

  const [pins, setPins] = useState([])
  const [users, setUsers] = useState([])
  const [modalData, setModalData] = useState([])
  const [latLong, setLatLong] = useState([])
  const [near, setNear] = useState('')
  const [modalVisible, setModalVisible] = useState(false)

  const loadAllPins = async () => {
    try {
      const pinsArr = []
      const querySnapshot = await getDocs(collection(firestore, 'pins'))

      querySnapshot.forEach((document) => {
        // doc.data() is never undefined for query doc snapshots
        pinsArr.push([
          document.data().coordinates[0],
          document.data().coordinates[1],
          document.data().category,
          document.data().description,
          document.data().picture,
          document.data().user,
          document.id,
        ])
      })
      setPins(pinsArr)
    } catch (err) {
      console.log(err)
    }
  }

  const loadUsers = async () => {
    try {
      const userArr = []
      const querySnapshot = await getDocs(collection(firestore, 'users'))

      querySnapshot.forEach((user) => {
        userArr.push([user.data().id, user.data().userName])
      })
      setUsers(userArr)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    loadAllPins()
    loadUsers()
  }, [])

  const loadNear = async () => {
    try {
      await Geocoder.from(latLong).then((json) => {
        const addressComponent = json.results[0].formatted_address
        console.log(addressComponent)
        setNear(addressComponent)
        console.log(near)
      })
    } catch (err) {
      console.log(err)
    }
  }

  console.log(near)

  return (
    <>
      <MapView
        style={{ flex: 1 }}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: 40.77949,
          longitude: -73.96634,
          latitudeDelta: 0.2,
          longitudeDelta: 0.2,
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
              key={pin[6]}
              coordinate={{
                latitude: pin[0],
                longitude: pin[1],
              }}
              // description={pin[3]}
              image={icon()}
              onPress={() => {
                setModalData(pin)
                setModalVisible(true)
                setLatLong([pin[0], pin[1]])
                loadNear(latLong)
              }}
            />
          )
        })}
      </MapView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.')
          setModalVisible(!modalVisible)
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalDescriptionText}>{modalData[2]}</Text>
            <Text style={styles.modalNearText}>Near {near}</Text>
            <Image style={{ height: 250, width: 150 }} source={{ uri: modalData[4] }} />
            <Text style={styles.modalText}>{modalData[3]}</Text>
            <Text style={styles.modalText}>{modalData[3]}</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#F07167',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  modalDescriptionText: {
    marginBottom: 15,
    textAlign: 'center',
    color: '#adb5bd',
  },
  modalNearText: {
    marginBottom: 15,
    textAlign: 'center',
    color: '#6c757d',
  },
})
