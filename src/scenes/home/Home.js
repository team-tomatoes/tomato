import React, {
  useEffect,
  useState,
  useContext,
} from 'react'
import {
  View,
  StyleSheet,
  TextInput,
  Image,
  KeyboardAvoidingView,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { IconButton, Colors } from 'react-native-paper'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'
import * as Location from 'expo-location'
import {
  doc,
  addDoc,
  getDoc,
  setDoc,
  onSnapshot,
  collection,
} from 'firebase/firestore'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { colors, fontSize } from 'theme'
import { Video, AVPlaybackStatus } from 'expo-av'
import Modal from 'react-native-modal'
import FontIcon from 'react-native-vector-icons/FontAwesome5'
import AntDesign from 'react-native-vector-icons/AntDesign'
import ActionButton from 'react-native-circular-action-menu'
import * as ImageManipulator from 'expo-image-manipulator'
import Button from '../../components/Button'
import { firestore, storage } from '../../firebase/config'
import { UserDataContext } from '../../context/UserDataContext'
import { ColorSchemeContext } from '../../context/ColorSchemeContext'
import ScreenTemplate from '../../components/ScreenTemplate'
import { mapStyle } from '../../constants/mapStyle'

export default function Home() {
  const [location, setLocation] = useState(null)
  const [currLatitude, setLatitude] = useState(null)
  const [currLongitude, setLongitude] = useState(null)
  const [description, setDescription] = useState('')
  const [image, setImage] = useState(null)

  // used for firebase image storage
  const [photo, setPhoto] = useState('')

  const [record, setRecord] = useState(null)
  const video = React.useRef(null)
  const [videoStatus, setStatus] = useState({})
  const [errorMessage, setErrorMessage] = useState(null)
  const navigation = useNavigation()
  const [token, setToken] = useState('')
  const { userData } = useContext(UserDataContext)
  const { scheme } = useContext(ColorSchemeContext)
  const isDark = scheme === 'dark'
  const colorScheme = {
    content: isDark ? styles.darkContent : styles.lightContent,
    text: isDark ? colors.white : colors.primaryText,
  }

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

  const [isModalVisible, setModalVisible] = useState(false)
  const toggleModal = () => {
    setModalVisible(!isModalVisible)
  }

  const showPhotoVideo = () => {
    if (image) {
      return (
        <Image
          style={{
            width: 150,
            height: 225,
            alignSelf: 'center',
          }}
          source={{
            uri: image,
          }}
        />
      )
    }
    if (record) {
      return (
        <Video
          ref={video}
          style={{
            width: 325,
            height: 250,
            alignSelf: 'center',
          }}
          source={{
            uri: record,
          }}
          useNativeControls
          isLooping
          resizeMode="contain"
          onPlaybackStatusUpdate={(status) => setStatus(() => status)}
        />
      )
    }
  }

  useEffect(() => {
    const tokensRef = doc(firestore, 'tokens', userData.id)
    const tokenListner = onSnapshot(tokensRef, (querySnapshot) => {
      if (querySnapshot.exists) {
        const data = querySnapshot.data()
        setToken(data)
        getLocation()
      } else {
        console.log('No such document!')
      }
    })
    return () => tokenListner()
  }, [])

  return (
    <ScreenTemplate>
      <MapView
        style={{ flex: 1 }}
        provider={PROVIDER_GOOGLE}
        region={{
          latitude: Number(currLatitude),
          longitude: Number(currLongitude),
          latitudeDelta: 0.0085,
          longitudeDelta: 0.0085,
        }}
        customMapStyle={mapStyle}
      >
        <MapView.Marker
          coordinate={{
            latitude: Number(currLatitude),
            longitude: Number(currLongitude),
          }}
        >
          <View
            style={{
              backgroundColor: '#007FFF',
              padding: 10,
              borderRadius: 20,
              borderWidth: 4,
              borderColor: 'white',
            }}
          />
        </MapView.Marker>
      </MapView>

      <View style={styles.main}>
        <Button
          label="Drop a Pin"
          color={colors.primary}
          onPress={() => {
            toggleModal()
          }}
        />
        <View>
          <Modal
            isVisible={isModalVisible}
            onBackdropPress={() => setModalVisible(false)}
          >
            <View style={{ backgroundColor: 'white', flex: 0.6 }}>
              <TextInput
                style={styles.textBox}
                placeholder="What's going on here?"
                onChangeText={(newDescription) =>
                  setDescription(newDescription)
                }
                defaultValue={description}
              />
              <View style={styles.iconHorizontal}>
                <IconButton
                  icon="image-plus"
                  color={Colors.grey500}
                  size={30}
                  onPress={() =>
                    navigation.navigate('Camera', {
                      setImage,
                      setModalVisible,
                    })
                  }
                  onPressIn={() => {
                    toggleModal()
                  }}
                />
                <IconButton
                  icon="video-plus"
                  color={Colors.grey500}
                  size={30}
                  // add in a filter option later, not necessary rn tho
                  onPress={() =>
                    navigation.navigate('VidCamera', {
                      setRecord,
                      setModalVisible,
                    })
                  }
                  onPressIn={() => {
                    toggleModal()
                  }}
                />
              </View>
              <View style={styles.imageContainer}>{showPhotoVideo()}</View>
              <View style={{ flex: 1, backgroundColor: '#f3f3f3' }}>
                {/* Rest of App come ABOVE the action button component! */}
                <ActionButton buttonColor="#f07167">
                  <ActionButton.Item
                    buttonColor="#8EECF5"
                    title="Mood"
                    onPress={async () => {
                      try {
                        const docRef = await addDoc(
                          collection(firestore, 'pins'),
                          {
                            category: 'Mood',
                            coordinates: [
                              Number(currLatitude),
                              Number(currLongitude),
                            ],
                            date: new Date(),
                            description,
                            subcategory: '',
                            user: userData.id,
                            video,
                            visibleToOthers: true,
                          },
                        )

                        // If there's an image on state, send the image into the DB
                        if (image) {
                          const actions = []
                          actions.push({ resize: { width: 300 } })
                          const manipulatorResult = await ImageManipulator.manipulateAsync(
                            String(image),
                            actions,
                            {
                              compress: 0.4,
                            },
                          )

                          const localUri = await fetch(manipulatorResult.uri)
                          const localBlob = await localUri.blob()
                          const filename = docRef.id + new Date().getTime()
                          const storageRef = ref(
                            storage,
                            `images/${docRef.id}/${filename}`,
                          )
                          const uploadTask = uploadBytesResumable(
                            storageRef,
                            localBlob,
                          )
                          uploadTask.on(
                            'state_changed',
                            (snapshot) => {
                              const progress =
                                (snapshot.bytesTransferred /
                                  snapshot.totalBytes) *
                                100
                              console.log(`Upload is ${progress}% done`)
                            },
                            (error) => {
                              // Handle unsuccessful uploads
                              console.log(error)
                            },
                            () => {
                              // Handle successful uploads on complete
                              // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                              getDownloadURL(uploadTask.snapshot.ref).then(
                                async (downloadURL) => {
                                  setPhoto(downloadURL)
                                  console.log('File available at', downloadURL)
                                  // get the document we just made so that we can set the image in there as well
                                  const docSnap = await getDoc(docRef)

                                  // if the pin document that we just made, add the picture to that specific pin file
                                  if (docSnap.exists()) {
                                    setDoc(docRef, { photo }, { merge: true })
                                  } else {
                                    // otherwise, the pin does not exist
                                    console.log('No such document!')
                                  }
                                },
                              )
                            },
                          )
                        }
                        // clear description from textbox
                        setDescription('')
                        // remove the image from state so it clears out
                        setImage(null)
                        // close the modal once the transaction is finished
                        toggleModal()
                      } catch (err) {
                        console.log(err)
                      }
                    }}
                  >
                    <AntDesign
                      name="smile-circle"
                      style={styles.actionButtonIconDark}
                    />
                  </ActionButton.Item>
                  <ActionButton.Item
                    buttonColor="#FFCFD2"
                    title="Recommendations"
                    onPress={async () => {
                      try {
                        const docRef = await addDoc(
                          collection(firestore, 'pins'),
                          {
                            category: 'Recommendations',
                            coordinates: [
                              Number(currLatitude),
                              Number(currLongitude),
                            ],
                            date: new Date(),
                            description,
                            subcategory: '',
                            user: userData.id,
                            video,
                            visibleToOthers: true,
                          },
                        )
                        // If there's an image on state, send the image into the DB
                        if (image) {
                          const actions = []
                          actions.push({ resize: { width: 300 } })
                          const manipulatorResult = await ImageManipulator.manipulateAsync(
                            String(image),
                            actions,
                            {
                              compress: 0.4,
                            },
                          )

                          const localUri = await fetch(manipulatorResult.uri)
                          const localBlob = await localUri.blob()
                          const filename = docRef.id + new Date().getTime()
                          const storageRef = ref(
                            storage,
                            `images/${docRef.id}/${filename}`,
                          )
                          const uploadTask = uploadBytesResumable(
                            storageRef,
                            localBlob,
                          )
                          uploadTask.on(
                            'state_changed',
                            (snapshot) => {
                              const progress =
                                (snapshot.bytesTransferred /
                                  snapshot.totalBytes) *
                                100
                              console.log(`Upload is ${progress}% done`)
                            },
                            (error) => {
                              // Handle unsuccessful uploads
                              console.log(error)
                            },
                            () => {
                              // Handle successful uploads on complete
                              // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                              getDownloadURL(uploadTask.snapshot.ref).then(
                                async (downloadURL) => {
                                  setPhoto(downloadURL)
                                  console.log('File available at', downloadURL)
                                  // get the document we just made so that we can set the image in there as well
                                  const docSnap = await getDoc(docRef)

                                  // if the pin document that we just made, add the picture to that specific pin file
                                  if (docSnap.exists()) {
                                    setDoc(docRef, { photo }, { merge: true })
                                  } else {
                                    // otherwise, the pin does not exist
                                    console.log('No such document!')
                                  }
                                },
                              )
                            },
                          )
                        }
                        // clear the download link from state
                        setPhoto('')
                        // clear description from textbox
                        setDescription('')
                        // remove the image from state so it clears out
                        setImage(null)
                        // close the modal once the transaction is finished
                        toggleModal()
                      } catch (err) {
                        console.log(err)
                      }
                    }}
                  >
                    <AntDesign
                      name="star"
                      style={styles.actionButtonIconDark}
                    />
                  </ActionButton.Item>
                  <ActionButton.Item
                    buttonColor="#ffd6a5"
                    title="Animal-Sightings"
                    onPress={async () => {
                      try {
                        const docRef = await addDoc(
                          collection(firestore, 'pins'),
                          {
                            category: 'Animal-Sightings',
                            coordinates: [
                              Number(currLatitude),
                              Number(currLongitude),
                            ],
                            date: new Date(),
                            description,
                            photo: image,
                            subcategory: '',
                            user: userData.id,
                            video,
                            visibleToOthers: true,
                          },
                        )
                        setDescription('')
                      } catch (err) {
                        console.log(err)
                      }
                    }}
                  >
                    <FontIcon name="dog" style={styles.actionButtonIconDark} />
                  </ActionButton.Item>
                  <ActionButton.Item
                    buttonColor="#fdffb6"
                    title="Safety"
                    onPress={async () => {
                      try {
                        const docRef = await addDoc(
                          collection(firestore, 'pins'),
                          {
                            category: 'Safety',
                            coordinates: [
                              Number(currLatitude),
                              Number(currLongitude),
                            ],
                            date: new Date(),
                            description,
                            photo: image,
                            subcategory: '',
                            user: userData.id,
                            video,
                            visibleToOthers: true,
                          },
                        )
                        setDescription('')
                      } catch (err) {
                        console.log(err)
                      }
                    }}
                  >
                    <AntDesign
                      name="warning"
                      style={styles.actionButtonIconDark}
                    />
                  </ActionButton.Item>
                  <ActionButton.Item
                    buttonColor="#B9FBC0"
                    title="Missed-Connections"
                    onPress={async () => {
                      try {
                        const docRef = await addDoc(
                          collection(firestore, 'pins'),
                          {
                            category: 'Missed-Connections',
                            coordinates: [
                              Number(currLatitude),
                              Number(currLongitude),
                            ],
                            date: new Date(),
                            description,
                            photo: image,
                            subcategory: '',
                            user: userData.id,
                            video,
                            visibleToOthers: true,
                          },
                        )
                        setDescription('')
                      } catch (err) {
                        console.log(err)
                      }
                    }}
                  >
                    <FontIcon
                      name="people-arrows"
                      style={styles.actionButtonIconDark}
                    />
                  </ActionButton.Item>
                  <ActionButton.Item
                    buttonColor="#CFBAF0"
                    title="Meetups"
                    onPress={async () => {
                      try {
                        const docRef = await addDoc(
                          collection(firestore, 'pins'),
                          {
                            category: 'Meetups',
                            coordinates: [
                              Number(currLatitude),
                              Number(currLongitude),
                            ],
                            date: new Date(),
                            description,
                            photo: image,
                            subcategory: '',
                            user: userData.id,
                            video,
                            visibleToOthers: true,
                          },
                        )
                        setDescription('')
                      } catch (err) {
                        console.log(err)
                      }
                    }}
                  >
                    <FontIcon
                      name="hand-peace"
                      style={styles.actionButtonIconDark}
                    />
                  </ActionButton.Item>
                </ActionButton>
              </View>
            </View>
          </Modal>
        </View>
      </View>
    </ScreenTemplate>
  )
}

const styles = StyleSheet.create({
  // imageContainer: {
  //   position: 'absolute',
  // },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
  actionButtonIconDark: {
    fontSize: 20,
    height: 22,
    color: 'black',
  },
  lightContent: {
    backgroundColor: colors.lightyellow,
    padding: 20,
    borderRadius: 5,
    marginTop: 30,
    marginLeft: 30,
    marginRight: 30,
  },
  darkContent: {
    backgroundColor: colors.gray,
    padding: 20,
    borderRadius: 5,
    marginTop: 30,
    marginLeft: 30,
    marginRight: 30,
  },
  main: {
    flex: 0.15,
    width: '100%',
    alignContent: 'center',
  },
  textBox: {
    height: 90,
    borderColor: 'gray',
    borderWidth: 1,
    backgroundColor: 'white',
    width: '100%',
    padding: 15,
  },
  title: {
    fontSize: fontSize.xxxLarge,
    marginBottom: 20,
    textAlign: 'center',
  },
  field: {
    fontSize: fontSize.middle,
    textAlign: 'center',
  },
  iconHorizontal: {
    paddingHorizontal: 120,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
})
