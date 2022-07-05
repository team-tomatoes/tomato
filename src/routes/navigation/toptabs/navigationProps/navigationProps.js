import { colors } from 'theme'
import { Platform } from 'react-native'

const labelSize = Platform.select({
  ios: 14,
  android: 12,
})

const screenOptions = {
  tabBarLabelStyle: {
    fontSize: labelSize,
  },
  tabBarActiveTintColor: colors.primary,
  tabBarInactiveTintColor: colors.grayLight,
  tabBarShowLabel: true,
}

export { screenOptions }
