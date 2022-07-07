import React, { Component, StyleSheet, View, Image, Text } from 'react-native'
import ActionButton from 'react-native-circular-action-menu'
import Icon from 'react-native-vector-icons/Ionicons'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { defaultIcons } from '../scenes/PinData/PinData'

export const EmojiMenu = () => {
  const tomatoEmoji = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          console.log('A Pressed!')
        }}
      >
        <Image
          style={{ width: 50, height: 50 }}
          source={defaultIcons[0].image}
        />
      </TouchableOpacity>
    )
  }
  return (
    <View style={{ flex: 1, backgroundColor: '#f3f3f3' }}>
      {/* Rest of App come ABOVE the action button component! */}
      <ActionButton buttonColor="rgba(231,76,60,1)">
        <View style={styles.container}>
          <TouchableOpacity onPress={() => alert('clicked')}>
            <Image
              style={{ width: 50, height: 50 }}
              source={defaultIcons[1].image}
            />
          </TouchableOpacity>
          <Text>We are just getting started</Text>
        </View>
        {/* <ActionButton.Item
          buttonColor="#9b59b6"
          title="New Task"
          onPress={() => console.log('notes tapped!')}
        >
          <Image src={defaultIcons[0].image} /> */}
        {/* <Icon name="android-create" style={styles.actionButtonIcon} /> */}
        {/* </ActionButton.Item> */}
        {/* <ActionButton.Item
          buttonColor="#3498db"
          title="Notifications"
          onPress={() => {}}
        >
          <Icon
            name="android-notifications-none"
            style={styles.actionButtonIcon}
          />
        </ActionButton.Item>
        <ActionButton.Item
          buttonColor="#1abc9c"
          title="All Tasks"
          onPress={() => {}}
        >
          <Icon name="android-done-all" style={styles.actionButtonIcon} />
        </ActionButton.Item> */}
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
