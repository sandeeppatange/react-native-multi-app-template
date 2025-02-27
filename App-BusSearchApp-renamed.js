import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";

// API Endpoints
const BASE_URL = "http://localhost:8080";

const HomeScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.navigate("Search")}
        style={styles.busButton}
      >
        <Icon name="bus" size={100} color="white" />
        <Text style={styles.buttonText}>Search Bus</Text>
      </TouchableOpacity>
    </View>
  );
};

const SearchScreen = () => {
  const [locations, setLocations] = useState([]);
  const [source, setSource] = useState(null);
  const [destination, setDestination] = useState(null);
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRoutes();
  }, []);

  // Fetch locations from the API
  const fetchRoutes = async () => {
    try {
      const response = await fetch(`${BASE_URL}/routes`);
      const data = await response.json();

      if (data.length > 0) {
        const uniqueLocations = extractUniqueLocations(data);
        setLocations(uniqueLocations);
        setSource(uniqueLocations[0].id);
        setDestination(uniqueLocations[1]?.id || uniqueLocations[0].id);
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
      Alert.alert("Error", "Failed to load locations.");
    }
  };

  // Extract unique locations from routes
  const extractUniqueLocations = (routes) => {
    const locationsMap = new Map();
    routes.forEach((route) => {
      locationsMap.set(route.source.id, route.source);
      locationsMap.set(route.destination.id, route.destination);
    });
    return Array.from(locationsMap.values());
  };

  // Search buses based on source and destination
  const searchBus = async () => {
    if (!source || !destination) {
      Alert.alert("Error", "Please select a valid source and destination.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${BASE_URL}/schedules/search?sourceId=${source}&destinationId=${destination}`
      );
      const data = await response.json();
      setFilteredSchedules(data);
    } catch (error) {
      console.error("Error searching buses:", error);
      Alert.alert("Error", "Failed to fetch bus schedules.");
    }
    setLoading(false);
  };

  const toggleExpand = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Source</Text>
      <Picker
        selectedValue={source}
        onValueChange={(itemValue) => setSource(itemValue)}
        style={styles.picker}
      >
        {locations.map((loc) => (
          <Picker.Item key={loc.id} label={loc.name} value={loc.id} />
        ))}
      </Picker>

      <Text style={styles.label}>Select Destination</Text>
      <Picker
        selectedValue={destination}
        onValueChange={(itemValue) => setDestination(itemValue)}
        style={styles.picker}
      >
        {locations.map((loc) => (
          <Picker.Item key={loc.id} label={loc.name} value={loc.id} />
        ))}
      </Picker>

      <TouchableOpacity onPress={searchBus} style={styles.searchButton}>
        <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#007AFF"
          style={{ marginTop: 20 }}
        />
      ) : (
        <View style={styles.tableContainer}>
          {filteredSchedules.length === 0 && (
            <Text style={styles.label}>No buses found</Text>
          )}
          {filteredSchedules.length > 0 && (
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderText}>Bus</Text>
              <Text style={styles.tableHeaderText}>Source</Text>
              <Text style={styles.tableHeaderText}>Destination</Text>
              <Text style={styles.tableHeaderText}>Time</Text>
              <Text style={styles.tableHeaderText}>Days</Text>
              <Text style={styles.tableHeaderText}></Text>
            </View>
          )}

          <FlatList
            data={filteredSchedules}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View>
                <TouchableOpacity
                  onPress={() => toggleExpand(item.id)}
                  style={styles.tableRow}
                >
                  <Text style={styles.tableRowText}>{item.bus.busNumber}</Text>
                  <Text style={styles.tableRowText}>
                    {item.route.source.name}
                  </Text>
                  <Text style={styles.tableRowText}>
                    {item.route.destination.name}
                  </Text>
                  <Text style={styles.tableRowText}>
                    {item.departureTime} - {item.arrivalTime}
                  </Text>
                  <Text style={styles.tableRowText}>{item.weekDays}</Text>
                  <Icon
                    name={
                      expandedRow === item.id ? "chevron-up" : "chevron-down"
                    }
                    size={16}
                    color="black"
                    style={styles.expandIcon}
                  />
                </TouchableOpacity>

                {expandedRow === item.id && (
                  <View style={styles.routeStopsContainer}>
                    <Text style={styles.stopsHeader}>Stops:</Text>
                    {/* Stops can be added dynamically when API is extended */}
                  </View>
                )}
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
};

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: "#1E88E5" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f4f4f4" },
  busButton: {
    backgroundColor: "#1E88E5",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    margin: 80,
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 18,
    color: "white",
    marginTop: 10,
  },
  searchButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  picker: { backgroundColor: "white", marginBottom: 10 },
  tableContainer: {
    marginTop: 20,
    backgroundColor: "white",
    borderRadius: 5,
    padding: 10,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#007AFF",
    padding: 10,
  },
  tableHeaderText: { flex: 1, color: "white", fontWeight: "bold" },
  tableRow: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  tableRowText: { flex: 1 },
  expandIcon: { marginLeft: 5 },
});
