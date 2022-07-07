import React, { useState, useEffect, useContext } from 'react'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { Text, View, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { colors, fontSize } from 'theme'
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
  const userId = userData.id
  const [friends, setFriends] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchFriends() {
      try {
        // const querySnapshot = await getDocs(collection(firestore, 'users'))
        // querySnapshot.forEach((doc) => {
        //   console.log(doc.id, ' => ', doc.data())
        // })
        // console.log('USER DATA FRIENDS', userData.friends)

        const usersRef = collection(firestore, 'users')
        const q = query(usersRef, where('id', '==', `${userId}`))

        const userDetails = []

        const querySnapshot = await getDocs(q)

        querySnapshot.forEach((doc) => {
          userDetails.push(doc.data())
          console.log('USER DETAILS', userDetails)
          // console.log(doc.id, ' => ', doc.data())
        })
        // console.log('QUERY SNAPSHOT', querySnapshot)
        setFriends(userDetails.friends)
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
            Friends List goes here
          </Text>
          <Button
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
          />
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
