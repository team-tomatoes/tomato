import { initializeApp } from 'firebase/app'
import { initializeAuth } from 'firebase/auth'
import { getReactNativePersistence } from 'firebase/auth/react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

import { config } from '../../secrets'

const firebaseKey = {
  apiKey: config.FIREBASE_API_KEY,
  authDomain: config.FIREBASE_AUTH_DOMAIN,
  projectId: config.FIREBASE_PROJECT_ID,
  storageBucket: config.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: config.FIREBASE_MESSAGING_SENDER_ID,
  appId: config.FIREBASE_APP_ID,
}

const app = initializeApp(firebaseKey)
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
})
const firestore = getFirestore(app)
const storage = getStorage()

export { auth, firestore, storage }
