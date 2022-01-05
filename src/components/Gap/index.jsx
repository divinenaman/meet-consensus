import React from "react";
import { StyleSheet, View, Pressable } from "react-native";

export default function Gap({
  children,
  top = 10,
  bottom = 10,
  right = 10,
  left = 10,
}) {
  const preprocessChildren = () => {
    return React.Children.map(children, (child, i) => {
      const s = child.props?.style || {};

      return React.cloneElement(child, {
        style: {
          ...s,
          marginTop: top,
          marginBottom: bottom,
          marginLeft: left,
          marginRight: right,
        },
      });
    });
  };

  return <View style={styles.container}>{preprocessChildren()}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
