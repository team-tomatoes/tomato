import React, { useState, useContext } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { HomeTitleContext } from '../../../context/HomeTitleContext'
import { ColorSchemeContext } from '../../../context/ColorSchemeContext'
import { lightProps, darkProps } from './navigationProps/navigationProps'
import HeaderStyle from './headerComponents/HeaderStyle'

import MyPins from '../../../scenes/myPins'
import Detail from '../../../scenes/detail'

const Stack = createStackNavigator()

export const MyPinsNavigator = () => {
  const { scheme } = useContext(ColorSchemeContext)
  const navigationProps = scheme === 'dark' ? darkProps : lightProps
  const [title, setTitle] = useState('default title')
  return (
    <HomeTitleContext.Provider
      value={{
        title,
        setTitle,
      }}
    >
      <HomeTitleContext.Consumer>
        {(ctx) => (
          <Stack.Navigator screenOptions={navigationProps}>
            <Stack.Screen
              name="My Pins"
              component={MyPins}
              options={({ navigation }) => ({
                headerBackground:
                  scheme === 'dark' ? null : () => <HeaderStyle />,
              })}
            />
            <Stack.Screen
              name="Detail"
              component={Detail}
              options={{
                title: ctx.title,
                headerBackground:
                  scheme === 'dark' ? null : () => <HeaderStyle />,
              }}
            />
          </Stack.Navigator>
        )}
      </HomeTitleContext.Consumer>
    </HomeTitleContext.Provider>
  )
}
