import 'react-native-gesture-handler'
import React, { useContext } from 'react'
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native'
import { ColorSchemeContext } from '../../context/ColorSchemeContext'
import { UserDataContext } from '../../context/UserDataContext'

import { LoginNavigator } from './stacks'
import RootStack from './rootstack/RootStack'

export default function App() {
  const { scheme } = useContext(ColorSchemeContext)
  const { userData } = useContext(UserDataContext)

  return (
    <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      {userData ? <RootStack /> : <LoginNavigator />}
    </NavigationContainer>
  )
}
