import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, storage } from './Firestore'; // Ensure this is your Firestore initialization file
import { getAuth, signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Import necessary functions from firebase/storage

export default function ProfileScreen() {
  const [userData, setUserData] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const auth = getAuth();
  const navigation = useNavigation();

  useEffect(() => {
    fetchUserData();
    askPermission();
  }, []);

  const fetchUserData = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserData(data);
          setProfilePic(data.pic); // Assuming you have a `pic` field in your Firestore document
        } else {
          console.log('No such document!');
        }
      } else {
        console.log('No user logged in!');
      }
    } catch (error) {
      console.error('Error getting user data:', error);
    }
  };

  const askPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'We need media library permissions to make this work!');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const selectImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        console.log('Image URI:', uri);

        let response = await fetch(uri);
        let blob = await response.blob();

        const storageRef = ref(storage, `profile_pictures/${auth.currentUser.uid}.jpg`);

        uploadBytes(storageRef, blob)
          .then(async (snapshot) => {
            console.log('Uploaded!!');
            const downloadURL = await getDownloadURL(storageRef);
            setProfilePic(downloadURL);

            // Update Firestore with the new profile picture URL
            const userDocRef = doc(db, 'users', auth.currentUser.uid);
            await updateDoc(userDocRef, { pic: downloadURL });

            Alert.alert('Upload Successful', 'Profile picture updated successfully.');
          })
          .catch((error) => {
            console.error('Error uploading image:', error.message);
            Alert.alert('Upload Failed', 'Failed to upload image. Please try again.');
          });
      } else {
        console.log('Image selection cancelled');
      }
    } catch (error) {
      console.error('Error getting image:', error.message);
      Alert.alert('Error', 'Failed to get image. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      {userData && (
        <>
          <View style={styles.profileImageContainer}>
            <Image 
              source={{ uri: profilePic }} 
              style={styles.profileImage}
            />
          </View>
          <Text style={styles.nameText}>{userData.name}</Text>
        </>
      )}
      <TouchableOpacity style={styles.button} onPress={selectImage}>
        <Text style={styles.buttonText}>CHANGE PROFILE PICTURE</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF9C4',
  },
  profileImageContainer: {
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderColor: 'black',
    borderWidth: 1,
  },
  nameText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#D1C4E9',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  logoutButton: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
