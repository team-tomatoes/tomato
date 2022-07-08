import React, {
  useEffect,
  useState,
  useRef,
  useContext,
  useLayoutEffect,
} from 'react'
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  TextInput,
  Image,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { IconButton, Colors } from 'react-native-paper'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import * as Location from 'expo-location'
import {
  doc,
  addDoc,
  onSnapshot,
  getFirestore,
  collection,
} from 'firebase/firestore'
import { colors, fontSize } from 'theme'
import { Video, AVPlaybackStatus } from 'expo-av'
import Button from '../../components/Button'
import { firestore } from '../../firebase/config'
import { UserDataContext } from '../../context/UserDataContext'
import { ColorSchemeContext } from '../../context/ColorSchemeContext'
import { EmojiMenu } from '../../components/EmojiMenu'
import ScreenTemplate from '../../components/ScreenTemplate'
import { defaultIcons } from '../PinData/PinData'

export default function Home() {
  const [location, setLocation] = useState(null)
  const [currLatitude, setLatitude] = useState(null)
  const [currLongitude, setLongitude] = useState(null)
  const [description, setDescription] = useState('')
  const [image, setImage] = useState(null)
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
          latitudeDelta: 0.055,
          longitudeDelta: 0.055,
        }}
        // get all pins from db and reflect on map
        annotations={collection(firestore, 'pins')}
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

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 0.5 }}
      >
        <View style={styles.main}>
          <TextInput
            style={styles.textBox}
            placeholder="What's going on here?"
            onChangeText={(newDescription) => setDescription(newDescription)}
            defaultValue={description}
          />
          <Button
            label="Drop a Pin"
            color={colors.primary}
            onPress={async () => {
              try {
                await addDoc(collection(firestore, 'pins'), {
                  category: 'Animal-Sightings',
                  coordinates: [Number(currLatitude), Number(currLongitude)],
                  date: new Date(),
                  description,
                  photo: '',
                  subcategory: 'Rat',
                  user: userData.id,
                  video: '',
                  visibleToOthers: true,
                })
                setDescription('')
              } catch (err) {
                console.log(err)
              }
            }}
          />
          <View>
            <EmojiMenu />
          </View>

          <View style={styles.iconHorizontal}>
            <IconButton
              icon="image-plus"
              color={Colors.grey500}
              size={30}
              // add in a filter option later, not necessary rn tho
              onPress={() =>
                navigation.navigate('Camera', {
                  setImage,
                })
              }
            />
            <IconButton
              icon="video-plus"
              color={Colors.grey500}
              size={30}
              // add in a filter option later, not necessary rn tho
              onPress={() =>
                navigation.navigate('VidCamera', {
                  setRecord,
                })
              }
            />
          </View>
          <View style={styles.imageContainer}>
            {(() => {
              if (image) {
                return (
                  <Image
                    style={{ width: 200, height: 225, alignSelf: 'center' }}
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
                    style={{ width: 320, height: 200, alignSelf: 'center' }}
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
            })()}
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScreenTemplate>
  )
}

const styles = StyleSheet.create({
  // imageContainer: {
  //   position: 'absolute',
  // },
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
    flex: 0.4,
    width: '100%',
    alignContent: 'center',
  },
  textBox: {
    height: 50,
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
