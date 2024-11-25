import { View, StyleSheet, FlatList, Linking, Image } from 'react-native';
import { useState } from 'react';
import { TextInput, Button, Card, Text, IconButton, Menu } from 'react-native-paper';
import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebaseconfig';

export default function GameList() {
  const [keyword, setKeyword] = useState('');
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortMenuVisible, setSortMenuVisible] = useState(false);
  const [currentSort, setCurrentSort] = useState('Title (A-Z)');

  const sortOptions = {
    'Title (A-Z)': { sortBy: 'Title', desc: 0 },
    'Title (Z-A)': { sortBy: 'Title', desc: 1 },
    'Price (Low to High)': { sortBy: 'Price', desc: 0 },
    'Price (High to Low)': { sortBy: 'Price', desc: 1 }
  };

  const searchGames = (sortOption = sortOptions[currentSort]) => {
    setLoading(true);
    
    const url = `https://www.cheapshark.com/api/1.0/deals?${
      keyword ? `title=${keyword}&` : ''
    }sortBy=${sortOption.sortBy}&desc=${sortOption.desc}&pageSize=20`;
    
    fetch(url)
      .then(response => response.json())
      .then(setGames)
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const addToFavorites = async (game) => {
    try {
      await addDoc(collection(db, "favorites"), {
        title: game.title,
        cheapest: game.salePrice,
        normalPrice: game.normalPrice,
        dealID: game.dealID,
        thumb: game.thumb
      });
    } catch (error) {
      console.error("Error adding game: ", error);
    }
  };

  const openDealLink = (dealID) => {
    const url = `https://www.cheapshark.com/redirect?dealID=${dealID}`;
    Linking.openURL(url).catch(err => console.error("Error opening link: ", err));
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        mode="outlined"
        label="Search games"
        value={keyword}
        onChangeText={setKeyword}
      />
      <View style={styles.searchControls}>
        <Button
          loading={loading}
          mode="contained"
          icon="magnify"
          onPress={() => searchGames()}
          style={styles.searchButton}
        >
          Search
        </Button>
        <Menu
          visible={sortMenuVisible}
          onDismiss={() => setSortMenuVisible(false)}
          anchor={
            <Button 
              mode="outlined" 
              onPress={() => setSortMenuVisible(true)}
              icon="sort"
            >
              {currentSort}
            </Button>
          }
        >
          {Object.keys(sortOptions).map((option) => (
            <Menu.Item
              key={option}
              onPress={() => {
                setCurrentSort(option);
                setSortMenuVisible(false);
                searchGames(sortOptions[option]);
              }}
              title={option}
            />
          ))}
        </Menu>
      </View>
      <FlatList
        style={styles.list}
        data={games}
        keyExtractor={(item) => item.dealID}
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
  searchInput: {
    width: 300,
    marginBottom: 10
  },
  searchControls: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 300,
    marginBottom: 10,
  },
  searchButton: {
    flex: 1,
    marginRight: 10
  },
  list: {
    width: "90%",
    marginTop: 20
  },
  card: {
    marginBottom: 10
  },
  thumb: {
    width: 40,
    height: 40
  }
});
