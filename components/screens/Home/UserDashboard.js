import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { firebase } from "../../../firebase/config";
import { useTheme } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";

const UserDashboard = () => {
  const [name, setName] = useState("");
  const { colors } = useTheme();
  const navigation = useNavigation();

  const fetchUserData = () => {
    const user = firebase.auth().currentUser;
    if (user) {
      firebase
        .firestore()
        .collection("users")
        .doc(user.uid)
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            const userData = snapshot.data();
            setName(userData.firstName);
          } else {
            console.log("User does not exist");
          }
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          // Implement retry logic here if needed
        });
    } else {
      console.log("No user is signed in.");
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []); // Fetch user data when the component mounts

  const handleSignOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        // Navigate to the login screen after successful sign-out
        navigation.navigate("UserLogin");
      })
      .catch((error) => {
        console.error("Sign out error:", error);
      });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.text, { color: colors.text }]}>
        Hello {name || "User"}
      </Text>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={handleSignOut}
      >
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
  },
});

export default UserDashboard;
