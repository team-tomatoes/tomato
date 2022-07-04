import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'

const HeaderStyle = () => (
  <LinearGradient
    colors={['#f07167', '#fed987']}
    style={{ flex: 1 }}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
  />
)

export default HeaderStyle
