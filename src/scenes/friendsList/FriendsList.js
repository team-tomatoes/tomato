import React, { useState, useEffect, useContext } from 'react'
import { Text, View, StyleSheet, SafeAreaView, FlatList } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { colors, fontSize } from 'theme'
import { getDocs, collection, query, where, doc, updateDoc, onSnapshot } from 'firebase/firestore'
import { firestore } from '../../firebase/config'
import { ColorSchemeContext } from '../../context/ColorSchemeContext'
import { UserDataContext } from '../../context/UserDataContext'
import ScreenTemplate from '../../components/ScreenTemplate'
import Button from '../../components/Button'
import Requests from '../friendRequests/Requests'

export default function Friends() {
  const navigation = useNavigation()
  const { userData } = useContext(UserDataContext)
  const { scheme } = useContext(ColorSchemeContext)
  const isDark = scheme === 'dark'
  const colorScheme = {
    text: isDark ? colors.white : colors.primaryText,
  }
  const uid = userData.id
  const [friends, setFriends] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchFriends() {
      try {
        const friendsRef = collection(firestore, 'friendships')
        const q = query(friendsRef, where('id', '==', `${uid}`))

        let friendData = []
        onSnapshot(q, (querySnapshot) => {
          querySnapshot.forEach((document) => {
            friendData = (document.data().friendsList)
          })
          setFriends(friendData)
        })
        setLoading(false)
      } catch (error) {
        console.log('error fetching user friends!', error)
      }
    }
    fetchFriends()
  }, [])

  const onPressDeleteFriend = async (friendId) => {
    try {
      const friendsListRef = doc(firestore, 'friendships', uid)
      await updateDoc(friendsListRef, {
        friendsList: friends.filter((friend) => friend.id !== friendId),
      })

      const updatedRef = collection(firestore, 'friendships')
      const q = query(updatedRef, where('id', '==', `${uid}`))
      const friendSnapshot = await getDocs(q)
      let friendData = []
      friendSnapshot.forEach((document) => {
        friendData = document.get('friendsList')
      })
      setFriends(friendData)
    } catch (error) {
      alert(error)
    }
  }

  return (
    <ScreenTemplate>
      <SafeAreaView style={[styles.container]}>
        <FlatList
          data={friends}
          renderItem={({ item }) => (
            <>
              <Text style={[styles.item, { color: colorScheme.text }]}>{item.userName}</Text>
              <Button label="View" color={colors.primary}>View</Button>
              <Button label="Delete" color={colors.primary} onPress={() => onPressDeleteFriend(item.id)}>Delete</Button>
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
