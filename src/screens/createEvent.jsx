import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Pressable,
  TextInput,
  Text,
  Button,
} from "react-native";

import Card from "../components/Card";

function DateInput({ onChange }) {
  const [_date, setDate] = useState({});

  useEffect(() => {
    onChange(_date);
  }, [_date]);

  const handleChange = (key, val) => {
    if (val && parseInt(val)) {
      if (key == "day" || key == "month" || key == "year") {
        setDate((e) => {
          return {
            ...e,
            [key]: val,
          };
        });
      }
    }
  };

  return (
    <View
      style={{
        width: "100%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <TextInput
        placeholder="DD"
        value={_date?.day || ""}
        onChangeText={(e) => handleChange("day", e)}
      />
      <Text> / </Text>
      <TextInput
        placeholder="MM"
        value={_date?.month || ""}
        onChangeText={(e) => handleChange("month", e)}
      />
      <Text> / </Text>
      <TextInput
        placeholder="YYYY"
        value={_date?.year || ""}
        onChangeText={(e) => handleChange("year", e)}
      />
    </View>
  );
}

function DurationInput({ onChange }) {
  const [dur, setDur] = useState({});

  useEffect(() => {
    onChange(dur);
  }, [dur]);

  const handleChange = (key, val) => {
    if (val && parseInt(val)) {
      if (key == "hours" || key == "mins") {
        setDur((e) => {
          return {
            ...e,
            [key]: val,
          };
        });
      }
    }
  };

  return (
    <View
      style={{
        width: "100%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <TextInput
        placeholder="hours"
        value={dur?.hours || ""}
        onChangeText={(e) => handleChange("hours", e)}
      />
      <Text> : </Text>
      <TextInput
        placeholder="minutes"
        value={dur?.mins || ""}
        onChangeText={(e) => handleChange("mins", e)}
      />
    </View>
  );
}

export default function CreateEventScreen() {
  const [name, setName] = useState("");
  const [_date, setDate] = useState("");
  const [minD, setMinD] = useState("");
  const [status, setStatus] = useState("");

  const handleChange = () => {
    if (!name && !_date && !minD) {
        // ADD data to DB
        setStatus("Event Successfully Created")    
    } else {
        setStatus("Fill All fields Correctly")
    }
  } 

  return (
    <Card>
      <Text>Event Name</Text>
      <TextInput
        placeholder="enter"
        value={name}
        onChangeText={(e) => setName(e)}
      />
      <Text>Date</Text>
      <DateInput onChange={(d) => setDate(d)} />
      <Text>Minimum Duration</Text>
      <DurationInput placeholder="enter" onChange={(e) => setMinD(e)} />
      <Button title="Add Event" onPress={handleChange} />
      <Text style={{ margin: 10, color: "red" }}>{status}</Text>  
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    padding: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    borderColor: "#000",
    borderStyle: "solid",
    borderWidth: 2,
    marginVertical: 10,
    elevation: 5,
  },
});
