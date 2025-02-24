import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";

// Sample Data (Simulating Database)
const locations = [
  { id: 1, name: "Basavakalyan" },
  { id: 2, name: "Gulbarga" },
  { id: 3, name: "Mudbi" },
  { id: 4, name: "Humnabad" },
  { id: 5, name: "Rajeshwar" },
  { id: 6, name: "Tadola" },
  { id: 7, name: "Kamlapur" },
];

const routes = [
  { id: 1, sourceId: 1, destinationId: 2 },
  { id: 2, sourceId: 1, destinationId: 2 },
  { id: 3, sourceId: 4, destinationId: 5 },
];

const routeStops = [
  { routeId: 1, stopId: 3, stopSequence: 1, stopTime: "08:15" },
  { routeId: 1, stopId: 7, stopSequence: 2, stopTime: "08:30" },
  { routeId: 2, stopId: 5, stopSequence: 1, stopTime: "09:00" },
  { routeId: 2, stopId: 4, stopSequence: 2, stopTime: "09:30" },
  { routeId: 3, stopId: 2, stopSequence: 1, stopTime: "10:15" },
];

const schedules = [
  {
    id: 1,
    busNumber: "105A",
    routeId: 1,
    departureTime: "08:00",
    arrivalTime: "08:45",
    weekDays: "Mon-Fri",
  },
  {
    id: 2,
    busNumber: "220B",
    routeId: 2,
    departureTime: "09:00",
    arrivalTime: "09:45",
    weekDays: "Mon-Fri",
  },
  {
    id: 3,
    busNumber: "330C",
    routeId: 3,
    departureTime: "10:00",
    arrivalTime: "10:45",
    weekDays: "Sat-Sun",
  },
];

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
  const [source, setSource] = useState(locations[0].id);
  const [destination, setDestination] = useState(locations[1].id);
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);

  const searchBus = () => {
    const results = schedules.filter((schedule) => {
      const route = routes.find((r) => r.id === schedule.routeId);
      return route.sourceId === source && route.destinationId === destination;
    });
    setFilteredSchedules(results);
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

      <View style={styles.tableContainer}>
        {filteredSchedules.length === 0 && (
          <Text style={styles.label}>No buses found</Text>
        )}
        {filteredSchedules.length > 0 && (
          <View style={styles.tableHeader}>
            {/*<Text style={styles.tableHeaderText}>Bus</Text> */}
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
          renderItem={({ item }) => {
            const route = routes.find((r) => r.id === item.routeId);
            const stops = routeStops.filter(
              (stop) => stop.routeId === item.routeId
            );
            return (
              <View>
                <TouchableOpacity
                  onPress={() => toggleExpand(item.id)}
                  style={styles.tableRow}
                >
                  {/*<Text style={styles.tableRowText}>{item.busNumber}</Text> */}
                  <Text style={styles.tableRowText}>
                    {locations.find((loc) => loc.id === route.sourceId).name}
                  </Text>
                  <Text style={styles.tableRowText}>
                    {
                      locations.find((loc) => loc.id === route.destinationId)
                        .name
                    }
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
                    <Text style={styles.stopsHeader}>Via:</Text>
                    {stops.map((stop) => (
                      <Text key={stop.stopId} style={styles.routeStopText}>
                        {locations.find((loc) => loc.id === stop.stopId).name} -{" "}
                        {stop.stopTime}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            );
          }}
        />
      </View>
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
  routeStopsContainer: { padding: 10, backgroundColor: "#e0e0e0" },
  routeStopText: { fontSize: 14, marginVertical: 2 },
  expandIcon: { marginLeft: 5 },
  busIcon: {
    backgroundColor: "#E3F2FD",
    padding: 15,
    borderRadius: 50,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },
  stopsHeader: {
    fontStyle: "italic",
    fontWeight: "bold",
  },
});
