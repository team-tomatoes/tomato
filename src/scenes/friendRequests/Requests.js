import React, { useEffect, useContext } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { colors, fontSize } from 'theme'
import ScreenTemplate from '../../components/ScreenTemplate'
import { ColorSchemeContext } from '../../context/ColorSchemeContext'

export default function Requests() {
  const { scheme } = useContext(ColorSchemeContext)
  const isDark = scheme === 'dark'
  const colorScheme = {
    text: isDark ? colors.white : colors.primaryText,
  }

  useEffect(() => {
    console.log('Friend Requests screen')
  }, [])

  return (
    <ScreenTemplate>
      <View style={styles.container}>
        <Text style={[styles.field, { color: colorScheme.text }]}>:D</Text>
      </View>
    </ScreenTemplate>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  field: {
    fontSize: fontSize.middle,
    textAlign: 'center',
  },
})
