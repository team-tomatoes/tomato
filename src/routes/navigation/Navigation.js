import 'react-native-gesture-handler'
import React, { useContext } from 'react'
import { NavigationContainer, DarkTheme } from '@react-navigation/native'
import { UserDataContext } from '../../context/UserDataContext'

import { LoginNavigator } from './stacks'
import RootStack from './rootstack/RootStack'

export default function App() {
  const { userData } = useContext(UserDataContext)

  return (
    <NavigationContainer theme={DarkTheme}>
      {userData ? <RootStack /> : <LoginNavigator />}
    </NavigationContainer>
  )
}
