import { View, StyleSheet, FlatList } from 'react-native';
import { useState, useEffect } from 'react';
import { Card, Text, IconButton } from 'react-native-paper';
import { collection, query, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from './firebaseconfig';

export default function FavoriteGames() {
  const [favorites, setFavorites] = useState([]);

  // Kerätään suosikkipelejä tietokannasta
  useEffect(() => {
    const q = query(collection(db, "favorites"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const gamesArray = [];
      querySnapshot.forEach((doc) => {
        gamesArray.push({ ...doc.data(), id: doc.id });
      });
      setFavorites(gamesArray);
    });

    return () => unsubscribe();
  }, []);

  const removeFromFavorites = async (id) => {
    try {
      await deleteDoc(doc(db, "favorites", id));
    } catch (error) {
      console.error("Error removing game: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        style={{ width: "90%" }}
        data={favorites}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Card style={{ marginBottom: 10 }}>
            <Card.Title title={item.title} />
            <Card.Content>
              <Text variant="bodyMedium">Price: ${item.cheapest}</Text>
            </Card.Content>
            <Card.Actions>
              <IconButton
                icon="delete"
                onPress={() => removeFromFavorites(item.id)}
              />
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
});