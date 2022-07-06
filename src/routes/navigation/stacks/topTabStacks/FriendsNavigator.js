import React, { useContext } from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import Follow from '../../../../scenes/friendsList'

const Stack = createStackNavigator()

export const FriendsNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={({ route, navigation }) => ({
        headerShown: false,
      })}
    >
      <Stack.Screen name="Friends List" component={Follow} />
    </Stack.Navigator>
  )
}
