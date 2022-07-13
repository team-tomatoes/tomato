import React, { useState, useEffect, useContext } from 'react'
import { Text, View, StyleSheet, SafeAreaView, FlatList } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { colors, fontSize } from 'theme'
import { getDocs, collection, query, where, doc, updateDoc, onSnapshot, arrayUnion, arrayRemove } from 'firebase/firestore'
import { firestore } from '../../firebase/config'
import { ColorSchemeContext } from '../../context/ColorSchemeContext'
import { UserDataContext } from '../../context/UserDataContext'
import ScreenTemplate from '../../components/ScreenTemplate'
import Button from '../../components/Button'

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

  const updateUserFriends = async (friendObj) => {
    try {
      const friendsListRef = doc(firestore, 'friendships', uid)
      await updateDoc(friendsListRef, {
        friendsList: arrayRemove(friendObj),
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

  const updateDeletedFriend = async (friendObj) => {
    const deletedFriendRef = doc(firestore, 'friendships', friendObj.id)
    await updateDoc(deletedFriendRef, {
      friendsList: arrayRemove({ id: uid, userName: userData.userName }),
    })
  }

  const onPressDeleteFriend = async (friendObj) => {
    await updateUserFriends(friendObj)
    await updateDeletedFriend(friendObj)
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
              <Button label="Delete" color={colors.primary} onPress={() => onPressDeleteFriend(item)}>Delete</Button>
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
