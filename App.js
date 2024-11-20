
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import GameList from './GameList';
import FavoriteGames from './FavoriteGames';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

// koita saada firebase toimimaan
const firebaseConfig = {
  apiKey: "AIzaSyDci78DERnHha-iRD90Fu_80aN04AZcfwc",
  authDomain: "findgames-b0407.firebaseapp.com",
  projectId: "findgames-b0407",
  storageBucket: "findgames-b0407.firebasestorage.app",
  messagingSenderId: "711135087589",
  appId: "1:711135087589:web:f002ae74cdd3c0e6b5bd0c",
  measurementId: "G-61W5K6MYR3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);


export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Tab.Navigator //tehdään alabaarin iconeista hienommat näkösiä
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