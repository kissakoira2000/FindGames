import { View, StyleSheet, ScrollView, Linking } from 'react-native';
import { Card, Text, Button, List } from 'react-native-paper';
import { useState, useEffect } from 'react';

export default function GameDetails({ route }) {
  const { gameID } = route.params;
  const [gameDetails, setGameDetails] = useState(null);
  const [deals, setDeals] = useState([]);

  useEffect(() => {
    // Hae pelin tiedot
    fetch(`https://www.cheapshark.com/api/1.0/games?id=${gameID}`)
      .then(response => response.json())
      .then(data => setGameDetails(data));

    // Hae pelin tarjoukset
    fetch(`https://www.cheapshark.com/api/1.0/deals?id=${gameID}`)
      .then(response => response.json())
      .then(data => setDeals(Array.isArray(data) ? data : []));
  }, [gameID]);

  const openStore = (dealLink) => {
    Linking.openURL(`https://www.cheapshark.com/redirect?dealID=${dealLink}`);
  };

  if (!gameDetails) {
    return <View style={styles.container}><Text>Loading...</Text></View>;
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Cover source={{ uri: gameDetails.info.thumb }} />
        <Card.Content>
          <Text variant="titleLarge">{gameDetails.info.title}</Text>
          <Text variant="bodyMedium">Lowest Price Ever: ${gameDetails.cheapestPriceEver.price}</Text>
          
          <List.Section>
            <List.Subheader>Available Deals</List.Subheader>
            {deals.map((deal, index) => (
              <List.Item
                key={index}
                title={`$${deal.price}`}
                description={`Original price: $${deal.retailPrice}`}
                right={() => (
                  <Button 
                    mode="contained" 
                    onPress={() => openStore(deal.dealID)}
                  >
                    Buy
                  </Button>
                )}
              />
            ))}
          </List.Section>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  card: {
    margin: 10,
  }
});