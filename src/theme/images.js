import { Asset } from 'expo-asset'

import Logo from '../../assets/images/icon.png'

export const svgs = {
  logo: Logo,
}

export const images = {
  logo_sm: require('../../assets/images/icon.png'),
  logo_lg: require('../../assets/images/icon.png'),
}

export const imageAssets = Object.keys(images).map((key) =>
  Asset.fromModule(images[key]).downloadAsync(),
)
