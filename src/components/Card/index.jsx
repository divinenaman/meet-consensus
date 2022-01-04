import { StyleSheet, View, Pressable } from "react-native";

export default function Card({
  width = "100%",
  minHeight = 200,
  children,
  pressable = false,
  onPress,
}) {
  return (
    <Pressable
      style={{ width, minHeight }}
      onPress={pressable ? onPress : null}
    >
      <View style={[styles.container, { width: "100%", height: "100%" }]}>
        {children}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    borderColor: "#000",
    borderStyle: "solid",
    borderWidth: 2,
    marginVertical: 10,
    elevation: 5
  },
});
