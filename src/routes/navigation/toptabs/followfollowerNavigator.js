/* eslint-disable import/prefer-default-export */
import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { screenOptions } from './navigationProps/navigationProps'

import { FriendsNavigator } from '../stacks/topTabStacks/FriendsNavigator'
import { RequestsNavigator } from '../stacks/topTabStacks/RequestsNavigator'
import { PinnedMap } from '../../../components/PinnedMap'

const Tab = createMaterialTopTabNavigator()

export const FollowFollowerNavigator = () => (
  <Tab.Navigator
    initialRouteName="FollowTab"
    screenOptions={screenOptions}
  >
    <Tab.Screen
      name="FriendsMap"
      component={PinnedMap}
      options={{ tabBarLabel: 'Map' }}
    />
    <Tab.Screen
      name="FriendsTab"
      component={FriendsNavigator}
      options={{ tabBarLabel: 'Friends List' }}
    />
    <Tab.Screen
      name="RequestsTab"
      component={RequestsNavigator}
      options={{ tabBarLabel: 'Requests' }}
    />
  </Tab.Navigator>
)
