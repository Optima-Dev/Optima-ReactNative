import { StyleSheet, View, Platform, ScrollView } from "react-native";
import BackButton from "../../components/UI/BackButton";
import ArticleItem from "../../components/helper/ArticleItem";

const Atricle = ({ route }) => {
  return (
    <View style={styles.container}>
      <BackButton />
      <ScrollView showsVerticalScrollIndicator={false}>
        <ArticleItem {...route.params} />
      </ScrollView>
    </View>
  );
};

export default Atricle;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 0 : 20,
    // height: 500,
  },
});
