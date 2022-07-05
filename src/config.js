// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { config } from '../secrets'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: config.FIREBASE_API_KEY,
  authDomain: config.FIREBASE_AUTH_DOMAIN,
  projectId: config.FIREBASE_PROJECT_ID,
  storageBucket: config.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: config.FIREBASE_MESSAGING_SENDER_ID,
  appId: config.FIREBASE_APP_ID,
}

const defaultAvatar =
  'https://firebasestorage.googleapis.com/v0/u/tomato-d9ece.appspot.com/tomatoicon.png'

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)

// const firebaseKey = {
//   apiKey: "AIzaSyAbynvh81TkAmQE2lBY8JEDOVpNaHZOozU",
//   authDomain: "expo-boilerplate-v2.firebaseapp.com",
//   projectId: "expo-boilerplate-v2",
//   storageBucket: "expo-boilerplate-v2.appspot.com",
//   messagingSenderId: "852442919227",
//   appId: "1:852442919227:web:313aba2cd455b34701871e",
//   measurementId: "G-1894ZG59D5"
// }

const eulaLink =
  'https://github.com/kiyohken2000/ReactNative-Expo-Firebase-Boilerplate-v2'

export { defaultAvatar, firebaseConfig, eulaLink }
