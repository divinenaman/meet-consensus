import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button, ScrollView } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Card from "./src/components/Card";
import CreateEventScreen from "./src/screens/createEvent";

import "./src/services/firebase/firebase";
import { add, get } from "./src/services/firebase/methods";

const Stack = createNativeStackNavigator();

function Home({ navigation }) {
  return (
    <View style={styles.container}>
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
        <Card
          onPress={() => navigation.navigate("Create Event")}
          pressable={true}
        >
          <Text>Create Event</Text>
        </Card>
        <Card>
          <Text>Join Event</Text>
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
