import React from 'react'
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native'
import { fontSize, colors } from '../theme'

export default function (props) {
  const { label, onPress, color, disable } = props

  if (disable) {
    return (
      <View style={[styles.button, { backgroundColor: color, opacity: 0.3 }]}>
        <Text style={styles.buttonText}>{label}</Text>
      </View>
    )
  }

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: color }]}
      onPress={onPress}
    >
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    marginLeft: 10,
    marginRight: 10,
    marginTop: 20,
    height: 48,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderWidth: 0.5,
  },
  buttonText: {
    color: colors.white,
    fontSize: fontSize.large,
  },
})
