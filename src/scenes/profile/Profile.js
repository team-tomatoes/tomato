import React, { useState, useContext, useEffect } from 'react'
// eslint-disable-next-line object-curly-newline
import { Text, View, StyleSheet, ScrollView } from 'react-native'
import { Avatar } from 'react-native-elements'
import Dialog from 'react-native-dialog'
import Spinner from 'react-native-loading-spinner-overlay'
import { signOut, deleteUser } from 'firebase/auth'
import {
  doc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore'
import { useNavigation } from '@react-navigation/native'
import ScreenTemplate from '../../components/ScreenTemplate'
import Button from '../../components/Button'
import { Restart } from '../../utils/Restart'
import { firestore, auth } from '../../firebase/config'
import { ColorSchemeContext } from '../../context/ColorSchemeContext'
import { UserDataContext } from '../../context/UserDataContext'
import { colors, fontSize } from '../../theme'

export default function Profile() {
  const { userData, setUserData } = useContext(UserDataContext)
  const navigation = useNavigation()
  const [visible, setVisible] = useState(false)
  const [spinner, setSpinner] = useState(false)
  const [pinNumber, setPinNumber] = useState(null)
  const { scheme } = useContext(ColorSchemeContext)
  const isDark = scheme === 'dark'
  const colorScheme = {
    text: isDark ? colors.white : colors.primaryText,
  }

  const loadAllPins = async () => {
    try {
      const myPinsArr = []
      const q = query(
        collection(firestore, 'pins'),
        where('user', '==', userData.id),
      )

      const querySnapshot = await getDocs(q)

      querySnapshot.forEach((document) => {
        myPinsArr.push([document.id])
      })
      setPinNumber(myPinsArr.length)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    loadAllPins()
  }, [])

  const goDetail = () => {
    navigation.navigate('Edit', { userData })
  }

  const onSignOutPress = () => {
    signOut(auth)
      .then(() => {
        setUserData('')
        Restart()
      })
      .catch((error) => {
        console.log(error.message)
      })
  }

  const showDialog = () => {
    setVisible(true)
  }

  const handleCancel = () => {
    setVisible(false)
  }

  const accountDelete = async () => {
    try {
      setSpinner(true)
      const tokensDocumentRef = doc(firestore, 'tokens', userData.id)
      const usersDocumentRef = doc(firestore, 'users', userData.id)
      await deleteDoc(tokensDocumentRef)
      await deleteDoc(usersDocumentRef)
      const user = auth.currentUser
      deleteUser(user)
        .then(() => {
          setSpinner(false)
          signOut(auth).catch((error) => {
            console.log(error.message)
          })
        })
        .catch((error) => {
          setSpinner(false)
          console.log(error)
        })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <ScreenTemplate>
      <ScrollView style={styles.main}>
        <View style={styles.avatar}>
          <Avatar size="xlarge" rounded source={{ uri: userData.avatar }} />
        </View>
        <Text style={[styles.field, { color: colorScheme.text }]}>
          Pin Count:
        </Text>
        <Text style={[styles.title, { color: colorScheme.text }]}>
          {pinNumber} pins
        </Text>
        <Text style={[styles.field, { color: colorScheme.text }]}>
          Username:
        </Text>
        <Text style={[styles.title, { color: colorScheme.text }]}>
          {userData.userName}
        </Text>
        <Text style={[styles.field, { color: colorScheme.text }]}>Name:</Text>
        <Text style={[styles.title, { color: colorScheme.text }]}>
          {userData.fullName}
        </Text>
        <Text style={[styles.field, { color: colorScheme.text }]}>Email:</Text>
        <Text style={[styles.title, { color: colorScheme.text }]}>
          {userData.email}
        </Text>
        <Button label="Edit" color={colors.primary} onPress={goDetail} />
        <Button
          label="Account delete"
          color={colors.tertiary}
          onPress={showDialog}
        />
        <View style={styles.footerView}>
          <Text onPress={onSignOutPress} style={styles.footerLink}>
            Sign out
          </Text>
        </View>
      </ScrollView>
      <Dialog.Container visible={visible}>
        <Dialog.Title>Account delete</Dialog.Title>
        <Dialog.Description>
          Do you want to delete this account? You cannot undo this action.
        </Dialog.Description>
        <Dialog.Button label="Cancel" onPress={handleCancel} />
        <Dialog.Button label="Delete" onPress={accountDelete} />
      </Dialog.Container>
      <Spinner
        visible={spinner}
        textStyle={{ color: colors.white }}
        overlayColor="rgba(0,0,0,0.5)"
      />
    </ScreenTemplate>
  )
}

const styles = StyleSheet.create({
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
  avatar: {
    margin: 30,
    alignSelf: 'center',
  },
  footerView: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  footerLink: {
    color: colors.redLight,
    fontWeight: 'bold',
    fontSize: fontSize.large,
  },
})
