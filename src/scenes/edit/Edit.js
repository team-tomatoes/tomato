import React, { useState, useContext } from 'react'
import { Text, View, StyleSheet, Platform, Alert } from 'react-native'
import { doc, updateDoc } from 'firebase/firestore'
import {
  getAuth,
  EmailAuthProvider,
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
} from 'firebase/auth'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { Avatar } from 'react-native-elements'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import * as ImagePicker from 'expo-image-picker'
import * as ImageManipulator from 'expo-image-manipulator'
import { useNavigation } from '@react-navigation/native'
import ScreenTemplate from '../../components/ScreenTemplate'
import Button from '../../components/Button'
import TextInputBox from '../../components/TextInputBox'
import { firestore, storage } from '../../firebase/config'
import { colors, fontSize } from '../../theme'
import { UserDataContext } from '../../context/UserDataContext'
import { ColorSchemeContext } from '../../context/ColorSchemeContext'

export default function Edit() {
  const { userData } = useContext(UserDataContext)
  const { scheme } = useContext(ColorSchemeContext)
  const navigation = useNavigation()
  const [fullName, setFullName] = useState(userData.fullName)
  const [progress, setProgress] = useState('')
  const [avatar, setAvatar] = useState(userData.avatar)
  const [userName, setUserName] = useState(userData.userName)
  const [newEmail, setNewEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const isDark = scheme === 'dark'
  const colorScheme = {
    text: isDark ? colors.white : colors.primaryText,
    progress: isDark ? styles.darkprogress : styles.progress,
  }

  const ImageChoiceAndUpload = async () => {
    try {
      if (Platform.OS === 'ios') {
        const {
          status,
        } = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (status !== 'granted') {
          // eslint-disable-next-line no-alert
          alert('Permission is required for use.')
          return
        }
      }
      const result = await ImagePicker.launchImageLibraryAsync()
      if (!result.cancelled) {
        const actions = []
        actions.push({ resize: { width: 300 } })
        const manipulatorResult = await ImageManipulator.manipulateAsync(
          result.uri,
          actions,
          {
            compress: 0.4,
          },
        )
        const localUri = await fetch(manipulatorResult.uri)
        const localBlob = await localUri.blob()
        const filename = userData.id + new Date().getTime()
        const storageRef = ref(storage, `avatar/${userData.id}/${filename}`)
        const uploadTask = uploadBytesResumable(storageRef, localBlob)
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            setProgress(`${parseInt(progress)}%`)
          },
          (error) => {
            console.log(error)
            alert('Upload failed.')
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              setProgress('')
              setAvatar(downloadURL)
            })
          },
        )
      }
    } catch (e) {
      console.log('error', e.message)
      alert('The size may be too much.')
    }
  }

  const profileUpdate = async () => {
    try {
      const data = {
        id: userData.id,
        email: userData.email,
        avatar,
        fullName,
        userName,
      }
      const usersRef = doc(firestore, 'users', userData.id)
      await updateDoc(usersRef, data)
      navigation.goBack()
    } catch (e) {
      alert(e)
    }
  }

  const onChangePasswordPress = () => {
    const auth = getAuth()
    const user = auth.currentUser
    const credential = EmailAuthProvider.credential(user.email, currentPassword)
    reauthenticateWithCredential(user, credential)
      .then(() => {
        updatePassword(user, newPassword)
          .then(() => {
            Alert.alert('Password has changed')
            navigation.goBack()
          })
          .catch((error) => {
            Alert.alert('Please provide your current password before changing.')
          })
      })
      .catch((error) => {
        Alert.alert('Oops! Password is incorrect. Please try again.')
      })
  }

  const onChangeEmailPress = () => {
    const auth = getAuth()
    const user = auth.currentUser

    const credential = EmailAuthProvider.credential(user.email, currentPassword)
    reauthenticateWithCredential(user, credential)
      .then(() => {
        updateEmail(user, newEmail).then(async () => {
          const data = { email: newEmail }
          const usersRef = doc(firestore, 'users', userData.id)
          await updateDoc(usersRef, data)
          navigation.goBack()
        })
      })
      .catch((error) => {
        if (currentPassword) {
          Alert.alert('Oops! Password is incorrect. Please try again.')
        } else {
          Alert.alert(
            'Please enter your current password to change your email.',
          )
        }
      })
  }

  return (
    <ScreenTemplate>
      <KeyboardAwareScrollView
        style={styles.main}
        keyboardShouldPersistTaps="always"
      >
        <View style={styles.avatar}>
          <Avatar
            size="xlarge"
            rounded
            onPress={ImageChoiceAndUpload}
            source={{ uri: avatar }}
          />
        </View>
        <Text style={colorScheme.progress}>{progress}</Text>
        <Text style={[styles.field, { color: colorScheme.text }]}>Name:</Text>
        <TextInputBox
          placeholder="Change name"
          onChangeText={(text) => setFullName(text)}
          value={fullName}
          autoCapitalize="words"
        />
        <Text style={[styles.field, { color: colorScheme.text }]}>
          Username:
        </Text>
        <TextInputBox
          placeholder={userData.userName}
          onChangeText={(text) => setUserName(text)}
          value={userName}
          autoCapitalize="none"
        />
        <Button
          label="Update"
          color={colors.primary}
          onPress={profileUpdate}
          disable={!fullName}
        />
        <Text style={[styles.underButtonField, { color: colorScheme.text }]}>
          Password:
        </Text>
        <TextInputBox
          placeholder="Current Password"
          onChangeText={(text) => setCurrentPassword(text)}
          value={userData.password}
          autoCapitalize="none"
          secureTextEntry={true}
        />
        <TextInputBox
          placeholder="New Password"
          onChangeText={(text) => setNewPassword(text)}
          value={userData.password}
          autoCapitalize="none"
          secureTextEntry={true}
        />
        <Button
          label="Change Password"
          color={colors.primary}
          onPress={onChangePasswordPress}
        />
        <Text style={[styles.underButtonField, { color: colorScheme.text }]}>
          Email:
        </Text>
        <TextInputBox
          placeholder={userData.email}
          onChangeText={(text) => setNewEmail(text)}
          value={newEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <Button
          label="Change Email"
          color={colors.primary}
          onPress={onChangeEmailPress}
        />
      </KeyboardAwareScrollView>
    </ScreenTemplate>
  )
}

const styles = StyleSheet.create({
  progress: {
    alignSelf: 'center',
  },
  darkprogress: {
    alignSelf: 'center',
    color: colors.white,
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
  underButtonField: {
    marginTop: 20,
    fontSize: fontSize.middle,
    textAlign: 'center',
  },
  avatar: {
    margin: 30,
    alignSelf: 'center',
  },
})
