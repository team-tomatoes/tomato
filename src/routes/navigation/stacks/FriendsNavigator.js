import React, { useContext } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { useNavigation } from '@react-navigation/native'
import { IconButton, Colors } from 'react-native-paper'
import { ColorSchemeContext } from '../../../context/ColorSchemeContext'
import { UserDataContext } from '../../../context/UserDataContext'
import { lightProps, darkProps } from './navigationProps/navigationProps'
import HeaderStyle from './headerComponents/HeaderStyle'
import { FollowFollowerNavigator } from '../toptabs/followfollowerNavigator'

import Searchbar from '../../../scenes/friendRequests/Searchbar'

const Stack = createStackNavigator()
const RootStack = createStackNavigator()

export const FriendsNavigator = () => {
  const navigation = useNavigation()
  const { scheme } = useContext(ColorSchemeContext)
  const { userData } = useContext(UserDataContext)
  const navigationProps = darkProps

  const headerLeftPress = () => {
    navigation.navigate('Home')
  }

  const headerRightPress = () => {
    navigation.navigate('Find Friends')
  }

  return (
    <Stack.Navigator screenOptions={navigationProps}>
      <RootStack.Group>
        <Stack.Screen
          name="Friends"
          // filtered for friends
          component={FollowFollowerNavigator}
          options={({ navigation }) => ({
            headerBackground: () => <HeaderStyle />,
            headerRight: () => (
              <IconButton
                icon="account-multiple-plus"
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
          })}
        />
        <Stack.Screen
          name="Find Friends"
          component={Searchbar}
        />
      </RootStack.Group>
    </Stack.Navigator>
  )
}
