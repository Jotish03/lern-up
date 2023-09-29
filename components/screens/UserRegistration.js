import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Image,
  Alert,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { firebase } from "../../firebase/config";

const UserRegistration = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState("");
  const [error, setError] = useState("");

  const clearForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    Keyboard.dismiss();
  };

  const showVerificationMessage = (message) => {
    setVerificationMessage(message);
    setTimeout(() => {
      setVerificationMessage("");
    }, 5000);
  };

  const showError = (message) => {
    setError(message);
    setTimeout(() => {
      setError("");
    }, 5000);
  };

  // Validate email format
  const isEmailValid = (email) => {
    const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return email.match(emailFormat);
  };

  // Validate password
  const isPasswordValid = (password) => {
    // You can add your password requirements here
    return password.length >= 6; // Example: At least 6 characters
  };

  //firebase
  const registerUser = async (firstName, lastName, email, password) => {
    setIsLoading(true);

    if (!firstName || !lastName || !email || !password) {
      setIsLoading(false);
      showError("All fields are required.");
      return;
    }

    if (!isEmailValid(email)) {
      setIsLoading(false);
      showError("Invalid email format.");
      return;
    }

    if (!isPasswordValid(password)) {
      setIsLoading(false);
      showError("Password must be at least 6 characters.");
      return;
    }

    try {
      const userCredential = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);

      if (userCredential.user) {
        await userCredential.user.sendEmailVerification({
          handleCodeInApp: true,
          url: "https://react-nativepfs.firebaseapp.com",
        });
        await firebase
          .firestore()
          .collection("users")
          .doc(userCredential.user.uid)
          .set({
            firstName,
            lastName,
            email,
          });
        showVerificationMessage("Email verification sent.");
        clearForm();
      }
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        showError("Email is already in use.");
      } else {
        showError("Registration failed.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const navigation = useNavigation();

  const handleLoginPress = () => {
    navigation.navigate("UserLogin"); // Navigate to the login page
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/fourth.png")}
        style={styles.imgRegister}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="First Name"
          placeholderTextColor="gray"
          onChangeText={(text) => setFirstName(text)}
          value={firstName}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          placeholderTextColor="gray"
          onChangeText={(text) => setLastName(text)}
          value={lastName}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="gray"
          onChangeText={(text) => setEmail(text)}
          value={email}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="gray"
          onChangeText={(text) => setPassword(text)}
          secureTextEntry
          value={password}
        />
      </View>

      <TouchableOpacity
        style={styles.buttonEmail}
        onPress={() => registerUser(firstName, lastName, email, password)}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.textEmail}>Register</Text>
        )}
      </TouchableOpacity>
      {verificationMessage !== "" && (
        <Text style={styles.successMessage}>{verificationMessage}</Text>
      )}
      {error !== "" && <Text style={styles.errorMessage}>{error}</Text>}
      <Text style={styles.signupText}>
        Already joined?{" "}
        <Text style={styles.signupLink} onPress={handleLoginPress}>
          Login Now
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
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
  buttonEmail: {
    padding: 12,
    backgroundColor: "#000",
    borderRadius: 8,
    width: 300,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  textEmail: {
    color: "#fff",
    textAlign: "center",
  },
  successMessage: {
    color: "green",
    textAlign: "center",
    marginTop: 10,
  },
  errorMessage: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
  signupText: {
    marginTop: 5,
    color: "black",
  },
  signupLink: {
    color: "black",
    fontWeight: "bold",
  },
  imgRegister: {
    height: 300,
    width: 300,
    bottom: 10,
  },
});

export default UserRegistration;
