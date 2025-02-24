// screens/HomeScreen.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const HomeScreen = ({ navigation }) => (
  <View style={styles.container}>
    <View>
      <Text style={{ fontSize: 20 }}>Welcome to Local-Connect-App</Text>
    </View>
    <View style={styles.appsContainer}>
      <TouchableOpacity
        onPress={() => navigation.navigate("BusSearch")}
        style={styles.appIconButton}
      >
        <Icon name="bus" size={50} color="#ddd" />
        <Text style={styles.buttonText}>{"Bus Search"}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("AppB")}
        style={styles.appIconButton}
      >
        <Icon name="search-plus" size={50} color="#ddd" />
        <Text style={styles.buttonText}>Find Local Businesses</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("AppC")}
        style={styles.appIconButton}
      >
        <MaterialIcons name="real-estate-agent" size={50} color="#ddd" />
        <Text style={styles.buttonText}>{"Real Estate\nBuy/Rent"}</Text>
      </TouchableOpacity>
    </View>
  </View>
);

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  appIconButton: {
    backgroundColor: "#007BFF",
    padding: 25,
    borderRadius: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "#ddd",
    fontWeight: "bold",
    fontSize: 15,
  },
  appsContainer: {
    flexDirection: "column",
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    padding: 80,
  },
});
