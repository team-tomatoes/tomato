import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { TouchableOpacity, StyleSheet, View } from 'react-native'
import { IconButton, Button, Menu, Divider, Provider } from 'react-native-paper'
import { colors } from '../theme'

export default function HeaderFriendsButton(props) {
  const { from, userData } = props
  const navigation = useNavigation()
  const [visible, setVisible] = React.useState(false)

  const openMenu = () => setVisible(true)

  const closeMenu = () => setVisible(false)

  const onButtonPress = () => {
    navigation.navigate('ModalStacks', {
      screen: 'Post',
      params: {
        data: userData,
        from,
      },
    })
  }

  return (
    <TouchableOpacity style={styles.container} onPress={() => onButtonPress()}>
      <IconButton icon="account-group" color={colors.white} size={24} />
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={<Button onPress={openMenu}>Show menu</Button>}
      >
        <Menu.Item onPress={() => {}} title="Item 1" />
        <Menu.Item onPress={() => {}} title="Item 2" />
        <Divider />
        <Menu.Item onPress={() => {}} title="Item 3" />
      </Menu>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
})
