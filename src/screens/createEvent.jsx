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
import Gap from "../components/Gap";

import Firebase from "../services/firebase/methods.js";

function DateInput({ onChange }) {
  const [_date, setDate] = useState({});
  const re = {
    day: /^[0-9]{1,2}$/,
    month: /^[0-9]{1,2}$/,
    year: /^[0-9]{1,4}$/,
  };

  useEffect(() => {
    onChange(_date);
  }, [_date]);

  const handleChange = (key, val) => {
    if (
      (key == "day" || key == "month" || key == "year") &&
      (val == "" || val.match(re[key]))
    ) {
      setDate((e) => {
        return {
          ...e,
          [key]: val,
        };
      });
    }
  };

  return (
    <View
      style={{
        width: "100%",
        flexDirection: "row",
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

  const re = {
    hours: /^[0-9]{1,2}$/,
    mins: /^[0-9]{1,2}$/,
  };

  useEffect(() => {
    onChange({
      hours: dur?.hours ? dur?.hours : 0,
      mins: dur?.mins ? dur?.mins : 0,
    });
  }, [dur]);

  const handleChange = (key, val) => {
    if (
      (key == "hours" || key == "mins") &&
      (val == "" || val.match(re[key]))
    ) {
      if (!val || !(key == "mins") || parseInt(val) < 60) {
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
        alignItems: "center",
      }}
    >
      <TextInput
        placeholder="hours"
        value={dur?.hours || ""}
        onChangeText={(e) => handleChange("hours", e)}
        style={{ textAlign: "right" }}
      />
      <Text> : </Text>
      <TextInput
        placeholder="minutes"
        value={dur?.mins || ""}
        onChangeText={(e) => handleChange("mins", e)}
        style={{ textAlign: "left" }}
      />
    </View>
  );
}

export default function CreateEventScreen() {
  const [name, setName] = useState("");
  const [_date, setDate] = useState("");
  const [minD, setMinD] = useState("");
  const [status, setStatus] = useState("");

  const handleChange = async () => {
    const d = new Date();
    if (
      name &&
      parseInt(_date.day) >= d.getDate() &&
      parseInt(_date.month) >= d.getMonth() + 1 &&
      _date.year >= d.getFullYear() &&
      (minD.hours || minD.mins)
    ) {
      // ADD data to DB
      const res = await Firebase.add("events", {
        name,
        min_duration: minD,
        date: _date,
        exclusion: []
      });
      setStatus("Event Successfully Created");
    } else {
      setStatus("Fill All fields Correctly");
    }
  };

  return (
    <View style={styles.container}>
      <Card minHeight={500}>
        <Gap left={0} right={0} top={20} bottom={20}>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Text>Event Name</Text>
            <TextInput
              placeholder="enter"
              value={name}
              onChangeText={(e) => setName(e)}
            />
          </View>

          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Text>Date</Text>
            <DateInput onChange={(d) => setDate(d)} />
          </View>

          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Text>Minimum Duration</Text>
            <DurationInput placeholder="enter" onChange={(e) => setMinD(e)} />
          </View>

          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Button title="Add Event" onPress={handleChange} />
          </View>
          <Text>{status}</Text>
        </Gap>
      </Card>
    </View>
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
    marginVertical: 10,
  },
});
