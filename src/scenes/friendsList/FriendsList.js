import React, { useState, useEffect, useContext } from 'react'
import { Text, View, StyleSheet, SafeAreaView, FlatList } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { colors, fontSize } from 'theme'
import { getDocs, collection, query, where } from 'firebase/firestore'
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
        const friendSnapshot = await getDocs(q)
        let friendData = []
        const friendsArr = friendSnapshot.forEach((doc) => {
          friendData = doc.get('friendsList')
        })
        setFriends(friendData)
        console.log('FRIENDS', friends)
        setLoading(false)
      } catch (error) {
        console.log('error fetching user friends!', error)
      }
    }
    fetchFriends()
  }, [])

  return (
    <ScreenTemplate>
      <SafeAreaView style={[styles.container]}>
        <FlatList
          data={friends}
          renderItem={({ item }) => (
            <>
              <Text style={[styles.item, { color: colorScheme.text }]}>
                {item.userName}
              </Text>
              <Button label="View Profile" color={colors.primary}>
                View Profile
              </Button>
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
