import React, { useState, useEffect, useContext } from 'react'
import { Text, View, StyleSheet, SafeAreaView, FlatList } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { colors, fontSize } from 'theme'
import { getDocs, collection, query, where, doc, updateDoc } from 'firebase/firestore'
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
  const [requesterFriends, setRequesterFriends] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRequests() {
      try {
        const requestsRef = collection(firestore, 'friendships')
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
        console.log('REQUESTS', pendingRequests)
        console.log('FRIENDS', friends)
        setLoading(false)
      } catch (error) {
        console.log('error fetching user requests!', error)
      }
    }
    fetchRequests()
  }, [])

  const onPressAcceptRequest = async (friendObj) => {
    try {
      const userRequestRef = doc(firestore, 'friendships', uid)
      await updateDoc(userRequestRef, {
        friendsList: [...friends, friendObj],
      })
      await updateDoc(userRequestRef, {
        pendingRequests: pendingRequests.filter((friend) => friend.id !== friendObj.id),
      })

      const updatedRef = collection(firestore, 'friendships')
      const q = query(updatedRef, where('id', '==', `${uid}`))
      const requestSnapshot = await getDocs(q)
      let pendingRequestData = []
      let friendsListData = []
      requestSnapshot.forEach((document) => {
        friendsListData = document.get('friendsList')
        pendingRequestData = document.get('pendingRequests')
      })
      setFriends(friendsListData)
      setPendingRequests(pendingRequestData)
    } catch (error) {
      alert(error)
    }
  }

  const onPressDeleteRequest = async (friendId) => {
    try {
      const requestRef = doc(firestore, 'friendships', uid)
      await updateDoc(requestRef, {
        pendingRequests: pendingRequests.filter((friend) => friend.id !== friendId),
      })

      const updatedRef = collection(firestore, 'friendships')
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
            <>
              <Text style={[styles.item, { color: colorScheme.text }]}>{item.userName}</Text>
              <Button label="Accept" color={colors.primary} onPress={() => onPressAcceptRequest(item)}>Accept</Button>
              <Button label="Remove" color={colors.primary} onPress={() => onPressDeleteRequest(item.id)}>Remove</Button>
            </>
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
})
