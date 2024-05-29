import React from 'react';
import { Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';



const ProdCard = ({ item, addProd }) => {
  return (
    <TouchableOpacity onPress={() => addProd(item.name)}>
      <Card style={styles.card}>
        <Image
          source={{ uri: item.pic }}
          style={styles.image}
        />
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.stock}>จำนวนคงเหลือ: {item.stock}</Text>
        <Text style={styles.price}>ราคา: ${item.price}</Text>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 10,
    padding: 10,
    width: '90%',
    borderRadius: 2,
    backgroundColor: 'white',
    elevation: 3,
    alignSelf: 'center',
  },
  image: {
    width: '100%',
    height: 100,
    resizeMode: 'contain',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  stock: {
    color: 'gray',
  },
  price: {
    color: 'red',
  },
});

export default ProdCard;
