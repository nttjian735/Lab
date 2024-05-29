import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { auth, db } from './Firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc, onSnapshot, setDoc } from 'firebase/firestore';

export default function CartScreen() {
  const [cart, setCart] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        subscribeToCart(user.uid);
      } else {
        setUserId(null);
        setCart([]);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const subscribeToCart = (uid) => {
    const cartRef = doc(db, 'cart', uid);

    // Listen for real-time updates
    const unsubscribeCart = onSnapshot(cartRef, (docSnap) => {
      if (docSnap.exists()) {
        setCart(docSnap.data().products || []);
      } else {
        console.log("No cart document for user.");
        setCart([]);
      }
    });

    return unsubscribeCart;
  };

  const removeFromCart = async (itemToRemove) => {
    if (!userId) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    try {
      const updatedCart = cart.filter(item => item !== itemToRemove);

      const cartRef = doc(db, 'cart', userId);
      await updateDoc(cartRef, {
        products: updatedCart
      });

      Alert.alert('Alert', `${itemToRemove} removed from cart`);
    } catch (e) {
      console.log(e);
    }
  };

  const clearCart = async () => {
    if (!userId) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    try {
      const cartRef = doc(db, 'cart', userId);
      await updateDoc(cartRef, {
        products: []
      });

      setCart([]);
      Alert.alert('Alert', 'Cart cleared');
    } catch (e) {
      console.log(e);
    }
  };

  const orderCart = async () => {
    if (!userId) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    try {
      const orderRef = doc(db, 'order', userId);
      await setDoc(orderRef, {
        products: cart,
        orderDate: new Date().toISOString()
      });

      await clearCart(); // Clear the cart after ordering
      Alert.alert('Alert', 'Order placed successfully');
    } catch (e) {
      console.log(e);
      Alert.alert('Error', 'An error occurred while placing the order');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.clearButton} onPress={orderCart}>
        <Text style={styles.clearButtonText}>ORDER</Text>
      </TouchableOpacity>
      <ScrollView style={styles.itemsContainer}>
        {cart.map((item, index) => (
          <TouchableOpacity key={index} onPress={() => removeFromCart(item)}>
            <Text style={styles.itemText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9C4',
    paddingTop: 20,
  },
  clearButton: {
    backgroundColor: '#D1C4E9',
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  itemsContainer: {
    padding: 20,
  },
  itemText: {
    fontSize: 16,
    marginBottom: 10,
  },
});
