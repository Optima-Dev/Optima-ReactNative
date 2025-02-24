import React from "react";
import { Text, Pressable, StyleSheet, Image } from "react-native";

export default function OnBoardingButton({ type, onPress }) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        type === "skip" ? styles.skip : styles.next,
        pressed && styles.pressed,
      ]}
      onPress={onPress}>
      {type === "skip" ? (
        <Text style={styles.skipText}>SKIP</Text>
      ) : (
        <>
          <Text style={styles.nextText}>
            {type === "next" ? "Next" : "Start"}
          </Text>
          <Image
            source={require("../../assets/Images/Forward-Icon.png")}
            style={styles.icon}
          />
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    width: 140,
    height: 45,
  },
  skip: {
    backgroundColor: "transparent",
  },
  next: {
    backgroundColor: "white",
  },
  pressed: {
    opacity: 0.6, // Reduce opacity when pressed
  },
  skipText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  nextText: {
    color: "blue",
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 5,
  },
  icon: {
    marginStart: 5,
  },
});
