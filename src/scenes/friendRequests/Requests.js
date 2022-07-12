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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRequests() {
      try {
        const requestsRef = collection(firestore, 'friendships')
        const q = query(requestsRef, where('id', '==', `${uid}`))
        const requestSnapshot = await getDocs(q)
        let requestData = []
        requestSnapshot.forEach((document) => {
          requestData = document.get('pendingRequests')
        })
        setPendingRequests(requestData)
        console.log('REQUESTS', pendingRequests)
        setLoading(false)
      } catch (error) {
        console.log('error fetching user requests!', error)
      }
    }
    fetchRequests()
  }, [])

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
