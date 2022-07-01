import { initializeApp } from 'firebase/app'
// authentication
import { initializeAuth } from 'firebase/auth'
import { getReactNativePersistence } from 'firebase/auth/react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
// firestore
import { getFirestore } from 'firebase/firestore'
// cloud storage
import { getStorage } from 'firebase/storage'

import { firebaseConfig } from '../config'

const firebaseKey = {
  apiKey: firebaseConfig.apiKey,
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket,
  messagingSenderId: firebaseConfig.messagingSenderId,
  appId: firebaseConfig.appId,
  measurementId: firebaseConfig.measurementId,
}

const app = initializeApp(firebaseKey)
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
})
const firestore = getFirestore()
const storage = getStorage()

export { auth, firestore, storage }
