import React, { useContext } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import Requests from '../../../../scenes/friendRequests/Requests'

const Stack = createStackNavigator()

export const RequestsNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={({ route, navigation }) => ({
        headerShown: false,
      })}
    >
      <Stack.Screen name="Requests" component={Requests} />
    </Stack.Navigator>
  )
}
