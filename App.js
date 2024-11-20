import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import GameList from './GameList';
import FavoriteGames from './FavoriteGames';
import { Ionicons } from '@expo/vector-icons';
import { db } from './firebaseconfig';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              if (route.name === 'Games') {
                iconName = focused ? 'game-controller' : 'game-controller-outline';
              } else if (route.name === 'Favorites') {
                iconName = focused ? 'heart' : 'heart-outline';
              }
              return <Ionicons name={iconName} size={size} color={color} />;
            },
          })}
        >
          <Tab.Screen name="Games" component={GameList} />
          <Tab.Screen name="Favorites" component={FavoriteGames} />
        </Tab.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}