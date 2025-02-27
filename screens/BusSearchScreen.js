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
import Icon from "react-native-vector-icons/FontAwesome";

// API Base URL
const BASE_URL = "http://192.168.31.136:8080";

const BusSearchScreen = () => {
  const [locations, setLocations] = useState([]);
  const [source, setSource] = useState(null);
  const [destination, setDestination] = useState(null);
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [loading, setLoading] = useState(false);
  const [routeStops, setRouteStops] = useState({}); // Store fetched stops for each route

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
      setExpandedRow(null);
    } catch (error) {
      console.error("Error searching buses:", error);
      Alert.alert("Error", "Failed to fetch bus schedules.");
    }
    setLoading(false);
  };

  // Fetch route stops for a given route
  const fetchRouteStops = async (routeId) => {
    try {
      const response = await fetch(`${BASE_URL}/route-stops/${routeId}`);
      const data = await response.json();
      setRouteStops((prevStops) => ({ ...prevStops, [routeId]: data }));
    } catch (error) {
      console.error("Error fetching route stops:", error);
      Alert.alert("Error", "Failed to load route stops.");
    }
  };

  const toggleExpand = (routeId) => {
    if (expandedRow === routeId) {
      setExpandedRow(null);
    } else {
      setExpandedRow(routeId);
      if (!routeStops[routeId]) {
        fetchRouteStops(routeId); // Fetch stops only if not already loaded
      }
    }
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
              <View style={{ width: "60%", flexDirection: "row" }}>
                <Text style={styles.tableHeaderText}>Source</Text>
                <Text style={styles.tableHeaderText}>Destination</Text>
              </View>
              <Text style={styles.tableHeaderText}>Time</Text>
              <Text style={styles.tableHeaderText}>Days</Text>
            </View>
          )}

          <FlatList
            data={filteredSchedules}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => {
              const stops = routeStops[item.route.id] || [];
              return (
                <View>
                  <TouchableOpacity
                    onPress={() => toggleExpand(item.route.id)}
                    style={styles.tableRow}
                  >
                    <View style={{ width: "60%", flexDirection: "row" }}>
                      <Text style={styles.tableRowText}>
                        {item.route.source.name}
                      </Text>
                      <Text style={styles.tableRowText}>
                        {item.route.destination.name}
                      </Text>
                    </View>
                    <Text style={styles.tableRowText}>
                      {item.departureTime} - {item.arrivalTime}
                    </Text>
                    <Text>{item.weekDays}</Text>
                    <Icon
                      name={
                        expandedRow === item.route.id
                          ? "chevron-up"
                          : "chevron-down"
                      }
                      size={16}
                      color="black"
                      style={styles.expandIcon}
                    />
                  </TouchableOpacity>

                  {expandedRow === item.route.id && (
                    <View style={styles.routeStopsContainer}>
                      <Text style={styles.stopsHeader}>Via:</Text>
                      {stops.map((stop) => (
                        <Text key={stop.id} style={styles.routeStopText}>
                          {stop.stop.name} - {stop.stopTime}
                        </Text>
                      ))}
                    </View>
                  )}
                </View>
              );
            }}
          />
        </View>
      )}
    </View>
  );
};

export default BusSearchScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  buttonText: {
    fontWeight: "bold",
    fontSize: 18,
    color: "white",
    marginVertical: 5,
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
    padding: 5,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#007AFF",
    padding: 10,
  },
  tableHeaderText: { flex: 1, color: "white", fontWeight: "bold", padding: 1 },
  tableRow: {
    flexDirection: "row",
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  tableRowText: { flex: 1 },
  routeStopsContainer: { padding: 10, backgroundColor: "#e0e0e0" },
  routeStopText: { fontSize: 14, marginVertical: 2 },
  expandIcon: { marginLeft: 1 },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },
  stopsHeader: { fontStyle: "italic", fontWeight: "bold" },
});
