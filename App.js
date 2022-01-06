import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Button,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import "./src/services/firebase/firebase.js";
import Firebase from "./src/services/firebase/methods.js";
import AsyncStorage from "./src/services/AsyncStorage/storage.js";

import Gap from "./src/components/Gap";
import Card from "./src/components/Card";
import CreateEventScreen from "./src/screens/createEvent";
import EventListScreen from "./src/screens/eventList";

const Stack = createNativeStackNavigator();

function JoinEvent() {
  const [code, setCode] = useState("");

  const handleSubmit = async () => {
    if (code) {
      const res = await Firebase.getSingle("events", code);
      if (res) {
        await AsyncStorage.storeDataInArray("events", code);
      }
      setCode("");
    }
  };

  return (
    <Gap left={0} right={0}>
      <Text>Join Event</Text>
      <TextInput
        placeholder="Enter Code"
        value={code}
        onChangeText={(e) => setCode(e)}
      />
      <Button title="Submit" onPress={handleSubmit} />
    </Gap>
  );
}

function Home({ navigation }) {
  return (
    <View style={styles.container}>
      <ScrollView
        style={{
          width: "100%",
        }}
        contentContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Card
          onPress={() => navigation.navigate("Create Event")}
          pressable={true}
        >
          <Text>Create Event</Text>
        </Card>
        <Card>
          <JoinEvent />
        </Card>
        <Card onPress={() => navigation.navigate("Events")} pressable={true}>
          <Text>Events</Text>
        </Card>
      </ScrollView>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={"Home"}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Create Event" component={CreateEventScreen} />
        <Stack.Screen name="Events" component={EventListScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    minHeight: "100%",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
});
