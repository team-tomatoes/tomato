import React, { useState, useContext, useEffect } from 'react'
import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack'
import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'
import { setDoc, doc } from 'firebase/firestore'
import { firestore } from '../../../firebase/config'
import { UserDataContext } from '../../../context/UserDataContext'
import { ModalStacks } from '../stacks/ModalStacks/ModalStacks'
import TabNavigator from '../tabs/Tabs'

const Stack = createStackNavigator()

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
})

export default function RootStack() {
  const { userData } = useContext(UserDataContext)

  useEffect(() => {
    ;(async () => {
      const isDevice = Device.isDevice
      if (!isDevice) return
      const {
        status: existingStatus,
      } = await Notifications.getPermissionsAsync()
      let finalStatus = existingStatus
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync()
        finalStatus = status
      }
      if (finalStatus !== 'granted') {
        return
      }
      const token = await Notifications.getExpoPushTokenAsync()
      const tokensRef = doc(firestore, 'tokens', userData.id)
      await setDoc(tokensRef, {
        token: token.data,
        id: userData.id,
      })
    })()
  }, [userData])

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="HomeRoot" component={TabNavigator} />
      <Stack.Group
        screenOptions={{
          presentation: 'modal',
          headerShown: false,
          gestureEnabled: true,
          cardOverlayEnabled: true,
          ...TransitionPresets.ModalPresentationIOS,
        }}
      >
        <Stack.Screen name="ModalStacks" component={ModalStacks} />
      </Stack.Group>
    </Stack.Navigator>
  )
}
