import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  ScrollView,
  Button,
  Modal,
  Pressable,
} from "react-native";

import * as Clipboard from 'expo-clipboard';

import Card from "../components/Card";
import Gap from "../components/Gap";

import Firebase from "../services/firebase/methods.js";
import AsyncStorage from "../services/AsyncStorage/storage.js";

function calculateAvailableIntervals(arr, min_interval) {
  let d1 = new Date();
  let d2 = new Date();
  let available_intervals = [];
  let a = arr[0];
  for (let i = 1; i < arr.length; i++) {
    let b = a.split("-").map((x) => x.split(":"));
    let c = arr[i].split("-").map((x) => x.split(":"));
    d1.setHours(b[1][0], b[1][1], 0, 0);
    d2.setHours(c[0][0], c[0][1], 0, 0);

    if (d1.getTime() >= d2.getTime()) {
      d2.setHours(c[1][0], c[1][1]);

      if (d1.getTime() >= d2.getTime()) {
        a = `${b[0].join(":")}-${c[1].join(":")}`;
      } else {
        a = `${b[0].join(":")}-${c[1].join(":")}`;
      }
    } else {
      const diff = parseInt((d2.getTime() - d1.getTime()) / 1000);
      const req_diff =
        parseInt(min_interval?.hours) * 60 * 60 +
        parseInt(min_interval?.mins) * 60;

      if (diff >= req_diff) {
        let s = `${b[1].join(":")}-${c[0].join(":")}`;
        available_intervals.push(s);
      }
      a = arr[i];
    }
  }

  return available_intervals;
}

function calculateFreeTimeSlots(exclusions, min_diff) {
  let d1 = new Date();
  let d2 = new Date();
  exclusions.sort((a, b) => {
    const t1 = a.split("-")[0].split(":");
    const t2 = b.split("-")[0].split(":");
    d1.setHours(t1[0], t1[1], 0, 0);
    d2.setHours(t2[0], t2[1], 0, 0);
    return d1.getTime() - d2.getTime();
  });
  return calculateAvailableIntervals(
    ["12:00-12:00", ...exclusions, "23:59-23:59"],
    min_diff
  );
}

function TimeRange({ onChange }) {
  const [dur, setDur] = useState({});

  const re = {
    hours: /^[0-9]{1,2}$/,
    mins: /^[0-9]{1,2}$/,
  };

  useEffect(() => {
    let s = {};
    Object.keys(dur).forEach((x) => {
      s[x] = dur[x] ? dur[x] : 0;
    });
    onChange({ ...s });
  }, [dur]);

  const handleChange = (prefix, key, val) => {
    if (val == "" || val.match(re[key])) {
      if (!val || !(key == "mins") || parseInt(val) < 60) {
        setDur((e) => {
          return {
            ...e,
            [`${prefix}_${key}`]: val,
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
        justifyContent: "center",
      }}
    >
      <TextInput
        placeholder="hours"
        value={dur?.from_hours || ""}
        onChangeText={(e) => handleChange("from", "hours", e)}
        style={{ textAlign: "right" }}
      />
      <Text> : </Text>
      <TextInput
        placeholder="minutes"
        value={dur?.from_mins || ""}
        onChangeText={(e) => handleChange("from", "mins", e)}
        style={{ textAlign: "left" }}
      />
      <Text> to </Text>
      <TextInput
        placeholder="hours"
        value={dur?.to_hours || ""}
        onChangeText={(e) => handleChange("to", "hours", e)}
        style={{ textAlign: "right" }}
      />
      <Text> : </Text>
      <TextInput
        placeholder="minutes"
        value={dur?.to_mins || ""}
        onChangeText={(e) => handleChange("to", "mins", e)}
        style={{ textAlign: "left" }}
      />
    </View>
  );
}

function EventModal({ visible, setVisible, data, reloadData }) {
  const [trange, setTrange] = useState(null);

  const handleSubmit = async () => {
    if (!trange || !data) return;

    let d1 = new Date();
    let d2 = new Date(data.date.year, data.date.month, data.date.day);
    let d3 = new Date(data.date.year, data.date.month, data.date.day);
    d2.setHours(trange["from_hours"], trange["from_mins"], 0, 0);
    d3.setHours(trange["to_hours"], trange["to_mins"], 0, 0);

    const t1 = d1.getTime();
    const t2 = d2.getTime();
    const t3 = d3.getTime();

    if ((d1 < d2 || t1 < t2) && t2 < t3) {
      let tstring = `${trange["from_hours"]}:${trange["from_mins"]}-${trange["to_hours"]}:${trange["to_mins"]}`;
      await Firebase.update(
        "events",
        data.id,
        Firebase.preprocessor.list.append("exclusions", tstring)
      );

      reloadData();
    } else {
      console.log("invalid date");
    }
  };

  const copyToClipboard = (e) => {
    Clipboard.setString(e);
  };

  return (
    <Modal
      animationType="slide"
      visible={visible}
      transparent={false}
      onRequestClose={() => setVisible(null)}
    >
      {data && (
        <View style={{ flex: 1, justifyContent: "flex-start" }}>
          <Gap left={0} right={0} top={5} bottom={5}>
            <Text style={{ fontSize: 32, fontWeight: "bold" }}>
              {"Event: " + data.name}
            </Text>
            <Text>
              {"Date: " +
                `${data.date.day}/${data.date.month}/${data.date.year}`}
            </Text>
            <Text>
              {"Duration: " +
                `${data.min_duration.hours} hrs : ${data.min_duration.mins} mins`}
            </Text>
            <Pressable onPress={() => copyToClipboard(data.id)}>
                <Text>{"Code:  "+data.id + "  (click to copy)" }</Text>
            </Pressable>
          </Gap>
          <Gap left={0} right={0} top={5} bottom={5}>
            <View style={{ flexDirection: "row" }}>
              {data?.exclusions &&
                data?.exclusions.map((x, i) => {
                  return (
                    <Text
                      style={{
                        padding: 10,
                        color: "red",
                        margin: 10,
                        borderRadius: 20,
                      }}
                    >
                      {x}
                    </Text>
                  );
                })}
            </View>
            <View style={{ flexDirection: "row" }}>
              {data?.exclusions &&
                calculateFreeTimeSlots(data.exclusions, data.min_duration).map(
                  (x, i) => {
                    return (
                      <Text
                        style={{
                          padding: 10,
                          color: "green",
                          margin: 10,
                          borderRadius: 20,
                        }}
                      >
                        {x}
                      </Text>
                    );
                  }
                )}
            </View>
          </Gap>
          <Gap left={0} right={0} top={5} bottom={5}>
            <Text style={{ fontSize: 32, fontWeight: "bold" }}>Exclude</Text>
            <TimeRange onChange={(e) => setTrange(e)} />
            <Button title="Submit" onPress={handleSubmit} />
          </Gap>
        </View>
      )}
    </Modal>
  );
}

export default function EventListScreen() {
  const [data, setData] = useState(null);
  const [modalData, setModalData] = useState(null);

  const getData = async () => {
    const res = await AsyncStorage.readData("events");
    let data = await Firebase.getMultiple("events");
    data = res.map((x) => {
      return { ...data[x], id: x };
    });
    setData(data);
  };

  const reloadData = async () => {
    const res = await AsyncStorage.readData("events");
    let data = await Firebase.getMultiple("events");
    data = res.map((x) => {
      if (modalData.id == x) {
        setModalData({ ...data[x], id: x });
      }
      return { ...data[x], id: x };
    });

    setData(data);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <View style={styles.container}>
      <EventModal
        reloadData={reloadData}
        visible={modalData != null}
        setVisible={setModalData}
        data={modalData}
      />
      <ScrollView
        style={{
          width: "100%",
        }}
      >
        {data &&
          data.map((x, i) => {
            return (
              <Card
                key={i}
                minHeight={150}
                pressable={true}
                onPress={() => setModalData(x)}
              >
                <Gap>
                  <Text>{"name: "+x.name}</Text>
                </Gap>
              </Card>
            );
          })}
      </ScrollView>
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
  },
});
