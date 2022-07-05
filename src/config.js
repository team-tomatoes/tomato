// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyC9SB_2B_Ffzdw1y_qn17Vdk15puWszjBk',
  authDomain: 'tomato-d9ece.firebaseapp.com',
  projectId: 'tomato-d9ece',
  storageBucket: 'tomato-d9ece.appspot.com',
  messagingSenderId: '764902374604',
  appId: '1:764902374604:web:d6ead29ee682cb54301669',
  measurementId: 'G-3N394GK8Y1',
}

const defaultAvatar = 'https://firebasestorage.googleapis.com/v0/u/tomato-d9ece.appspot.com/tomatoicon.png'

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

const eulaLink = 'https://github.com/kiyohken2000/ReactNative-Expo-Firebase-Boilerplate-v2'

export { defaultAvatar, firebaseConfig, eulaLink }
