import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Image,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome";
import { firebase } from "../../firebase/config";

const UserLogin = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const clearOnboarding = async () => {
    try {
      await AsyncStorage.removeItem("@viewedOnboarding");
      navigation.navigate("OnBoarding");
    } catch (error) {
      console.log("Error @clearOnboarding", error);
    }
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
      gestureEnabled: false,
    });
  }, [navigation]);

  const handleRegistrationPress = () => {
    navigation.navigate("UserRegistration");
  };

  const validateForm = () => {
    // Custom validation logic
    const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setError("Please enter your email.");
      return false;
    }
    if (!email.match(emailFormat)) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (!password.trim()) {
      setError("Please enter your password.");
      return false;
    }
    setError(""); // Clear any previous errors
    return true;
  };

  const loginUser = async () => {
    if (validateForm()) {
      try {
        const userCredential = await firebase
          .auth()
          .signInWithEmailAndPassword(email, password);
        if (userCredential.user) {
          if (!userCredential.user.emailVerified) {
            setError("Please activate your email to login.");
            // You may also send a new email verification link here
          } else {
            // Email is verified, redirect to the dashboard
            setEmail(""); // Clear the email field on successful login
            setPassword(""); // Clear the password field on successful login
            setError(""); // Clear any previous errors
            navigation.navigate("UserDashboard");
          }
        }
      } catch (error) {
        console.error("Login error:", error);
        setError("Invalid email or password. Please try again.");
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.loginContainer}>
        <Image
          source={require("../../assets/images/first.png")}
          style={styles.imgLogin}
        />
        <View style={styles.inputContainer}>
          <Icon name="envelope" size={20} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="gray"
            onChangeText={(text) => setEmail(text)}
            value={email}
          />
        </View>
        <View style={styles.inputContainer}>
          <Icon name="lock" size={20} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="gray"
            onChangeText={(text) => setPassword(text)}
            secureTextEntry
            value={password}
          />
        </View>
        <TouchableOpacity style={styles.buttonEmail} onPress={loginUser}>
          <Text style={styles.textEmail}>Login with Email</Text>
        </TouchableOpacity>

        {/* Display error message */}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Text style={{ marginTop: 5 }}>OR</Text>
        <TouchableOpacity style={styles.googleButton}>
          <Image
            source={require("../../assets/images/google.png")}
            style={styles.googleIcon}
          />
          <Text style={styles.googleButtonText}>Sign in with Google</Text>
        </TouchableOpacity>

        <Text style={styles.signupText}>
          Not yet joined?{" "}
          <Text style={styles.signupLink} onPress={handleRegistrationPress}>
            Register now
          </Text>
        </Text>
      </View>
      <TouchableOpacity onPress={clearOnboarding}>
        <Text style={styles.onboardingText}>Back to Onboarding</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  loginContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 8,
    width: 300,
    padding: 10,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    color: "black",
  },
  icon: {
    marginRight: 10,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 8,
    width: 300,
    padding: 10,
    marginTop: 10,
  },
  googleIcon: {
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginLeft: 70,
    marginRight: -50,
  },
  googleButtonText: {
    color: "black",
    flex: 1,
    textAlign: "center",
  },
  signupText: {
    marginTop: 20,
    color: "black",
  },
  signupLink: {
    color: "black",
    fontWeight: "bold",
  },
  onboardingText: {
    color: "black",
    bottom: 10,
  },
  buttonEmail: {
    padding: 12,
    backgroundColor: "#000",
    borderRadius: 8,
    width: 300,
  },
  textEmail: {
    color: "#fff",
    textAlign: "center",
  },
  imgLogin: {
    height: 300,
    width: 300,
    bottom: 30,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
  },
});

export default UserLogin;
