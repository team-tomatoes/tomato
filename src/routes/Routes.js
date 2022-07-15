import React from 'react'
import { useSelector } from 'react-redux'
import Main from './navigation'
import Initial from '../scenes/initial/Initial'

const Routes = () => {
  const { checked, loggedIn } = useSelector((state) => state.app)

  if (!checked) {
    return <Initial />
  }

  return <Main />
}

export default Routes
