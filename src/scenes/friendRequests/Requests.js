import React, { useState, useEffect, useContext } from 'react'
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableHighlight,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { colors, fontSize } from 'theme'
import {
  getDocs,
  collection,
  query,
  where,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore'
import { Avatar } from 'react-native-elements'
import { Entypo, Feather } from 'react-native-vector-icons'
import { ColorSchemeContext } from '../../context/ColorSchemeContext'
import { UserDataContext } from '../../context/UserDataContext'
import ScreenTemplate from '../../components/ScreenTemplate'
import Button from '../../components/Button'
import { firestore } from '../../firebase/config'

export default function Requests() {
  const navigation = useNavigation()
  const { userData } = useContext(UserDataContext)
  const { scheme } = useContext(ColorSchemeContext)
  const isDark = scheme === 'dark'
  const colorScheme = {
    text: isDark ? colors.white : colors.primaryText,
  }
  const uid = userData.id
  const [friends, setFriends] = useState([])
  const [pendingRequests, setPendingRequests] = useState([])
  const [avatar, setAvatar] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRequests() {
      try {
        const requestsRef = collection(firestore, 'users')
        const q = query(requestsRef, where('id', '==', `${uid}`))
        const requestSnapshot = await getDocs(q)
        let requestData = []
        let friendsListData = []
        requestSnapshot.forEach((document) => {
          requestData = document.get('pendingRequests')
          friendsListData = document.get('friendsList')
        })
        setPendingRequests(requestData)
        setFriends(friendsListData)

        setLoading(false)
      } catch (error) {
        console.log('error fetching user requests!', error)
      }
    }
    fetchRequests()
  }, [])

  const updateUserFriends = async (friendObj) => {
    try {
      const userRequestRef = doc(firestore, 'users', uid)
      await updateDoc(userRequestRef, {
        friendsList: arrayUnion({
          id: friendObj.id,
          userName: friendObj.userName,
          avatar: friendObj.avatar,
        }),
      })
      await updateDoc(userRequestRef, {
        pendingRequests: arrayRemove(friendObj),
      })

      const updatedRef = collection(firestore, 'users')
      const q = query(updatedRef, where('id', '==', `${uid}`))
      const requestSnapshot = await getDocs(q)
      let pendingRequestData = []
      let friendsListData = []

      requestSnapshot.forEach((document) => {
        pendingRequestData = document.get('pendingRequests')
      })
      setPendingRequests(pendingRequestData)

      requestSnapshot.forEach((document) => {
        friendsListData = document.get('friendsList')
      })
      setFriends(friendsListData)
    } catch (error) {
      alert(error)
    }
  }

  const updateRequesterFriends = async (friendObj) => {
    const requesterRef = doc(firestore, 'users', friendObj.id)
    await updateDoc(requesterRef, {
      friendsList: arrayUnion({
        id: uid,
        userName: userData.userName,
        avatar: userData.avatar,
      }),
    })
  }

  const onPressAcceptRequest = async (friendObj) => {
    await updateRequesterFriends(friendObj)
    await updateUserFriends(friendObj)
    navigation.navigate('Friends List')
  }

  const onPressDeleteRequest = async (friendObj) => {
    try {
      const requestRef = doc(firestore, 'users', uid)
      await updateDoc(requestRef, {
        pendingRequests: arrayRemove(friendObj),
      })

      const updatedRef = collection(firestore, 'users')
      const q = query(updatedRef, where('id', '==', `${uid}`))
      const requestSnapshot = await getDocs(q)
      let requestData = []
      requestSnapshot.forEach((document) => {
        requestData = document.get('pendingRequests')
      })
      setPendingRequests(requestData)
    } catch (error) {
      alert(error)
    }
  }

  return (
    <ScreenTemplate>
      <SafeAreaView style={[styles.container]}>
        <FlatList
          data={pendingRequests}
          renderItem={({ item }) => (
            <View style={styles.userContainer}>
              <View style={styles.listAvatar}>
                <Avatar
                  size="xlarge"
                  rounded
                  source={{
                    uri: item.avatar,
                  }}
                />
              </View>
              <View style={{ marginLeft: 0 }}>
                <Text style={[styles.item, { color: colorScheme.text }]}>
                  {item.userName}
                </Text>
                <View style={styles.buttonContainer}>
                  <TouchableHighlight
                    onPress={() => onPressAcceptRequest(item)}
                  >
                    <View>
                      <Entypo name="check" size={37} color="#74B63E" />
                    </View>
                  </TouchableHighlight>
                  {/* <Button
                    label="Accept"
                    color={colors.primary}
                    onPress={() => onPressAcceptRequest(item)}
                  >
                    Accept
                  </Button> */}
                  <View style={styles.space} />
                  <TouchableHighlight
                    onPress={() => onPressDeleteRequest(item)}
                  >
                    <View>
                      <Entypo name="cross" size={42} color="#FE7A71" />
                    </View>
                  </TouchableHighlight>
                  {/* <Button
                    label="Remove"
                    color={colors.primary}
                    onPress={() => onPressDeleteRequest(item)}
                  >
                    <MaterialIcons name="cancel" size={24} color="red" />
                  </Button> */}
                </View>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      </SafeAreaView>
    </ScreenTemplate>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 50,
    width: '100%',
  },
  item: {
    padding: 20,
    fontSize: 30,
    marginTop: 5,
  },
  button: {
    fontSize: 30,
    textAlign: 'center',
  },
  userContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginRight: 20,
  },
  space: {
    width: 20,
    height: 20,
  },
})
