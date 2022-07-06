import React, { useEffect, useContext } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { colors, fontSize } from 'theme'
import { ColorSchemeContext } from '../../context/ColorSchemeContext'
import { UserDataContext } from '../../context/UserDataContext'
import Button from '../../components/Button'
import ScreenTemplate from '../../components/ScreenTemplate'

export default function Friends() {
  const navigation = useNavigation()
  const { userData } = useContext(UserDataContext)
  const { scheme } = useContext(ColorSchemeContext)
  const isDark = scheme === 'dark'
  const colorScheme = {
    text: isDark ? colors.white : colors.primaryText,
  }

  useEffect(() => {
    console.log('Friends List screen')
  }, [])

  return (
    <ScreenTemplate>
      <View style={[styles.container]}>
        <View style={{ width: '100%' }}>
          <Text style={[styles.field, { color: colorScheme.text }]}>
            Friends List goes here
          </Text>
          <Button
            label="Open Modal"
            color={colors.tertiary}
            onPress={() => {
              navigation.navigate('ModalStacks', {
                screen: 'Post',
                params: {
                  data: userData,
                  from: 'Follow screen',
                },
              })
            }}
          />
        </View>
      </View>
    </ScreenTemplate>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  field: {
    fontSize: fontSize.middle,
    textAlign: 'center',
  },
})
