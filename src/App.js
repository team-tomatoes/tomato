import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import { Provider } from 'react-redux'
import store from 'utils/store'
import 'utils/ignore'
import { imageAssets } from 'theme/images'
import { fontAssets } from 'theme/fonts'
import { ColorSchemeContextProvider } from './context/ColorSchemeContext'
import { UserDataContextProvider } from './context/UserDataContext'

import Router from './routes'

const App = () => {
  const [didLoad, setDidLoad] = useState(false)

  const handleLoadAssets = async () => {
    await Promise.all([...imageAssets, ...fontAssets])
    setDidLoad(true)
  }

  useEffect(() => {
    handleLoadAssets()
  }, [])

  if (!didLoad) return <View />
  return (
    <Provider store={store}>
      <ColorSchemeContextProvider>
        <UserDataContextProvider>
          <Router />
        </UserDataContextProvider>
      </ColorSchemeContextProvider>
    </Provider>
  )
}

export default App
