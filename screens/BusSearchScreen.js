import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TextInput,
  Keyboard,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useDebouncedSearch } from "../hooks/useDebouncedSearch";

const BASE_URL = "http://192.168.31.136:8080";

const BusSearchScreen = () => {
  const [source, setSource] = useState(null);
  const [destination, setDestination] = useState(null);
  const [sourceInput, setSourceInput] = useState("");
  const [destinationInput, setDestinationInput] = useState("");
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [loading, setLoading] = useState(false);
  const [routeStops, setRouteStops] = useState({});
  const [sourceSuggestions, setSourceSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [showSourceDropdown, setShowSourceDropdown] = useState(false);
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);

  // Debounced API calls for Source & Destination
  useDebouncedSearch(source, (query) =>
    fetchLocations(query, setSourceSuggestions, setShowSourceDropdown)
  );
  useDebouncedSearch(destination, (query) =>
    fetchLocations(query, setDestinationSuggestions, setShowDestinationDropdown)
  );

  const fetchLocations = async (query, setSuggestions, setShowDropdown) => {
    try {
      const response = await fetch(
        `${BASE_URL}/locations/searchByNameLike?placeName=${query}`
      );
      const data = await response.json();
      console.log("Fetched locations count for query ", query, data.length);
      setSuggestions(data);
      setShowDropdown(true);
    } catch (error) {
      console.error("Error fetching locations:", error);
      setSuggestions([]);
      setShowDropdown(false);
    }
  };

  const handleSelection = (
    item,
    setSelection,
    setInput,
    setSuggestions,
    setShowDropdown
  ) => {
    setSelection(item);
    setInput(item.placeName);
    setSuggestions([]);
    setShowDropdown(false);
    Keyboard.dismiss();
  };

  const searchBus = async () => {
    if (!source || !destination || source.id === destination.id) {
      Alert.alert("Error", "Please select a valid source and destination.");
      return;
    }

    console.log("Bus Search:", source.placeName, destination.placeName);

    setLoading(true);
    try {
      const response = await fetch(
        `${BASE_URL}/schedules/search?sourceId=${source.id}&destinationId=${destination.id}`
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
        fetchRouteStops(routeId);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Source</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter Source"
          value={sourceInput}
          onChangeText={(text) => {
            setSourceInput(text); // Update the input value
            setSource(text); // Trigger the debounced search
          }}
        />
        {showSourceDropdown && sourceSuggestions.length > 0 && (
          <View style={styles.dropdown}>
            <FlatList
              keyboardShouldPersistTaps="handled"
              data={sourceSuggestions}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.suggestionItem}
                  onPress={() => {
                    console.log("✅ TouchableOpacity Pressed:", item.placeName);
                    handleSelection(
                      item,
                      setSource,
                      setSourceInput,
                      setSourceSuggestions,
                      setShowSourceDropdown
                    );
                  }}
                >
                  <Text>{`${item.placeName}, ${item.taluka}, ${item.state}`}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </View>

      <Text style={styles.label}>Select Destination</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter Destination"
          value={destinationInput}
          onChangeText={(text) => {
            console.log("✅ onChangeText:", text);
            setDestinationInput(text);
            setDestination(text);
          }}
        />
        {showDestinationDropdown && destinationSuggestions.length > 0 && (
          <View style={styles.dropdown}>
            <FlatList
              keyboardShouldPersistTaps="handled"
              data={destinationSuggestions}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.suggestionItem}
                  onPress={() =>
                    handleSelection(
                      item,
                      setDestination,
                      setDestinationInput,
                      setDestinationSuggestions,
                      setShowDestinationDropdown
                    )
                  }
                >
                  <Text>{`${item.placeName}, ${item.taluka}, ${item.state}`}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </View>

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
                        {item.route.source.placeName}
                      </Text>
                      <Text style={styles.tableRowText}>
                        {item.route.destination.placeName}
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
                          {stop.stop.placeName} - {stop.stopTime}
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
  label: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
  inputContainer: { position: "relative" },
  input: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
  },
  dropdown: {
    position: "absolute",
    top: 45,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    zIndex: 1000,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  searchButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { fontWeight: "bold", fontSize: 18, color: "white" },
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
  tableHeaderText: { flex: 1, color: "white", fontWeight: "bold" },
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
  stopsHeader: { fontStyle: "italic", fontWeight: "bold" },
});
