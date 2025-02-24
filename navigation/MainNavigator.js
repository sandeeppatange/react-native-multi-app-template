// navigation/MainNavigator.js
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import { LinearGradient } from "expo-linear-gradient";

import HomeScreen from "../screens/HomeScreen";
import AppAScreen from "../screens/AppAScreen";
import AppBScreen from "../screens/AppBScreen";
import AppCScreen from "../screens/AppCScreen";

const Stack = createStackNavigator();

const GradientWrapper = ({ children }) => (
  <LinearGradient
    colors={["white", "#ddb52f", "#007BFF"]}
    style={styles.gradientContainer}
  >
    {children}
  </LinearGradient>
);

const MainNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={({ navigation, route }) => ({
        headerStyle: { backgroundColor: "#007BFF" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
        headerRight: () =>
          route.name !== "Home" ? (
            <TouchableOpacity
              onPress={() => navigation.navigate("Home")}
              style={{ marginRight: 25 }}
            >
              <Icon name="home" size={30} color="#ddd" />
            </TouchableOpacity>
          ) : null,
      })}
    >
      <Stack.Screen name="Home">
        {(props) => (
          <GradientWrapper>
            <HomeScreen {...props} />
          </GradientWrapper>
        )}
      </Stack.Screen>
      <Stack.Screen name="BusSearch">
        {(props) => (
          <GradientWrapper>
            <AppAScreen {...props} />
          </GradientWrapper>
        )}
      </Stack.Screen>
      <Stack.Screen name="AppB">
        {(props) => (
          <GradientWrapper>
            <AppBScreen {...props} />
          </GradientWrapper>
        )}
      </Stack.Screen>
      <Stack.Screen name="AppC">
        {(props) => (
          <GradientWrapper>
            <AppCScreen {...props} />
          </GradientWrapper>
        )}
      </Stack.Screen>
    </Stack.Navigator>
  </NavigationContainer>
);

export default MainNavigator;

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
});
