import React, { Component, StyleSheet, View, Image, Text } from 'react-native'
import ActionButton from 'react-native-circular-action-menu'
import { TouchableOpacity } from 'react-native-gesture-handler'
import FontIcon from 'react-native-vector-icons/FontAwesome5'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { Icon } from 'react-native-elements'
import { defaultIcons } from '../scenes/PinData/PinData'

export const EmojiMenu = () => {
  return (
    <View style={{ flex: 1, backgroundColor: '#f3f3f3' }}>
      {/* Rest of App come ABOVE the action button component! */}
      <ActionButton buttonColor="rgba(231,76,60,1)">
        <ActionButton.Item
          buttonColor="#9b59b6"
          title="New Task"
          onPress={() => console.log('notes tapped!')}
        >
          <AntDesign name="smile-circle" style={styles.actionButtonIcon} />
        </ActionButton.Item>
        <ActionButton.Item
          buttonColor="#3498db"
          title="Notifications"
          onPress={() => {}}
        >
          <AntDesign
            name="star"
            style={styles.actionButtonIcon}
          />
        </ActionButton.Item>
        <ActionButton.Item
          buttonColor="#1abc9c"
          title="All Tasks"
          onPress={() => {}}
        >
          <FontIcon name="dog" style={styles.actionButtonIcon} />
        </ActionButton.Item>
        <ActionButton.Item
          buttonColor="#3498db"
          title="Notifications"
          onPress={() => {}}
        >
          <AntDesign name="warning" style={styles.actionButtonIcon} />
        </ActionButton.Item>
        <ActionButton.Item
          buttonColor="#3498db"
          title="Notifications"
          onPress={() => {}}
        >
          <FontIcon
            name="people-arrows"
            style={styles.actionButtonIcon}
          />
        </ActionButton.Item>
        <ActionButton.Item
          buttonColor="#3498db"
          title="Notifications"
          onPress={() => {}}
        >
          <FontIcon
            name="hand-peace"
            style={styles.actionButtonIcon}
          />
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
})
