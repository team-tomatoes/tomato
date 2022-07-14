import React, { useState, useEffect, useContext } from 'react'
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Alert,
  Modal,
  Pressable,
} from 'react-native'
import { Avatar } from 'react-native-elements'
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
  arrayUnion,
  arrayRemove,
  getDoc,
} from 'firebase/firestore'
import { ref, getDownloadURL } from 'firebase/storage'
import { firestore, storage } from '../../firebase/config'
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
  const [modalVisible, setModalVisible] = useState(false)
  const [friendModalData, setFriendModalData] = useState([])
  const [pinNumber, setPinNumber] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchFriends() {
      try {
        const friendsRef = collection(firestore, 'friendships')
        const q = query(friendsRef, where('id', '==', `${uid}`))

        let friendData = []
        onSnapshot(q, (querySnapshot) => {
          querySnapshot.forEach((document) => {
            friendData = document.data().friendsList
          })
          setFriends(friendData)
        })
        setLoading(false)
      } catch (error) {
        console.log('error fetching user friends!', error)
      }
    }
    fetchFriends()
    getDefaultIcon()
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

  const getDefaultIcon = async () => {
    const iconRef = ref(storage, 'avatar/icon.png')
    getDownloadURL(iconRef)
      .then((url) => {
        console.log(url)
      })
      .catch((error) => {
        // Handle any errors
        console.log(error)
      })
  }

  return (
    <ScreenTemplate>
      <SafeAreaView style={[styles.container]}>
        <FlatList
          data={friends}
          renderItem={({ item }) => (
            <View style={styles.userContainer}>
              <Text style={[styles.item, { color: colorScheme.text }]}>
                {item.userName}
              </Text>
              <View style={styles.buttonContainer}>
                <Button
                  label="View"
                  color={colors.primary}
                  onPress={async () => {
                    const pinsArr = []
                    const q = query(
                      collection(firestore, 'pins'),
                      where('user', '==', item.id),
                    )

                    const querySnapshot = await getDocs(q)

                    querySnapshot.forEach((document) => {
                      // doc.data() is never undefined for query doc snapshots
                      pinsArr.push([document.id])
                    })
                    setPinNumber(pinsArr.length)
                    console.log(pinsArr.length)

                    const docRef = doc(firestore, 'users', `${item.id}`)
                    const docSnap = await getDoc(docRef)
                    if (docSnap.exists()) {
                      console.log('Document data:', docSnap.data())
                      setFriendModalData(docSnap.data())
                      console.log(friendModalData)
                    } else {
                      console.log('No such document!')
                    }
                    setModalVisible(true)
                  }}
                >
                  View
                </Button>
                <Button
                  label="Delete"
                  color={colors.primary}
                  onPress={() => onPressDeleteFriend(item)}
                >
                  Delete
                </Button>
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
  // button: {
  //   borderRadius: 20,
  //   padding: 10,
  //   elevation: 2,
  // },
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
  },
})
