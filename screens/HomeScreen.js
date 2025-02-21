// screens/HomeScreen.js
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const HomeScreen = ({ navigation }) => (
  <View style={{ flex: 1, padding: 35 }}>
    <View>
      <Text style={{ fontSize: 20 }}>Welcome to Local-Connect-App</Text>
    </View>
    <View
      style={{
        flexDirection: "column",
        flex: 1,
        justifyContent: "space-between",
        alignItems: "center",
        padding: 80,
      }}
    >
      <TouchableOpacity onPress={() => navigation.navigate("GovtBusSearch")}>
        <Icon name="bus" size={50} color="#abc" />
        <Text>{"Govt. Bus\nSearch"}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("AppB")}>
        <Icon name="search-plus" size={50} color="#abc" />
        <Text>Find Local Businesses</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("AppC")}>
        <MaterialIcons name="real-estate-agent" size={50} color="#abc" />
        <Text>{"Real Estate\nBuy/Rent"}</Text>
      </TouchableOpacity>
    </View>
  </View>
);

export default HomeScreen;
