import { View, StyleSheet, FlatList } from 'react-native';
import { useState, useEffect } from 'react';
import { TextInput, Button, Card, Text, IconButton } from 'react-native-paper';
import * as Location from 'expo-location';
import { db } from './App';
import { collection, addDoc } from 'firebase/firestore';

export default function GameList() {
  const [keyword, setKeyword] = useState('');
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
      }
    })();
  }, []);

  const searchGames = () => {
    setLoading(true);
    fetch(`https://www.cheapshark.com/api/1.0/games?title=${keyword}`)
      .then(response => response.json())
      .then(data => setGames(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const addToFavorites = async (game) => {
    try {
      const docRef = await addDoc(collection(db, "favorites"), {
        title: game.external,
        gameID: game.gameID,
        cheapest: game.cheapest,
        timestamp: new Date(),
        location: location ? {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        } : null
      });
      console.log("Game added to favorites with ID: ", docRef.id);
    } catch (error) {
      console.error("Error adding game: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={{ width: 300, marginBottom: 10 }}
        mode="outlined"
        label="Search games"
        value={keyword}
        onChangeText={text => setKeyword(text)}
      />
      <Button
        loading={loading}
        mode="contained"
        icon="magnify"
        onPress={searchGames}
      >
        Search
      </Button>
      <FlatList
        style={{ width: "90%", marginTop: 20 }}
        data={games}
        keyExtractor={item => item.gameID}
        renderItem={({ item }) => (
          <Card style={{ marginBottom: 10 }}>
            <Card.Title title={item.external} />
            <Card.Content>
              <Text variant="bodyMedium">Cheapest price: ${item.cheapest}</Text>
            </Card.Content>
            <Card.Actions>
              <IconButton
                icon="heart"
                onPress={() => addToFavorites(item)}
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