import React, { useState, useContext } from 'react'
import { Text, View, StyleSheet, LogBox } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { doc, getDoc } from 'firebase/firestore'
import Spinner from 'react-native-loading-spinner-overlay'
import { useNavigation } from '@react-navigation/native'
import { signInWithEmailAndPassword } from 'firebase/auth'
import ScreenTemplate from '../../components/ScreenTemplate'
import Button from '../../components/Button'
import TextInputBox from '../../components/TextInputBox'
import Logo from '../../components/Logo'
import { firestore, auth } from '../../firebase/config'
import { colors, fontSize } from '../../theme'
import { ColorSchemeContext } from '../../context/ColorSchemeContext'

LogBox.ignoreLogs(['Setting a timer'])

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [spinner, setSpinner] = useState(false)
  const navigation = useNavigation()
  const { scheme } = useContext(ColorSchemeContext)
  const isDark = scheme === 'dark'
  const colorScheme = {
    text: colors.primaryText,
  }

  const onFooterLinkPress = () => {
    navigation.navigate('Registration')
  }

  const onLoginPress = async () => {
    try {
      setSpinner(true)
      const response = await signInWithEmailAndPassword(auth, email, password)
      const { uid } = response.user
      const usersRef = doc(firestore, 'users', uid)
      const firestoreDocument = await getDoc(usersRef)
      if (!firestoreDocument.exists) {
        setSpinner(false)
        alert('User does not exist anymore.')
        return
      }
    } catch (error) {
      setSpinner(false)
      alert(error)
    }
  }

  return (
    <ScreenTemplate>
      <KeyboardAwareScrollView
        style={styles.main}
        keyboardShouldPersistTaps="always"
      >
        <Logo />
        <TextInputBox
          placeholder="E-mail"
          onChangeText={(text) => setEmail(text)}
          autoCapitalize="none"
          value={email}
          keyboardType="email-address"
          style={{ color: 'white' }}
        />
        <TextInputBox
          secureTextEntry
          placeholder="Password"
          onChangeText={(text) => setPassword(text)}
          value={password}
          autoCapitalize="none"
        />
        <Button
          label="Log in"
          color={colors.primary}
          onPress={() => onLoginPress()}
        />
        <View style={styles.footerView}>
          <Text style={[styles.footerText, { color: colorScheme.text }]}>
            Don't have an account?
          </Text>
          <Text onPress={onFooterLinkPress} style={styles.footerLink}>
            Sign up
          </Text>
        </View>
      </KeyboardAwareScrollView>
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
  footerView: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
    justifyContent: 'space-between',
  },
  footerText: {
    marginTop: 30,
    fontSize: fontSize.large,
    justifyContent: 'space-between',
  },
  footerLink: {
    marginTop: 20,
    color: colors.redLight,
    fontWeight: 'bold',
    fontSize: fontSize.large,
  },
  textInput: {
    color: 'white',
  },
})
