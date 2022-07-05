import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { TouchableOpacity, StyleSheet } from 'react-native'
import FontIcon from 'react-native-vector-icons/FontAwesome5'
import { colors } from '../theme'

export default function HeaderSearchButton(props) {
  const { from, userData } = props
  const navigation = useNavigation()

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
      <FontIcon name="search" color={colors.primary} size={24} />
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
