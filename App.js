import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import OnBoarding from "./components/OnBoarding";
import UserLogin from "./components/screens/UserLogin";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UserRegistration from "./components/screens/UserRegistration";
import UserDashboard from "./components/screens/Home/UserDashboard"; // Import UserDashboard
import { firebase } from "./firebase/config";

const Stack = createStackNavigator();

export default function App() {
  const [isNewUser, setIsNewUser] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function checkOnboarding() {
      try {
        const value = await AsyncStorage.getItem("@viewedOnboarding");
        if (value === null) {
          setIsNewUser(true);
        }
      } catch (error) {
        console.log("Error @checkOnboarding:", error);
      }
    }

    checkOnboarding();
  }, []);

  // Firebase authentication state change
  function onAuthStateChanged(currentUser) {
    console.log("Auth state changed:", currentUser);
    setUser(currentUser);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
    return () => subscriber(); // Unsubscribe when component unmounts
  }, []);

  if (initializing) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={
          isNewUser ? "OnBoarding" : user ? "UserDashboard" : "UserLogin"
        }
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="OnBoarding" component={OnBoarding} />
        <Stack.Screen
          name="UserLogin"
          options={{
            headerShown: false,
          }}
          component={UserLogin}
        />
        <Stack.Screen name="UserRegistration" component={UserRegistration} />
        <Stack.Screen name="UserDashboard" component={UserDashboard} />
        {/* Add more screens as needed */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
