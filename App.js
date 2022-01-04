import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button, ScrollView } from "react-native";

import Card from "./src/components/Card";
import CreateEventScreen from "./src/screens/createEvent";

import "./src/services/firebase/firebase";
import { add, get } from "./src/services/firebase/methods";

export default function App() {
  return (
    <>
      <StatusBar hidden />
      <View style={styles.container}>
        <CreateEventScreen />
        <ScrollView
          style={{
            width: "100%",
            marginTop: 30,
          }}
          contentContainerStyle={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Card>
            <Text>Create Event</Text>
          </Card>
          <Card>
            <Text>Join Event</Text>
          </Card>
        </ScrollView>
      </View>
    </>
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
