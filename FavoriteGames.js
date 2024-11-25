import { View, StyleSheet, FlatList, Linking, Image } from 'react-native';
import { useState, useEffect } from 'react';
import { Card, Text, IconButton } from 'react-native-paper';
import { collection, query, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from './firebaseconfig';

export default function FavoriteGames() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "favorites"));
    return onSnapshot(q, (querySnapshot) => {
      const gamesArray = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));
      setFavorites(gamesArray);
    });
  }, []);

  const removeFromFavorites = async (id) => {
    try {
      await deleteDoc(doc(db, "favorites", id));
    } catch (error) {
      console.error("Error removing game: ", error);
    }
  };

  const openDealLink = (dealID) => {
    const url = `https://www.cheapshark.com/redirect?dealID=${dealID}`;
    Linking.openURL(url).catch(err => console.error("Error opening link: ", err));
  };

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.list}
        data={favorites}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Title 
              title={item.title}
              left={() => item.thumb && (
                <Image 
                  source={{ uri: item.thumb }} 
                  style={styles.thumb}
                />
              )}
            />
            <Card.Content>
              <Text variant="bodyMedium">Sale price: ${item.cheapest}</Text>
              {item.normalPrice && (
                <Text variant="bodyMedium">Normal price: ${item.normalPrice}</Text>
              )}
            </Card.Content>
            <Card.Actions>
              <IconButton
                icon="delete"
                onPress={() => removeFromFavorites(item.id)}
              />
              {item.dealID && (
                <IconButton
                  icon="shopping"
                  onPress={() => openDealLink(item.dealID)}
                />
              )}
            </Card.Actions>
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 20,
  },
  list: {
    width: "90%"
  },
  card: {
    marginBottom: 10
  },
  thumb: {
    width: 40,
    height: 40
  }
});