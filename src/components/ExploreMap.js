import React, { useEffect, useState } from 'react'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'
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
import Geocoder from '../../node_modules/react-native-geocoding'
import APIKey from '../../googleAPIKey'
import { mapStyle } from '../constants/mapStyle'
import { firestore } from '../firebase/config'

export const PinnedMap = () => {
  Geocoder.init(APIKey)

  const [pins, setPins] = useState([])
  const [users, setUsers] = useState([])
  const [userName, setUserName] = useState('')
  const [modalData, setModalData] = useState([])
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
      console.log('USERARR', userArr)
      setUsers(userArr)
      console.log('users state', users)
    } catch (err) {
      console.log(err)
    }
  }

  const findUserName = (userId) => {
    for (let i = 0; i < users.length; i + 1) {
      console.log(users[0])
      if (userId === users[0]) {
        console.log('USER FOUND!!!')
        return users[1]
      }
    }
    console.log('no user found!')
  }

  useEffect(() => {
    loadAllPins()
    loadUsers()
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
  // findUserName('h9ixxxS2yUV4AsJYWUa2pk7f6Q92')
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
          console.log(users)
          return (
            <MapView.Marker
              key={pin[6]}
              coordinate={{
                latitude: pin[0],
                longitude: pin[1],
              }}
              image={icon()}
              onPress={() => {
                setModalData(pin)
                console.log(pin[5])
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
                style={{ height: 250, width: 150 }}
                source={{ uri: modalData[4] }}
              />
            ) : null}
            <Text style={styles.modalText}>{modalData[3]}</Text>
            <Text style={styles.modalText}>{modalData[5]}</Text>
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
