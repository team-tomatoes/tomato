/* eslint-disable no-extra-semi */
import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { Camera, CameraType } from 'expo-camera'
import { MaterialIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'

export default function VidCamera({ route }) {
  const [cameraRef, setCameraRef] = useState(null)
  const [record, setRecord] = useState(null)
  const [hasAudioPermission, setHasAudioPermission] = useState(null)
  const [hasCameraPermission, setHasCameraPermission] = useState(null)
  const [type, setType] = useState(CameraType.back)
  const [toggleOn, setToggleOn] = useState(false)
  const navigation = useNavigation()

  useEffect(() => {
    ;(async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync()
      setHasCameraPermission(cameraStatus.status === 'granted')
      const audioStatus = await Camera.requestMicrophonePermissionsAsync()
      setHasAudioPermission(audioStatus.status === 'granted')
    })()
  }, [])

  if (hasCameraPermission === null || hasAudioPermission === null) {
    return <View />
  }
  if (hasCameraPermission === false || hasAudioPermission === false) {
    return <Text>No access to camera</Text>
  }

  const takeVideo = async () => {
    if (cameraRef) {
      const video = await cameraRef.recordAsync({
        maxDuration: 10,
      })
      console.log(video)
      route.params.setRecord(video.uri)
    }
  }

  const stopVideo = async () => {
    cameraRef.stopRecording()
  }

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={type}
        ref={(ref) => {
          setCameraRef(ref)
        }}
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setType(
                type === CameraType.back ? CameraType.front : CameraType.back,
              )
            }}
          >
            <MaterialIcons name="flip-camera-ios" size={35} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.takePictureButton}
            onPress={() => {
              if (!toggleOn) {
                takeVideo()
                setToggleOn(true)
              } else {
                stopVideo()
                setToggleOn(false)
                navigation.navigate('Home')
              }
            }}
          >
            <View style={styles.outerCircle}>
              <View
                style={{
                  borderWidth: 2,
                  borderRadius: toggleOn ? '2' : '50',
                  borderColor: 'red',
                  height: toggleOn ? 20 : 40,
                  width: toggleOn ? 20 : 40,
                  backgroundColor: 'red',
                }}
              />
            </View>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    // backgroundColor: 'transparent',
    flexDirection: 'row',
    display: 'flex',
    margin: 20,
    width: '50%',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 0,
  },
  button: {
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  outerCircle: {
    borderWidth: 2,
    borderRadius: 50,
    borderColor: 'white',
    height: 50,
    width: 50,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    // marginBottom: 16,
    // marginTop: 16,
  },
  takePictureButton: {
    // display: 'flex',
    // alignItems: 'center',
  },
})
