import React, { useEffect, useState, useContext, useLayoutEffect } from 'react'
import { StyleSheet, Text, View, Modal, Pressable, Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu'
import { IconButton, Colors } from 'react-native-paper'
import { doc, onSnapshot } from 'firebase/firestore'
import { colors, fontSize } from 'theme'
import { firestore } from '../../firebase/config'
import { UserDataContext } from '../../context/UserDataContext'
import { ColorSchemeContext } from '../../context/ColorSchemeContext'
import ScreenTemplate from '../../components/ScreenTemplate'
import { ExploreMap } from '../../components/ExploreMap'

export default function Explore() {
  const navigation = useNavigation()
  const [token, setToken] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const [visible, setVisible] = useState(false)

  const { userData } = useContext(UserDataContext)
  const { scheme } = useContext(ColorSchemeContext)
  const isDark = scheme === 'dark'
  const colorScheme = {
    content: isDark ? styles.darkContent : styles.lightContent,
    text: isDark ? colors.white : colors.primaryText,
  }

  const headerRightPress = () => {
    alert('Oops we dont have this filter function yet (ಥ﹏ಥ)')
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
      <ExploreMap />
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
