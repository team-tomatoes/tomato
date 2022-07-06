/* eslint-disable import/prefer-default-export */
import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { screenOptions } from './navigationProps/navigationProps'

import { FollowNavigator } from '../stacks/topTabStacks/FollowNavigator'
import { FollowerNavigator } from '../stacks/topTabStacks/FollowerNavigator'
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
      name="FollowTab"
      component={FollowNavigator}
      options={{ tabBarLabel: 'Follow' }}
    />
    <Tab.Screen
      name="FollowerTab"
      component={FollowerNavigator}
      options={{ tabBarLabel: 'Follower' }}
    />
  </Tab.Navigator>
)
