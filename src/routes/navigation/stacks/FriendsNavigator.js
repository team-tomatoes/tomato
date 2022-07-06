import React, { useContext } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { useNavigation } from '@react-navigation/native'
import { View } from 'react-native'
import {
  IconButton,
  Colors,
  Button,
  Menu,
  Divider,
  Provider,
} from 'react-native-paper'
import { ColorSchemeContext } from '../../../context/ColorSchemeContext'
import { UserDataContext } from '../../../context/UserDataContext'
import { lightProps, darkProps } from './navigationProps/navigationProps'
import HeaderStyle from './headerComponents/HeaderStyle'
import { FollowFollowerNavigator } from '../toptabs/followfollowerNavigator'

const Stack = createStackNavigator()
const RootStack = createStackNavigator()

export const FriendsNavigator = () => {
  const navigation = useNavigation()
  const { scheme } = useContext(ColorSchemeContext)
  const { userData } = useContext(UserDataContext)
  const navigationProps = scheme === 'dark' ? darkProps : lightProps

  const [visible, setVisible] = React.useState(false)

  const openMenu = () => setVisible(true)

  const closeMenu = () => setVisible(false)

  const headerLeftPress = () => {
    navigation.navigate('Home')
  }

  return (
    <Stack.Navigator screenOptions={navigationProps}>
      <RootStack.Group>
        <Stack.Screen
          name="Friends"
          component={FollowFollowerNavigator}
          options={({ navigation }) => ({
            headerBackground: scheme === 'dark' ? null : () => <HeaderStyle />,
            headerRight: () => (
              <Provider>
                <Menu
                  visible={visible}
                  onDismiss={closeMenu}
                  anchor={(
                    <Button onPress={openMenu}>
                      <IconButton
                        icon="account-group"
                        color="white"
                        size={24}
                      />
                    </Button>
                  )}
                >
                  <Menu.Item onPress={() => {}} title="Item 1" />
                  <Menu.Item onPress={() => {}} title="Item 2" />
                  <Divider />
                  <Menu.Item onPress={() => {}} title="Item 3" />
                </Menu>
              </Provider>
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
      </RootStack.Group>
    </Stack.Navigator>
  )
}
