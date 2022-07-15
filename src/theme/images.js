import { Asset } from 'expo-asset'

// svg
import Logo from '../../assets/images/icon.png'

export const svgs = {
  logo: Logo,
}

// png/jpeg
export const images = {
  logo_sm: require('../../assets/images/icon.png'),
  logo_lg: require('../../assets/images/icon.png'),
}

// image preloading
export const imageAssets = Object.keys(images).map((key) =>
  Asset.fromModule(images[key]).downloadAsync(),
)
