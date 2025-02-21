// navigation/MainNavigator.js
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "../screens/HomeScreen";
import AppAScreen from "../screens/AppAScreen";
import AppBScreen from "../screens/AppBScreen";
import AppCScreen from "../screens/AppCScreen";

const Stack = createStackNavigator();

/*
    The MainNavigator component contains a Stack.Navigator component.
    Inside the Stack.Navigator component, we have added four Stack.Screen components.
    The Stack.Screen components are used to define the screens of the app.
    The name prop is used to define the name of the screen and the component prop is used to define the component that will be rendered when the screen is navigated to.
    We have also set the initialRouteName prop of the Stack.Navigator component to Home so that the HomeScreen component is rendered when the app is first opened.
*/

const MainNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="GovtBusSearch" component={AppAScreen} />
      <Stack.Screen name="AppB" component={AppBScreen} />
      <Stack.Screen name="AppC" component={AppCScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default MainNavigator;
