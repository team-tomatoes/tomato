import React, { useState, useEffect, useContext } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { colors, fontSize } from 'theme'
import { getDocs, collection, query, where } from 'firebase/firestore'
import { firestore } from '../../firebase/config'
import { ColorSchemeContext } from '../../context/ColorSchemeContext'
import { UserDataContext } from '../../context/UserDataContext'
import ScreenTemplate from '../../components/ScreenTemplate'

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
      <View style={[styles.container]}>
        <View style={{ width: '100%' }}>
          <Text style={[styles.field, { color: colorScheme.text }]}>
            {friends && friends.map((friend) => friend.userName)}
          </Text>
        </View>
      </View>
    </ScreenTemplate>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  field: {
    fontSize: fontSize.middle,
    textAlign: 'center',
  },
})
