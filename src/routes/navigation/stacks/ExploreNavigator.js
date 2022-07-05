import React, { useContext } from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import { ColorSchemeContext } from '../../../context/ColorSchemeContext'
import { UserDataContext } from '../../../context/UserDataContext'

import { lightProps, darkProps } from './navigationProps/navigationProps'
import HeaderStyle from './headerComponents/HeaderStyle'
import HeaderRightButton from '../../../components/HeaderRightButton'

const Stack = createStackNavigator()
const RootStack = createStackNavigator()

export const ExploreNavigator = () => {
  const { scheme } = useContext(ColorSchemeContext)
  const { userData } = useContext(UserDataContext)
  const navigationProps = scheme === 'dark' ? darkProps : lightProps

  return (
    <Stack.Navigator screenOptions={navigationProps}>
      {/* <RootStack.Group>

      </RootStack.Group> */}
    </Stack.Navigator>
  )
}
