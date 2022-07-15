import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import Friends from '../../../../scenes/friendsList/FriendsList'

const Stack = createStackNavigator()

export const FriendsNavigator = () => (
  <Stack.Navigator
    screenOptions={({ route, navigation }) => ({
      headerShown: false,
    })}
  >
    <Stack.Screen name="Friends List" component={Friends} />
  </Stack.Navigator>
)
