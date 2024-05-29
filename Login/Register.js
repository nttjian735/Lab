import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../Firestore'; // Adjust the path according to your project structure

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cfpassword, setCfPassword] = useState('');

  async function UserRegister() {
    if (!username || !email || !password || !cfpassword) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
  
    if (cfpassword !== password) {
      Alert.alert('Error', "Passwords don't match");
      return;
    }
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const currentUser = userCredential.user;
      
      await setDoc(doc(db, "users", currentUser.uid), {
        name: username,
        email: email,
        // role: 'user' // ลบบรรทัดนี้ออก
      });
  
      Alert.alert('Success', 'Account created successfully.');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  }
  

  return (
    <View style={styles.container}>
      <Icon name="person-add" size={50} color="black" style={styles.icon} />
      <TextInput 
        style={styles.input} 
        placeholder="Username" 
        placeholderTextColor="#000"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput 
        style={styles.input} 
        placeholder="Email" 
        placeholderTextColor="#000"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput 
        style={styles.input} 
        placeholder="Password" 
        placeholderTextColor="#000"
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
      />
      <TextInput 
        style={styles.input} 
        placeholder="Confirm Password" 
        placeholderTextColor="#000"
        secureTextEntry={true}
        value={cfpassword}
        onChangeText={setCfPassword}
      />
      <TouchableOpacity 
        style={styles.button}
        onPress={UserRegister}
      >
        <Text style={styles.buttonText}>REGISTER</Text>
      </TouchableOpacity>
      <TouchableOpacity 
       style={styles.button}
       onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.buttonText}>BACK</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9C4',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  icon: {
    marginBottom: 30,
  },
  input: {
    width: '100%',
    height: 40,
    backgroundColor: '#ADD8E6',
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  button: {
    width: '100%',
    backgroundColor: '#D1C4E9',
    paddingVertical: 10,
    marginVertical: 5,
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
