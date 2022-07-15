import React, { useState, useContext } from 'react'
import {
  StyleSheet,
  SafeAreaView,
  Text,
  FlatList,
  View,
  Alert,
  TouchableHighlight,
} from 'react-native'
import { Searchbar } from 'react-native-paper'
import { Avatar } from 'react-native-elements'
import { AntDesign } from 'react-native-vector-icons'
import { useNavigation } from '@react-navigation/native'
import {
  getDocs,
  collection,
  query,
  doc,
  updateDoc,
  arrayUnion,
} from 'firebase/firestore'
import { colors, fontSize } from 'theme'
import Button from '../../components/Button'
import ScreenTemplate from '../../components/ScreenTemplate'
import { UserDataContext } from '../../context/UserDataContext'
import { ColorSchemeContext } from '../../context/ColorSchemeContext'
import { firestore } from '../../firebase/config'

const SearchBar = () => {
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
          userName: document.get('userName'),
          id: document.get('id'),
          avatar: document.get('avatar'),
        })
      })
      const match = await searchData.filter(
        (x) => x.userName === `${searchQuery}`,
      )
      setSearchFriend(match)
      console.log('MATCH', match)
      setLoading(false)
    } catch (error) {
      console.log('error fetching user!', error)
    }
  }

  const onPressAddRequest = async (friendObj) => {
    try {
      const friendRequestRef = doc(firestore, 'users', friendObj.id)
      await updateDoc(friendRequestRef, {
        pendingRequests: arrayUnion({
          id: uid,
          userName: userData.userName,
          avatar: userData.avatar,
        }),
      })
      Alert.alert(`You've sent a friend request to ${friendObj.userName}`)
    } catch (error) {
      console.log(error)
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
            <View style={styles.userContainer}>
              <View style={styles.listAvatar}>
                <Avatar
                  size="xlarge"
                  rounded
                  source={{
                    uri: item.avatar,
                  }}
                />
                <View style={{ marginLeft: 0 }}>
                  <Text style={[styles.item, { color: colorScheme.text }]}>
                    {item.userName}
                  </Text>
                  <View style={styles.buttonContainer}>
                    <TouchableHighlight onPress={() => onPressAddRequest(item)}>
                      <View>
                        <AntDesign name="adduser" size={35} color="#FFF199" />
                      </View>
                    </TouchableHighlight>
                    {/* <Button
                      label="Add"
                      color={colors.primary}
                      onPress={() => onPressAddRequest(item)}
                    >
                      Add
                    </Button> */}
                  </View>
                </View>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      </SafeAreaView>
    </ScreenTemplate>
  )
}

export default SearchBar

const styles = StyleSheet.create({
  avatar: {
    margin: 30,
    alignSelf: 'center',
    shadowRadius: 4,
  },
  listAvatar: {
    margin: 20,
    alignSelf: 'center',
    shadowRadius: 4,
  },
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  title: {
    fontSize: fontSize.xxxLarge,
    textAlign: 'center',
  },
  userContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
})
