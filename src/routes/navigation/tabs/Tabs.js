import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import FontIcon from 'react-native-vector-icons/FontAwesome5'
import { colors } from 'theme'

// stack navigators
import {
  HomeNavigator,
  ProfileNavigator,
  ExploreNavigator,
  MyPinsNavigator,
  FriendsNavigator,
} from '../stacks'

const Tab = createBottomTabNavigator()

const TabNavigator = () => (
  <Tab.Navigator
    options={{
      tabBarStyle: {
        // backgroundColor: 'black',
        // borderTopColor: 'gray',
        // borderTopWidth: 1,
        // paddingBottom: 5,
        // paddingTop: 5,
      },
    }}
    defaultScreenOptions={{
      headerShown: false,
      headerTransparent: true,
    }}
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.gray,
    })}
    initialRouteName="HomeTab"
    swipeEnabled={false}
  >
    <Tab.Screen
      name="HomeTab"
      component={HomeNavigator}
      options={{
        tabBarLabel: 'Home',
        tabBarIcon: ({ color, size }) => (
          <FontIcon name="home" color={color} size={size} />
        ),
      }}
    />
    <Tab.Screen
      name="Explore"
      component={ExploreNavigator}
      options={{
        tabBarLabel: 'Explore',
        tabBarIcon: ({ color, size }) => (
          <FontIcon name="search-location" color={color} size={size} />
        ),
      }}
    />
    <Tab.Screen
      name="FriendsTab"
      component={FriendsNavigator}
      options={{
        tabBarLabel: 'Friends',
        tabBarIcon: ({ color, size }) => (
          <FontIcon name="user-friends" color={color} size={size} />
        ),
      }}
    />
    <Tab.Screen
      name="MyPinsTab"
      component={MyPinsNavigator}
      options={{
        tabBarLabel: 'My Pins',
        tabBarIcon: ({ color, size }) => (
          <FontIcon name="map-marked-alt" color={color} size={size} />
        ),
      }}
    />
    <Tab.Screen
      name="ProfileTab"
      component={ProfileNavigator}
      options={{
        tabBarLabel: 'Profile',
        tabBarIcon: ({ color, size }) => (
          <FontIcon name="user" color={color} size={size} />
        ),
      }}
    />
  </Tab.Navigator>
)

export default TabNavigator
