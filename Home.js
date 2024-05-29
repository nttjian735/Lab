import React, { useState, useEffect } from 'react';
import { Text, ScrollView, StyleSheet, View, StatusBar, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import ProdCard from './components/ProdCard';
import { collection, getDocs, doc, updateDoc, setDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { auth, db } from './Firestore';
import { onAuthStateChanged } from 'firebase/auth';

const HomeScreen = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState('All');
  const [cart, setCart] = useState([]);
  const [userId, setUserId] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        getCart(user.uid);
      } else {
        setUserId(null);
        setCart([]);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const fetchedData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setData(fetchedData);
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  };

  const getCart = async (uid) => {
    try {
      const cartRef = doc(db, 'cart', uid);
      const cartSnap = await getDoc(cartRef);
      if (cartSnap.exists()) {
        setCart(cartSnap.data().products || []);
      } else {
        console.log("No cart document for user.");
        setCart([]);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const addProd = async (prodName) => {
    if (!userId) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    try {
      const cartRef = doc(db, 'cart', userId);
      const cartSnap = await getDoc(cartRef);

      if (cartSnap.exists()) {
        await updateDoc(cartRef, {
          products: arrayUnion(prodName)
        });
      } else {
        await setDoc(cartRef, {
          products: [prodName]
        });
      }

      const updatedCart = [...cart, prodName];
      setCart(updatedCart);

      Alert.alert('Alert', `Added ${prodName} to cart`);
    } catch (e) {
      console.error('Error adding product to cart: ', e);
      Alert.alert('Error', 'Failed to add product to cart');
    }
  };

  const filterProducts = () => {
    if (filter === 'All') {
      return data;
    } else if (filter === 'IN STOCK') {
      return data.filter(item => parseInt(item.stock) > 0);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.filterContainer}>
        <TouchableOpacity style={[styles.filterButton, styles.whiteText]} onPress={() => setFilter('All')}>
          <Text style={styles.whiteText}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.filterButton, styles.whiteText]} onPress={() => setFilter('IN STOCK')}>
          <Text style={styles.whiteText}>In Stock</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.contentContainer}>
        <ScrollView style={styles.productList}>
          {filterProducts().map((item, index) => (
            <ProdCard key={index} item={item} addProd={addProd} />
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9C4',
    marginTop: StatusBar.currentHeight || 0,
  },
  filterContainer: {
    justifyContent: 'center',
    paddingVertical: 5,
    backgroundColor: '#2196f3',
    flexDirection: 'row',
  },
  filterButton: {
    alignSelf: 'center',
    paddingVertical: 10,
    borderRadius: 1,
    marginHorizontal: 10,
    paddingHorizontal: 20,
  },
  whiteText: {
    color: 'white',
  },
  contentContainer: {
    flex: 5,
  },
  productList: {
    flex: 3,
  },
  cartList: {
    flex: 2,
    backgroundColor: '#ffffff',
    color: 'red',
    padding: 1,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  cartItem: {
    fontSize: 15,
    marginVertical: 3,
  },
  blueBackground: {
    backgroundColor: '#FFF9C4',
  },
});

export default HomeScreen;
