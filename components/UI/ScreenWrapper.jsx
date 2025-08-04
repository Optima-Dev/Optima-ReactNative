// components/ScreenWrapper.js
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import Colors from "../../constants/Colors";

const ScreenWrapper = ({ children, style, edges = ["top", "bottom"] }) => {
  return (
    <SafeAreaView style={[styles.container, style]} edges={edges}>
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.MainColor, // or your default background
  },
});

export default ScreenWrapper;
