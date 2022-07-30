<img src="https://github.com/team-tomatoes/tomato/blob/main/assets/images/icon-loading.png" width="150" height="150" />
DEMO VIDEO: https://www.youtube.com/watch?v=KxWHyDPIZ5o

## Tomato: Interactive Social Media Map
<div style="display: flex;">
<img src="https://github.com/team-tomatoes/tomato/blob/main/assets/images/readme/create-pin.gif" width="250">
<img src="https://github.com/team-tomatoes/tomato/blob/main/assets/images/readme/view-pins.gif" width="250">
<img src="https://github.com/team-tomatoes/tomato/blob/main/assets/images/readme/friends.gif" width="250">
</div>

# About

Tomato is a new and unique way to connect live with your friends and your community. Tomato allows you to drop a pin to your precise location with a message, a photo, or a video to broadcast events to your friends and the world. 

## Getting Started


Download our mobile app on your desktop. Please have <a href="https://apps.apple.com/us/app/xcode/id497799835?mt=12">Xcode</a> downloaded to experience Tomato on an iOS simulator or use Expo Go to view directly on mobile.

```
git clone git@github.com:team-tomatoes/tomato.git
yarn install
```

Create a file called secrets.js and import your Firestore config: 

```
const config = {
  FIREBASE_API_KEY: "[FIREBASE INFO HERE]",
  FIREBASE_AUTH_DOMAIN: "[FIREBASE INFO HERE]",
  FIREBASE_PROJECT_ID: "[FIREBASE INFO HERE]",
  FIREBASE_STORAGE_BUCKET: "[FIREBASE INFO HERE]",
  FIREBASE_MESSAGING_SENDER_ID: "[FIREBASE INFO HERE]",
  FIREBASE_APP_ID: "[FIREBASE INFO HERE]",
  FIREBASE_MEASUREMENT_ID: "[FIREBASE INFO HERE]"
};

export { config }
```

Create a file called googleAPIKey.js and import your Google Maps API config:

```
const API_KEY = '[API KEY HERE]'
export default APIKey
```

After creating this file, you can start editing or run ```expo start --no-dev --minify``` to view a simulation.

## License

This project is available under the MIT license. See the [LICENSE](https://github.com/kiyohken2000/ReactNative-Expo-Firebase-Boilerplate-v2/blob/master/LICENSE) file for more info.
