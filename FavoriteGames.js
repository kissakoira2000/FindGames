import { View, StyleSheet, FlatList, Linking, Image } from 'react-native';
import { useState, useEffect } from 'react';
import { Card, Text, IconButton } from 'react-native-paper';
import { getDatabase, ref, onValue, remove } from 'firebase/database';
import { app } from './firebaseconfig';

const db = getDatabase(app);

export default function FavoriteGames() {
  const [favorites, setFavorites] = useState([]);

  //haetaan suosikit tietokannasta
  useEffect(() => {
    const favoritesRef = ref(db, "favorites");
    onValue(favoritesRef, (snapshot) => {
      const data = snapshot.val();
      const gamesArray = data ? Object.keys(data).map(key => ({
        ...data[key],
        id: key
      })) : [];
      setFavorites(gamesArray);
    });
  }, []);

  //poistetaan suosikeista
  const removeFromFavorites = async (id) => {
    try {
      await remove(ref(db, `favorites/${id}`));
    } catch (error) {
      console.error("Error removing game: ", error);
    }
  };

  //avataan diilin linkki
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