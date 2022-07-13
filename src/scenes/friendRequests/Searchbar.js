import React, { useState, useEffect, useContext } from 'react'
import { StyleSheet, SafeAreaView, Text, FlatList } from 'react-native'
import { Searchbar } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import {
  getDocs,
  collection,
  query,
  where,
  doc,
  updateDoc,
} from 'firebase/firestore'
import { colors, fontSize } from 'theme'
import Button from '../../components/Button'
import ScreenTemplate from '../../components/ScreenTemplate'
import { UserDataContext } from '../../context/UserDataContext'
import { ColorSchemeContext } from '../../context/ColorSchemeContext'
import { firestore } from '../../firebase/config'

const SearchBar = () => {
  const navigation = useNavigation()

  const { scheme } = useContext(ColorSchemeContext)
  const isDark = scheme === 'dark'
  const colorScheme = {
    text: isDark ? colors.white : colors.primaryText,
  }
  const { userData } = useContext(UserDataContext)
  const uid = userData.id
  const [searchQuery, setSearchQuery] = useState('')
  const [searchFriend, setSearchFriend] = useState([])
  const [loading, setLoading] = useState(true)

  const onChangeSearch = (userQuery) => setSearchQuery(userQuery)

  const handleSubmit = async () => {
    try {
      const userRef = collection(firestore, 'users')
      const q = query(userRef)
      const searchSnapshot = await getDocs(q)
      const searchData = []
      searchSnapshot.forEach((document) => {
        searchData.push({
          username: document.get('userName'),
          id: document.get('id'),
        })
      })
      const match = await searchData.filter(
        (x) => x.username === `${searchQuery}`,
      )
      setSearchFriend(match)
      console.log('MATCH', match)
      setLoading(false)
    } catch (error) {
      console.log('error fetching user!', error)
    }
  }

  return (
    <ScreenTemplate>
      <SafeAreaView style={[styles.container]}>
        <Searchbar
          placeholder="Search"
          onChangeText={onChangeSearch}
          onSubmitEditing={handleSubmit}
          value={searchQuery}
          autoCapitalize="none"
        />
        <FlatList
          data={searchFriend}
          renderItem={({ item }) => (
            <>
              <Text style={[styles.item, { color: colorScheme.text }]}>
                {item.username}
              </Text>
              <Button label="Add" color={colors.primary}>
                Add
              </Button>
            </>
          )}
          keyExtractor={(item) => item.id}
        />
      </SafeAreaView>
    </ScreenTemplate>
  )
}

export default SearchBar

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
