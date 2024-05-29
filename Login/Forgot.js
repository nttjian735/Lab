// src/screens/ForgotScreen.js

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../Firestore';

export default function ForgotScreen({ navigation }) {
  const [email, setEmail] = useState('');

  async function resetPassword() {
    if (!email) {
      Alert.alert('Error', 'Please enter your email.');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert('Success', 'An email has been sent to reset your password.');
    } catch (error) {
      Alert.alert('Error', 'There was a problem sending the password reset email. Please try again later.');
    }
  }

  return (
    <View style={styles.container}>
      <Icon name="email" size={50} color="black" style={styles.icon} />
      <TextInput 
        style={styles.input} 
        placeholder="Email" 
        placeholderTextColor="#000"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TouchableOpacity 
        style={styles.button}
        onPress={resetPassword}
      >
        <Text style={styles.buttonText}>RESET PASSWORD</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('Register')}
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
