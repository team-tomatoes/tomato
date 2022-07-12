/* eslint-disable quote-props */
import React, { useState, useEffect, useContext } from 'react'
import {
  StyleSheet,
  SafeAreaView,
  Text,
  TextInput,
  View,
  Keyboard,
  Button,
  FlatList,
} from 'react-native'
// import { Feather, Entypo } from '@expo/vector-icons'
import { Searchbar } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import { getDocs, collection, query, where } from 'firebase/firestore'
import { colors, fontSize } from 'theme'
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
  console.log('SEARCH QUERY', searchQuery)

  useEffect(() => {
    async function fetchUser() {
      try {
        const userRef = collection(firestore, 'users')
        const q = query(userRef)
        const searchSnapshot = await getDocs(q)
        const searchData = []
        searchSnapshot.forEach((doc) => {
          searchData.push({ username: doc.get('userName'), id: doc.get('id') })
        })
        setSearchFriend(searchData)
        console.log('ALL USERS', searchFriend)
        setLoading(false)
      } catch (error) {
        console.log('error fetching user!', error)
      }
    }
    fetchUser()
  }, [])

  return (
    <ScreenTemplate>
      <SafeAreaView style={[styles.container]}>
        <Searchbar
          placeholder="Search"
          onChangeText={onChangeSearch}
          value={searchQuery}
          autoCapitalize="none"
        />
        {/* <FlatList
          data={searchFriend}
          renderItem={({ item }) => (
            <>
              <Text style={[styles.item, { color: colorScheme.text }]}>
                {item}
              </Text>
              <Button label="Add" color={colors.primary}>
                Add
              </Button>
            </>
          )}
          keyExtractor={(item) => item.id}
        /> */}
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
