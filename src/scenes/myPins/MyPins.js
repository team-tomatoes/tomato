import React, { useEffect, useState, useContext, useLayoutEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { IconButton, Colors } from 'react-native-paper'
import { doc, onSnapshot } from 'firebase/firestore'
import { firestore } from '../../firebase/config'
import { UserDataContext } from '../../context/UserDataContext'
import ScreenTemplate from '../../components/ScreenTemplate'
import { MyPinsMap } from '../../components/MyPinsMap'

export default function MyPins() {
  const navigation = useNavigation()
  const [token, setToken] = useState('')
  const { userData } = useContext(UserDataContext)

  const headerRightPress = () => {
    alert('Oops we dont have this filter function yet!')
  }

  const headerLeftPress = () => {
    navigation.navigate('Home')
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          icon="map-search"
          color={Colors.white}
          size={24}
          onPress={() => headerRightPress()}
        />
      ),
      headerLeft: () => (
        <IconButton
          icon="home-map-marker"
          color={Colors.white}
          size={24}
          onPress={() => headerLeftPress()}
        />
      ),
    })
  }, [navigation])

  useEffect(() => {
    const tokensRef = doc(firestore, 'tokens', userData.id)
    const tokenListner = onSnapshot(tokensRef, (querySnapshot) => {
      if (querySnapshot.exists) {
        const data = querySnapshot.data()
        setToken(data)
      } else {
        console.log('No such document!')
      }
    })
    return () => tokenListner()
  }, [])

  return (
    <ScreenTemplate>
      <MyPinsMap />
    </ScreenTemplate>
  )
}
