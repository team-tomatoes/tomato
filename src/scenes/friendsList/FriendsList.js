import React, { useState, useEffect, useContext } from 'react'
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Alert,
  Modal,
  TouchableHighlight,
} from 'react-native'
import { Avatar } from 'react-native-elements'
import { AntDesign } from 'react-native-vector-icons'
import { useNavigation } from '@react-navigation/native'
import { IconButton, Colors } from 'react-native-paper'
import { colors, fontSize } from 'theme'
import {
  getDocs,
  collection,
  query,
  where,
  doc,
  updateDoc,
  onSnapshot,
  arrayRemove,
  getDoc,
} from 'firebase/firestore'
import { firestore, storage } from '../../firebase/config'
import { ColorSchemeContext } from '../../context/ColorSchemeContext'
import { UserDataContext } from '../../context/UserDataContext'
import ScreenTemplate from '../../components/ScreenTemplate'

export default function Friends() {
  const { userData } = useContext(UserDataContext)
  const { scheme } = useContext(ColorSchemeContext)
  const isDark = scheme === 'dark'
  const colorScheme = {
    text: isDark ? colors.white : colors.primaryText,
  }
  const uid = userData.id
  const [friends, setFriends] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [friendModalData, setFriendModalData] = useState([])
  const [pinNumber, setPinNumber] = useState(null)
  const [friendsData, setFriendsData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchFriends() {
      try {
        const friendsRef = collection(firestore, 'users')
        const q = query(friendsRef, where('id', '==', `${uid}`))

        let friendData = []
        const avatarData = []
        onSnapshot(q, (querySnapshot) => {
          querySnapshot.forEach((document) => {
            friendData = document.data().friendsList
          })
          setFriends(friendData)
          friendData.forEach(async (friend) => {
            const q1 = query(
              collection(firestore, 'users'),
              where('id', '==', friend.id),
            )
            const querySnapshot1 = await getDocs(q1)
            querySnapshot1.forEach((user) => {
              avatarData.push(user.data())
            })
            setFriendsData(avatarData)
          })
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
      const friendsListRef = doc(firestore, 'users', uid)
      await updateDoc(friendsListRef, {
        friendsList: arrayRemove(friendObj),
      })

      const updatedRef = collection(firestore, 'users')
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
    const deletedFriendRef = doc(firestore, 'users', friendObj.id)
    await updateDoc(deletedFriendRef, {
      friendsList: arrayRemove({
        id: uid,
        userName: userData.userName,
        avatar: userData.avatar,
      }),
    })
  }

  const onPressDeleteFriend = async (friendObj) => {
    await updateUserFriends(friendObj)
    await updateDeletedFriend(friendObj)
  }

  const onPressViewProfile = async (item) => {
    const pinsArr = []
    const q = query(collection(firestore, 'pins'), where('user', '==', item.id))

    const querySnapshot = await getDocs(q)

    querySnapshot.forEach((document) => {
      pinsArr.push([document.id])
    })
    setPinNumber(pinsArr.length)

    const docRef = doc(firestore, 'users', `${item.id}`)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      setFriendModalData(docSnap.data())
    } else {
      console.log('No such document!')
    }
    setModalVisible(true)
  }

  return (
    <ScreenTemplate>
      <SafeAreaView style={[styles.container]}>
        <FlatList
          data={friends}
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
              </View>
              <View style={{ marginLeft: 0 }}>
                <Text style={[styles.item, { color: colorScheme.text }]}>
                  {item.userName}
                </Text>
                <View style={styles.buttonContainer}>
                  <TouchableHighlight onPress={() => onPressViewProfile(item)}>
                    <View>
                      <AntDesign name="profile" size={30} color="#FFF199" />
                    </View>
                  </TouchableHighlight>
                  <View style={styles.space} />
                  <TouchableHighlight onPress={() => onPressDeleteFriend(item)}>
                    <View>
                      <AntDesign name="deleteuser" size={30} color="#F07167" />
                    </View>
                  </TouchableHighlight>
                </View>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
        <View style={styles.centeredView}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.')
              setModalVisible(!modalVisible)
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.title}>{friendModalData.fullName}</Text>
                <View style={styles.avatar}>
                  <Avatar
                    size="xlarge"
                    rounded
                    source={{ uri: friendModalData.avatar }}
                  />
                </View>
                <Text style={styles.modalText}>Pin Count: {pinNumber}</Text>
                <Text style={styles.modalText}>
                  @{friendModalData.userName}
                </Text>
                <IconButton
                  icon="arrow-left"
                  color={Colors.grey500}
                  size={25}
                  style={{ marginTop: 0 }}
                  onPress={() => setModalVisible(!modalVisible)}
                />
              </View>
            </View>
          </Modal>
        </View>
      </SafeAreaView>
    </ScreenTemplate>
  )
}

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
    marginRight: 5,
    justifyContent: 'center',
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
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
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
  modalText: {
    marginBottom: 15,
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
    marginRight: 20,
  },
  space: {
    width: 20,
    height: 20,
  },
})
