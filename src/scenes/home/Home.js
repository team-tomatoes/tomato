import React, { useEffect, useState, useContext, useLayoutEffect } from 'react'
import { Text, View, ScrollView, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { IconButton, Colors } from 'react-native-paper'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import * as Location from 'expo-location'
import { doc, onSnapshot } from 'firebase/firestore'
import { colors, fontSize } from 'theme'
import Button from '../../components/Button'
import { firestore } from '../../firebase/config'
import { UserDataContext } from '../../context/UserDataContext'
import { ColorSchemeContext } from '../../context/ColorSchemeContext'
import ScreenTemplate from '../../components/ScreenTemplate'

export default function Home() {
  const [location, setLocation] = useState(null)
  const [currLatitude, setLatitude] = useState(null)
  const [currLongitude, setLongitude] = useState(null)
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

  const headerButtonPress = () => {
    alert('Tapped header button')
  }

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync()
    if (status !== 'granted') {
      setErrorMessage('Permission not granted')
    } else {
      const userLocation = await Location.getCurrentPositionAsync({})
      console.log(userLocation)
      setLatitude(Number(userLocation.coords.latitude))
      setLongitude(Number(userLocation.coords.longitude))
      setLocation(userLocation)
    }
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      // headerRight: () => (
      // <IconButton
      //   icon="cast"
      //   color={Colors.blue500}
      //   size={24}
      //   onPress={() => headerButtonPress()}
      // />
      // ),
    })
  }, [navigation])

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
      />

      <ScrollView style={styles.main}>
        {/* <View style={colorScheme.content}>
          <Text style={[styles.field, { color: colorScheme.text }]}>Mail:</Text>
          <Text style={[styles.title, { color: colorScheme.text }]}>
            {userData.email}
          </Text>
          {token ? (
            <>
              <Text style={[styles.field, { color: colorScheme.text }]}>
                Expo push token:
              </Text>
              <Text style={[styles.title, { color: colorScheme.text }]}>
                {token.token}
              </Text>
            </>
          ) : null}
        </View> */}
        <Text>{JSON.stringify(location)}</Text>
        <Text>{Number(currLatitude)}</Text>
        <Text>{Number(currLongitude)}</Text>
        <Button
          label="Drop a Pin"
          color={colors.primary}
          // Change onpress function to open a text field and image/video option
          onPress={() =>
            navigation.navigate('Detail', {
              userData,
              from: 'Home',
              title: userData.email,
            })
          }
        />
        {/* <Button
          label="Open Modal"
          color={colors.tertiary}
          onPress={() => {
            navigation.navigate('ModalStacks', {
              screen: 'Post',
              params: {
                data: userData,
                from: 'Home screen',
              },
            })
          }}
        /> */}
      </ScrollView>
    </ScreenTemplate>
  )
}

const styles = StyleSheet.create({
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
    flex: 1,
    width: '100%',
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
})
