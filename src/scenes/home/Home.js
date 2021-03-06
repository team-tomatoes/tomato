import React, { useEffect, useState, useContext } from 'react'
import { Alert, View, StyleSheet, TextInput, Image, Modal } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { IconButton, Colors } from 'react-native-paper'
import { Cloudinary, URLConfig } from '@cloudinary/url-gen'
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
import * as FileSystem from 'expo-file-system'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { colors, fontSize } from 'theme'
import { Video } from 'expo-av'
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
  const [description, setDescription] = useState('')
  const [image, setImage] = useState(null)
  const [initialRegion, setInitialRegion] = useState()
  const [mapView, setMap] = useState()

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

  const cld = new Cloudinary({
    cloud: {
      cloudName: 'dupvhcwji',
    },
  })
  const urlConfig = new URLConfig({ secure: true })

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
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }
      setInitialRegion(ir)
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
        showsUserLocation
        ref={(map) => {
          setMap(map)
        }}
        style={{ flex: 1 }}
        provider={PROVIDER_GOOGLE}
        initialRegion={initialRegion}
        customMapStyle={mapStyle}
      />

      <View style={styles.main}>
        <Button
          label="Drop a Pin"
          color={colors.primary}
          onPress={() => {
            toggleModal()
          }}
        />
        <View style={styles.centeredView}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={isModalVisible}
            onBackdropPress={() => setModalVisible(false)}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.')
              setModalVisible(!isModalVisible)
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <IconButton
                  icon="close"
                  color={Colors.grey500}
                  size={25}
                  style={{ marginTop: 0 }}
                  onPress={() => setModalVisible(!isModalVisible)}
                />
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
                    onPressIn={() =>
                      navigation.navigate('Camera', {
                        setImage,
                        setModalVisible,
                      })
                    }
                    onPress={() => {
                      toggleModal()
                    }}
                  />
                  <IconButton
                    icon="video-plus"
                    color={Colors.grey500}
                    size={30}
                    onPressIn={() =>
                      navigation.navigate('VidCamera', {
                        setRecord,
                        setModalVisible,
                      })
                    }
                    onPress={() => {
                      toggleModal()
                    }}
                  />
                  {image || record ? (
                    <IconButton
                      icon="backspace-outline"
                      color="#f07167"
                      size={30}
                      onPress={() => {
                        setImage(null)
                        setRecord(null)
                      }}
                    />
                  ) : null}
                </View>
                <View style={styles.imageContainer}>{showPhotoVideo()}</View>
                <View style={{ marginTop: 60, marginRight: 20 }}>
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
                                Number(initialRegion.latitude),
                                Number(initialRegion.longitude),
                              ],
                              date: new Date(),
                              description,
                              subcategory: '',
                              user: userData.id,
                              visibleToOthers: true,
                            },
                          )
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
                                console.log(error)
                              },
                              () => {
                                getDownloadURL(uploadTask.snapshot.ref).then(
                                  async (downloadURL) => {
                                    console.log(
                                      'File available at',
                                      downloadURL,
                                    )
                                    const docSnap = await getDoc(docRef)
                                    if (docSnap.exists()) {
                                      setDoc(
                                        docRef,
                                        { picture: downloadURL },
                                        { merge: true },
                                      )
                                    } else {
                                      console.log('No such document!')
                                    }
                                  },
                                )
                              },
                            )
                          }

                          if (record) {
                            const fsRead = await FileSystem.readAsStringAsync(
                              record,
                              {
                                encoding: 'base64',
                              },
                            )
                            const base64Vid = `data:video/mp4;base64,${fsRead}`
                            const formData = new FormData()

                            formData.append('file', base64Vid)
                            formData.append('upload_preset', 'tomato')
                            const data = await fetch(
                              'https://api.cloudinary.com/v1_1/dupvhcwji/upload',
                              {
                                method: 'POST',
                                body: formData,
                              },
                            )
                              .then((r) => r.json())
                              .catch((err) => console.log(err))
                            console.log(data.secure_url)
                            const docSnap = await getDoc(docRef)
                            if (docSnap.exists()) {
                              setDoc(
                                docRef,
                                { video: data.secure_url },
                                { merge: true },
                              )
                            } else {
                              console.log('No such document!')
                            }
                          }
                          setDescription('')
                          setImage(null)
                          setRecord(null)
                          navigation.navigate('Explore')
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
                                Number(initialRegion.latitude),
                                Number(initialRegion.longitude),
                              ],
                              date: new Date(),
                              description,
                              subcategory: '',
                              user: userData.id,
                              visibleToOthers: true,
                            },
                          )
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
                                console.log(error)
                              },
                              () => {
                                getDownloadURL(uploadTask.snapshot.ref).then(
                                  async (downloadURL) => {
                                    console.log(
                                      'File available at',
                                      downloadURL,
                                    )
                                    const docSnap = await getDoc(docRef)
                                    if (docSnap.exists()) {
                                      setDoc(
                                        docRef,
                                        { picture: downloadURL },
                                        { merge: true },
                                      )
                                    } else {
                                      console.log('No such document!')
                                    }
                                  },
                                )
                              },
                            )
                          }

                          if (record) {
                            const fsRead = await FileSystem.readAsStringAsync(
                              record,
                              {
                                encoding: 'base64',
                              },
                            )
                            const base64Vid = `data:video/mp4;base64,${fsRead}`
                            const formData = new FormData()

                            formData.append('file', base64Vid)
                            formData.append('upload_preset', 'tomato')
                            const data = await fetch(
                              'https://api.cloudinary.com/v1_1/dupvhcwji/upload',
                              {
                                method: 'POST',
                                body: formData,
                              },
                            )
                              .then((r) => r.json())
                              .catch((err) => console.log(err))
                            const docSnap = await getDoc(docRef)
                            if (docSnap.exists()) {
                              setDoc(
                                docRef,
                                { video: data.secure_url },
                                { merge: true },
                              )
                            } else {
                              console.log('No such document!')
                            }
                          }
                          setDescription('')
                          setImage(null)
                          setRecord(null)
                          navigation.navigate('Explore')
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
                                Number(initialRegion.latitude),
                                Number(initialRegion.longitude),
                              ],
                              date: new Date(),
                              description,
                              subcategory: '',
                              user: userData.id,
                              visibleToOthers: true,
                            },
                          )
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
                                console.log(error)
                              },
                              () => {
                                getDownloadURL(uploadTask.snapshot.ref).then(
                                  async (downloadURL) => {
                                    console.log(
                                      'File available at',
                                      downloadURL,
                                    )
                                    const docSnap = await getDoc(docRef)
                                    if (docSnap.exists()) {
                                      setDoc(
                                        docRef,
                                        { picture: downloadURL },
                                        { merge: true },
                                      )
                                    } else {
                                      console.log('No such document!')
                                    }
                                  },
                                )
                              },
                            )
                          }

                          if (record) {
                            const fsRead = await FileSystem.readAsStringAsync(
                              record,
                              {
                                encoding: 'base64',
                              },
                            )
                            const base64Vid = `data:video/mp4;base64,${fsRead}`
                            const formData = new FormData()

                            formData.append('file', base64Vid)
                            formData.append('upload_preset', 'tomato')
                            const data = await fetch(
                              'https://api.cloudinary.com/v1_1/dupvhcwji/upload',
                              {
                                method: 'POST',
                                body: formData,
                              },
                            )
                              .then((r) => r.json())
                              .catch((err) => console.log(err))
                            console.log(data.secure_url)
                            const docSnap = await getDoc(docRef)
                            if (docSnap.exists()) {
                              setDoc(
                                docRef,
                                { video: data.secure_url },
                                { merge: true },
                              )
                            } else {
                              console.log('No such document!')
                            }
                          }
                          setDescription('')
                          setImage(null)
                          setRecord(null)
                          navigation.navigate('Explore')
                          toggleModal()
                        } catch (err) {
                          console.log(err)
                        }
                      }}
                    >
                      <FontIcon
                        name="dog"
                        style={styles.actionButtonIconDark}
                      />
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
                                Number(initialRegion.latitude),
                                Number(initialRegion.longitude),
                              ],
                              date: new Date(),
                              description,
                              subcategory: '',
                              user: userData.id,
                              visibleToOthers: true,
                            },
                          )
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
                                console.log(error)
                              },
                              () => {
                                getDownloadURL(uploadTask.snapshot.ref).then(
                                  async (downloadURL) => {
                                    console.log(
                                      'File available at',
                                      downloadURL,
                                    )
                                    const docSnap = await getDoc(docRef)
                                    if (docSnap.exists()) {
                                      setDoc(
                                        docRef,
                                        { picture: downloadURL },
                                        { merge: true },
                                      )
                                    } else {
                                      console.log('No such document!')
                                    }
                                  },
                                )
                              },
                            )
                          }

                          if (record) {
                            const fsRead = await FileSystem.readAsStringAsync(
                              record,
                              {
                                encoding: 'base64',
                              },
                            )
                            const base64Vid = `data:video/mp4;base64,${fsRead}`
                            const formData = new FormData()

                            formData.append('file', base64Vid)
                            formData.append('upload_preset', 'tomato')
                            const data = await fetch(
                              'https://api.cloudinary.com/v1_1/dupvhcwji/upload',
                              {
                                method: 'POST',
                                body: formData,
                              },
                            )
                              .then((r) => r.json())
                              .catch((err) => console.log(err))
                            const docSnap = await getDoc(docRef)
                            if (docSnap.exists()) {
                              setDoc(
                                docRef,
                                { video: data.secure_url },
                                { merge: true },
                              )
                            } else {
                              console.log('No such document!')
                            }
                          }
                          setDescription('')
                          setImage(null)
                          setRecord(null)
                          navigation.navigate('Explore')
                          toggleModal()
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
                                Number(initialRegion.latitude),
                                Number(initialRegion.longitude),
                              ],
                              date: new Date(),
                              description,
                              subcategory: '',
                              user: userData.id,
                              visibleToOthers: true,
                            },
                          )
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
                                console.log(error)
                              },
                              () => {
                                getDownloadURL(uploadTask.snapshot.ref).then(
                                  async (downloadURL) => {
                                    console.log(
                                      'File available at',
                                      downloadURL,
                                    )
                                    const docSnap = await getDoc(docRef)
                                    if (docSnap.exists()) {
                                      setDoc(
                                        docRef,
                                        { picture: downloadURL },
                                        { merge: true },
                                      )
                                    } else {
                                      console.log('No such document!')
                                    }
                                  },
                                )
                              },
                            )
                          }

                          if (record) {
                            const fsRead = await FileSystem.readAsStringAsync(
                              record,
                              {
                                encoding: 'base64',
                              },
                            )
                            const base64Vid = `data:video/mp4;base64,${fsRead}`
                            const formData = new FormData()

                            formData.append('file', base64Vid)
                            formData.append('upload_preset', 'tomato')
                            const data = await fetch(
                              'https://api.cloudinary.com/v1_1/dupvhcwji/upload',
                              {
                                method: 'POST',
                                body: formData,
                              },
                            )
                              .then((r) => r.json())
                              .catch((err) => console.log(err))
                            console.log(data.secure_url)
                            const docSnap = await getDoc(docRef)
                            if (docSnap.exists()) {
                              setDoc(
                                docRef,
                                { video: data.secure_url },
                                { merge: true },
                              )
                            } else {
                              console.log('No such document!')
                            }
                          }
                          setDescription('')
                          setImage(null)
                          setRecord(null)
                          toggleModal()
                          navigation.navigate('Explore')
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
                                Number(initialRegion.latitude),
                                Number(initialRegion.longitude),
                              ],
                              date: new Date(),
                              description,
                              subcategory: '',
                              user: userData.id,
                              visibleToOthers: true,
                            },
                          )
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
                                console.log(error)
                              },
                              () => {
                                getDownloadURL(uploadTask.snapshot.ref).then(
                                  async (downloadURL) => {
                                    console.log(
                                      'File available at',
                                      downloadURL,
                                    )
                                    const docSnap = await getDoc(docRef)
                                    if (docSnap.exists()) {
                                      setDoc(
                                        docRef,
                                        { picture: downloadURL },
                                        { merge: true },
                                      )
                                    } else {
                                      console.log('No such document!')
                                    }
                                  },
                                )
                              },
                            )
                          }

                          if (record) {
                            const fsRead = await FileSystem.readAsStringAsync(
                              record,
                              {
                                encoding: 'base64',
                              },
                            )
                            const base64Vid = `data:video/mp4;base64,${fsRead}`
                            const formData = new FormData()

                            formData.append('file', base64Vid)
                            formData.append('upload_preset', 'tomato')
                            const data = await fetch(
                              'https://api.cloudinary.com/v1_1/dupvhcwji/upload',
                              {
                                method: 'POST',
                                body: formData,
                              },
                            )
                              .then((r) => r.json())
                              .catch((err) => console.log(err))
                            console.log(data.secure_url)
                            const docSnap = await getDoc(docRef)
                            if (docSnap.exists()) {
                              setDoc(
                                docRef,
                                { video: data.secure_url },
                                { merge: true },
                              )
                            } else {
                              console.log('No such document!')
                            }
                          }
                          setDescription('')
                          setImage(null)
                          setRecord(null)
                          toggleModal()
                          navigation.navigate('Explore')
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
            </View>
          </Modal>
        </View>
      </View>
    </ScreenTemplate>
  )
}

const styles = StyleSheet.create({
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
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
    padding: 30,
    paddingTop: 5,
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
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
    color: 'black',
  },
  textStyle: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
})
