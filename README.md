# Multi-App Navigation in React Native with Expo

This project demonstrates how to create a React Native application using Expo, featuring a home screen with icons for "App A," "App B," and "App C." Clicking on each icon navigates to the respective app's screen.

## Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

## Setup Instructions

1. **Initialize the React Native Project:**

   Create a new Expo project using the blank template:

   ```bash
   npx create-expo-app MultiAppNavigation --template blank
   cd MultiAppNavigation
   ```

2. **Install Dependencies:**

   Install React Navigation and React Native Vector Icons:

   ```bash
   npm install @react-navigation/native @react-navigation/stack react-native-vector-icons
   ```

   For iOS, install the necessary pods:

   ```bash
   cd ios && pod install && cd ..
   ```

3. **Set Up Navigation:**

   Create a `navigation` directory and add a `MainNavigator.js` file to define your navigation structure:

   ```javascript
   // navigation/MainNavigator.js
   import React from "react";
   import { createStackNavigator } from "@react-navigation/stack";
   import { NavigationContainer } from "@react-navigation/native";
   import HomeScreen from "../screens/HomeScreen";
   import AppAScreen from "../screens/AppAScreen";
   import AppBScreen from "../screens/AppBScreen";
   import AppCScreen from "../screens/AppCScreen";

   const Stack = createStackNavigator();

   const MainNavigator = () => (
     <NavigationContainer>
       <Stack.Navigator initialRouteName="Home">
         <Stack.Screen name="Home" component={HomeScreen} />
         <Stack.Screen name="AppA" component={AppAScreen} />
         <Stack.Screen name="AppB" component={AppBScreen} />
         <Stack.Screen name="AppC" component={AppCScreen} />
       </Stack.Navigator>
     </NavigationContainer>
   );

   export default MainNavigator;
   ```

4. **Create Screen Components:**

   Create a `screens` directory and add the following screen components:

   - **HomeScreen.js:**

     ```javascript
     // screens/HomeScreen.js
     import React from "react";
     import { View, Text, TouchableOpacity } from "react-native";
     import Icon from "react-native-vector-icons/FontAwesome";

     const HomeScreen = ({ navigation }) => (
       <View
         style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
       >
         <TouchableOpacity onPress={() => navigation.navigate("AppA")}>
           <Icon name="app" size={50} color="#000" />
           <Text>App A</Text>
         </TouchableOpacity>
         <TouchableOpacity onPress={() => navigation.navigate("AppB")}>
           <Icon name="app" size={50} color="#000" />
           <Text>App B</Text>
         </TouchableOpacity>
         <TouchableOpacity onPress={() => navigation.navigate("AppC")}>
           <Icon name="app" size={50} color="#000" />
           <Text>App C</Text>
         </TouchableOpacity>
       </View>
     );

     export default HomeScreen;
     ```

   - **AppAScreen.js:**

     ```javascript
     // screens/AppAScreen.js
     import React from "react";
     import { View, Text } from "react-native";

     const AppAScreen = () => (
       <View
         style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
       >
         <Text>Welcome to App A</Text>
       </View>
     );

     export default AppAScreen;
     ```

   - **AppBScreen.js:**

     ```javascript
     // screens/AppBScreen.js
     import React from "react";
     import { View, Text } from "react-native";

     const AppBScreen = () => (
       <View
         style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
       >
         <Text>Welcome to App B</Text>
       </View>
     );

     export default AppBScreen;
     ```

   - **AppCScreen.js:**

     ```javascript
     // screens/AppCScreen.js
     import React from "react";
     import { View, Text } from "react-native";

     const AppCScreen = () => (
       <View
         style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
       >
         <Text>Welcome to App C</Text>
       </View>
     );

     export default AppCScreen;
     ```

5. **Update `App.js`:**

   Modify your `App.js` to include the `MainNavigator`:

   ```javascript
   // App.js
   import React from "react";
   import MainNavigator from "./navigation/MainNavigator";

   const App = () => <MainNavigator />;

   export default App;
   ```

6. **Run Your Application:**

   Start your application:

   ```bash
   npx expo start
   ```

   This command will start the Expo development server. You can then scan the QR code with the Expo Go app on your mobile device or press `a` to run it on an Android emulator.

   Upon launching, you'll see icons labeled "App A," "App B," and "App C." Clicking on each will navigate to the respective screen.

## Additional Resources

For more detailed information on navigation in React Native, refer to the official React Navigation documentation:

- [React Navigation Documentation](https://reactnavigation.org/docs/getting-started/)

For a visual guide on creating your first Expo app, you might find the following video helpful:

[How to create your first Expo app | Universal App tutorial #1](https://www.youtube.com/watch?v=m1-bc53EGh8&utm_source=chatgpt.com)

For a visual guide on navigating between screens in React Native, you might find the following video helpful:

[React Native Tutorial - 74 - Navigation between Screens](https://www.youtube.com/watch?v=CZcyZ1uF4g8)
