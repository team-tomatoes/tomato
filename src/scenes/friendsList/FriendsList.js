import React, { useState, useEffect, useContext } from 'react'
import { FlatList, Text, View, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { colors, fontSize } from 'theme'
import { getDocs, collection, query, where } from 'firebase/firestore'
import { firestore } from '../../firebase/config'
import { ColorSchemeContext } from '../../context/ColorSchemeContext'
import { UserDataContext } from '../../context/UserDataContext'
import Button from '../../components/Button'
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
          {/* <Button
            label="Open Modal"
            color={colors.tertiary}
            onPress={() => {
              navigation.navigate('ModalStacks', {
                screen: 'Post',
                params: {
                  data: userData,
                  from: 'Follow screen',
                },
              })
            }}
          /> */}
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

// get all of the current user’s friends list

// const friendsRef = collection(firestore, 'friendships')
// const q = query(friendsRef, where('documentId', '==', `${uid}`))
// const friendSnapshot = await getDocs(q)

// friendSnapshot.forEach((doc) => {
//   console.log(doc.id, ' => ', doc.data())
// })

// const friendsFetch = await getDocs(collection(firestore, 'friendships')).where(
//   'friendsList',
//   '==',
//   `${uid}`,
// )

//         const userDetails = []

//         const querySnapshot = await getDocs(q)

//         querySnapshot.forEach((doc) => {
//           userDetails.push(doc.data())
//           console.log('USER DETAILS', userDetails)
//           console.log(doc.id, ' => ', doc.data())
//         })
//         console.log('QUERY SNAPSHOT', querySnapshot)
//         setFriends(userDetails.friends)

// const friendsFetch = await getDocs(
//   collection(firestore, 'friendships'),
// ).where('friendsList', '==', `${uid}`)

// const friendsCollection = await firestore.collection('friendships')
// const friendsRef = friendsCollection.doc(`${uid}`).get()
