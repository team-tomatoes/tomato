import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { config } from '../secrets'

const firebaseConfig = {
  apiKey: config.FIREBASE_API_KEY,
  authDomain: config.FIREBASE_AUTH_DOMAIN,
  projectId: config.FIREBASE_PROJECT_ID,
  storageBucket: config.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: config.FIREBASE_MESSAGING_SENDER_ID,
  appId: config.FIREBASE_APP_ID,
}

const defaultAvatar =
  'https://firebasestorage.googleapis.com/v0/b/tomato-d083a.appspot.com/o/avatar%2Ficon.png?alt=media&token=d4edc180-5cbf-4f30-a312-caf689c41846'

const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)

export { defaultAvatar, firebaseConfig }
