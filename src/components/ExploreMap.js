import React, { useEffect, useState } from 'react'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'
import { Alert, Modal, StyleSheet, Text, Pressable, View } from 'react-native'
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
import { firestore } from '../firebase/config'

export const PinnedMap = () => {
  const [pins, setPins] = useState([])
  const [modalVisible, setModalVisible] = useState(false)

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
      })
      setPins(pinsArr)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    loadAllPins()
  }, [])

  return (
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
          <>
            <View style={styles.centeredView}>
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
                    <Text style={styles.modalText}>{pin[2]}, {pin[3]}</Text>
                    <Text style={styles.modalText}>{pin[3]}</Text>
                    <Pressable
                      style={[styles.button, styles.buttonClose]}
                      onPress={() => setModalVisible(!modalVisible)}
                    >
                      <Text style={styles.textStyle}>Close</Text>
                    </Pressable>
                  </View>
                </View>
              </Modal>
              {/* <Pressable
                style={[styles.button, styles.buttonOpen]}
                onPress={() => setModalVisible(true)}
              > */}
              {/* <Text style={styles.textStyle}>Show Modal</Text>
              </Pressable> */}
            </View>
            <MapView.Marker
              key={pin[5]}
              coordinate={{
                latitude: pin[0],
                longitude: pin[1],
              }}
              // description={pin[3]}
              image={icon()}
              onPress={() => {
                setModalVisible(true)
              }}
            />
          </>
        )
      })}
    </MapView>
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
})
