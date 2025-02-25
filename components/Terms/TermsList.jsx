import { View, FlatList, StyleSheet } from "react-native";

import TermItem from "./TermItem"; // Import the TermItem component
import DetailItem from "./DetailItem";

const DATA = [
  {
    id: "1",
    type: "term",
    icon: require("../../assets/Images/Term1.png"), // Replace with your actual icon
    text: "Using optima in harassing and bullying is completely forbidden. ",
  },
  {
    id: "2",
    type: "term",
    icon: require("../../assets/Images/Term2.png"),
    text: "Optima can record, capture, review, and share videos and images for safety and quality as descripted in the Privacy Policy.",
  },
  {
    id: "3",
    type: "term",
    icon: require("../../assets/Images/Term3.png"),
    text: "The data, videos, images, and your personal information are allsecure and confidential.",
  },
  {
    id: "4",
    type: "detail",
    icon: require("../../assets/Images/Forward-Arrow.png"),
    text: "Terms Of Service",
  },
  {
    id: "5",
    type: "detail",
    icon: require("../../assets/Images/Forward-Arrow.png"),
    text: "Privacy Policy",
  },
];

function TermsList() {
  function renderItem({ item }) {
    if (item.type === "term") {
      return <TermItem text={item.text} iconSource={item.icon} />;
    } else {
      return <DetailItem text={item.text} iconSource={item.icon} />;
    }
  }
  return (
    <View style={styles.container}>
      <FlatList
        data={DATA}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false} // Hide the scrolling bar
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 440,
  },
});
export default TermsList;
