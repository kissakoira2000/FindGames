import { View, StyleSheet, FlatList, Linking, Image } from 'react-native';
import { useState, useEffect } from 'react';
import { Card, Text, IconButton, Snackbar } from 'react-native-paper';
import { getDatabase, ref, push } from 'firebase/database';
import { app } from './firebaseconfig';

const db = getDatabase(app);

export default function TopRatedGames() {
  const [topGames, setTopGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Haetaan parhaat pelit CheapShark API:sta
  useEffect(() => {
    const fetchTopGames = async () => {
      try {
        const url = 'https://www.cheapshark.com/api/1.0/deals?storeID=1&upperPrice=15';
        
        const response = await fetch(url);
        const data = await response.json();
        
        
        const gamesWithScores = data.map(game => ({
          ...game,
          metacriticScore: game.metacriticScore || 0
        }));
        
        // suodatetaan pelit metacriticScoren perusteella suurimmasta pienimpään
        gamesWithScores.sort((a, b) => b.metacriticScore - a.metacriticScore);
        
        setTopGames(gamesWithScores);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching top games: ", error);
        setLoading(false);
      }
    };

    fetchTopGames();
  }, []);

  // Lisätään peli suosikkeihin
  const addToFavorites = async (game) => {
    try {
      await push(ref(db, "favorites"), {
        title: game.title,
        normalPrice: game.normalPrice,
        cheapest: game.salePrice,
        dealID: game.dealID,
        thumb: game.thumb,
      });
      
      setSnackbarMessage(`${game.title} added to favorites`);
      setSnackbarVisible(true);
    } catch (error) {
      console.error("Error adding game: ", error);
      setSnackbarMessage('Failed to add game to favorites');
      setSnackbarVisible(true);
    }
  };

  // Avataan diilin linkki
  const openDealLink = (dealID) => {
    const url = `https://www.cheapshark.com/redirect?dealID=${dealID}`;
    Linking.openURL(url).catch(err => console.error("Error opening link: ", err));
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading top-rated games...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.list}
        data={topGames}
        keyExtractor={(item) => item.dealID}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Title 
              title={item.title}
              subtitle={`Metacritic Score: ${item.metacriticScore}`} 
              left={() => item.thumb && (
                <Image 
                  source={{ uri: item.thumb }} 
                  style={styles.thumb}
                />
              )}
            />
            <Card.Content>
              <Text variant="bodyMedium">Sale price: ${item.salePrice}</Text>
              <Text variant="bodyMedium">Normal price: ${item.normalPrice}</Text>
            </Card.Content>
            <Card.Actions>
              <IconButton
                icon="heart"
                onPress={() => addToFavorites(item)}
              />
              <IconButton
                icon="shopping"
                onPress={() => openDealLink(item.dealID)}
              />
            </Card.Actions>
          </Card>
        )}
      />

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{
          label: 'Close',
          onPress: () => setSnackbarVisible(false)
        }}
      >
        {snackbarMessage}
      </Snackbar>
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