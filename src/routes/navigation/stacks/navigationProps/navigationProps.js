import { colors } from 'theme'

const headerTintColor = 'white'
const fontSize = 18
const headerMode = 'float'

const lightProps = {
  headerTintColor,
  headerStyle: {
    backgroundColor: colors.secondary,
  },
  headerTitleStyle: { fontSize },
  headerMode,
}

const darkProps = {
  headerTintColor,
  headerStyle: {
    backgroundColor: colors.primary,
  },
  headerTitleStyle: { fontSize },
  headerMode,
}

export { lightProps, darkProps }
