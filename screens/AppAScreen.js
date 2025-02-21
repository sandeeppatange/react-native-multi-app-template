// screens/AppAScreen.js
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const AppAScreen = ({ navigation }) => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Text>Welcome to Govt. Bus Time Info.</Text>
    <TouchableOpacity onPress={() => navigation.navigate("Home")}>
      <Icon name="home" size={40} color="#abc" />
      <Text>Home</Text>
    </TouchableOpacity>
  </View>
);

export default AppAScreen;
