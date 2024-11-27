import { View, StyleSheet, FlatList, Linking, Image } from 'react-native';
import { useState, useEffect } from 'react';
import { Card, Text, IconButton, Dialog, Portal, Paragraph, Button, Snackbar } from 'react-native-paper';
import { getDatabase, ref, onValue, remove } from 'firebase/database';
import { app } from './firebaseconfig';

const db = getDatabase(app);

export default function FavoriteGames() {
  const [favorites, setFavorites] = useState([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [gameToRemove, setGameToRemove] = useState(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // haetaan suosikkipelit tietokannasta
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

  // Vahvista pelin poistaminen suosikeista
  const confirmRemoveFromFavorites = (id) => {
    setGameToRemove(id);
    setDialogVisible(true);
  };

  // Poista peli suosikeista
  const removeFromFavorites = async () => {
    if (!gameToRemove) return;

    try {
      const game = favorites.find(f => f.id === gameToRemove);
      await remove(ref(db, `favorites/${gameToRemove}`));
      
      setSnackbarMessage(`${game.title} removed from favorites`);
      setSnackbarVisible(true);
    } catch (error) {
      console.error("Error removing game: ", error);
      setSnackbarMessage('Failed to remove game from favorites');
      setSnackbarVisible(true);
    } finally {
      setDialogVisible(false);
      setGameToRemove(null);
    }
  };

  // Avataan diilin linkki
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
                onPress={() => confirmRemoveFromFavorites(item.id)}
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

      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>Remove from Favorites</Dialog.Title>
          <Dialog.Content>
            <Paragraph>Are you sure you want to remove this game from favorites?</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>Cancel</Button>
            <Button onPress={removeFromFavorites}>Confirm</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

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