import React, { useEffect, useState } from 'react'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'
import { Video } from 'expo-av'
import * as Location from 'expo-location'
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
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
} from 'firebase/firestore'
import Geocoder from '../../node_modules/react-native-geocoding'
import APIKey from '../../googleAPIKey'
import { mapStyle } from '../constants/mapStyle'
import { firestore } from '../firebase/config'

export const ExploreMap = () => {
  Geocoder.init(APIKey)

  const [pins, setPins] = useState([])
  const [users, setUsers] = useState([])
  const [userName, setUserName] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [modalData, setModalData] = useState([])
  const [near, setNear] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const [mapView, setMap] = useState()
  const [initialRegion, setInitialRegion] = useState()

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync()
    if (status !== 'granted') {
      setErrorMessage('Permission not granted')
    } else {
      const userLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      })
      const ir = {
        latitude: Number(userLocation.coords.latitude),
        longitude: Number(userLocation.coords.longitude),
        latitudeDelta: 0.06,
        longitudeDelta: 0.06,
      }
      setInitialRegion(ir)
    }
  }

  const loadAllPins = async () => {
    try {
      const pinsArr = []
      const q = query(collection(firestore, 'pins'))

      onSnapshot(q, (querySnapshot) => {
        querySnapshot.forEach((document) => {
          pinsArr.push([
            document.data().coordinates[0],
            document.data().coordinates[1],
            document.data().category,
            document.data().description,
            document.data().picture,
            document.data().video,
            document.data().user,
            new Date(document.data().date.seconds * 1000).toLocaleString(
              'en-US',
            ),
            document.id,
          ])
          setPins(pinsArr)
        })
      })
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
    getLocation()
  }, [])

  const loadNear = async (latLong) => {
    try {
      await Geocoder.from(latLong).then((json) => {
        const addressComponent = json.results[0].formatted_address
        setNear(addressComponent)
      })
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <>
      <MapView
        showsUserLocation
        ref={(map) => {
          setMap(map)
        }}
        style={{ flex: 1 }}
        provider={PROVIDER_GOOGLE}
        initialRegion={initialRegion}
        customMapStyle={mapStyle}
      >
        {pins.map((pin, i) => {
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
          const getUserName = async () => {
            try {
              let pinUserName = ''
              const docRef = doc(firestore, 'users', `${pin[6]}`)
              const docSnap = await getDoc(docRef)

              if (docSnap.exists()) {
                pinUserName = docSnap.data().userName
                setUserName(pinUserName)
              } else {
                console.log('no such document')
              }
            } catch (err) {
              console.log(err)
            }
          }

          return (
            <MapView.Marker
              key={pin[8]}
              coordinate={{
                latitude: pin[0],
                longitude: pin[1],
              }}
              image={icon()}
              zIndex={i}
              onPress={() => {
                setModalData(pin)
                getUserName()
                loadNear([pin[0], pin[1]])
                setModalVisible(true)
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
            {modalData[4] ? (
              <Image
                style={{ height: 249, width: 140 }}
                source={{ uri: modalData[4] }}
              />
            ) : modalData[5] ? (
              <Video
                style={{
                  width: 140,
                  height: 249,
                }}
                source={{
                  uri: modalData[5],
                }}
                useNativeControls
                isLooping
              />
            ) : null}
            <Text style={styles.modalText}>{modalData[3]}</Text>
            <Text style={styles.modalDescriptionText}>{modalData[7]}</Text>
            <Text style={styles.modalDescriptionText}>@{userName}</Text>
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
