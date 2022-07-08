import React, { Component, StyleSheet, View, Image, Text } from 'react-native'
import ActionButton from 'react-native-circular-action-menu'
import { TouchableOpacity } from 'react-native-gesture-handler'
import FontIcon from 'react-native-vector-icons/FontAwesome5'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { Icon } from 'react-native-elements'
import Button from './Button'
import { defaultIcons } from '../scenes/PinData/PinData'

export const EmojiMenu = () => {
  return (
    <View style={{ flex: 1, backgroundColor: '#f3f3f3' }}>
      {/* Rest of App come ABOVE the action button component! */}
      <ActionButton buttonColor="#f07167">
        <ActionButton.Item
          buttonColor="#8EECF5"
          title="Mood"
          onPress={() => console.log('notes tapped!')}
        >
          <AntDesign name="smile-circle" style={styles.actionButtonIcon} />
        </ActionButton.Item>
        <ActionButton.Item
          buttonColor="#FFCFD2"
          title="Recommendations"
          onPress={() => {}}
        >
          <AntDesign name="star" style={styles.actionButtonIcon} />
        </ActionButton.Item>
        <ActionButton.Item
          buttonColor="#ffd6a5"
          title="Animal-Sightings"
          onPress={() => {}}
        >
          <FontIcon name="dog" style={styles.actionButtonIcon} />
        </ActionButton.Item>
        <ActionButton.Item
          buttonColor="#fdffb6"
          title="Safety"
          onPress={() => {}}
        >
          <AntDesign name="warning" style={styles.actionButtonIconDark} />
        </ActionButton.Item>
        <ActionButton.Item
          buttonColor="#B9FBC0"
          title="Missed-Connections"
          onPress={() => {}}
        >
          <FontIcon name="people-arrows" style={styles.actionButtonIcon} />
        </ActionButton.Item>
        <ActionButton.Item
          buttonColor="#CFBAF0"
          title="Meetups"
          onPress={() => {}}
        >
          <FontIcon name="hand-peace" style={styles.actionButtonIcon} />
        </ActionButton.Item>
      </ActionButton>
    </View>
  )
}

const styles = StyleSheet.create({
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
  actionButtonIconDark: {
    fontSize: 20,
    height: 22,
    color: '#6c757d',
  },
})
