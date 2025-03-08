import { StyleSheet, Text, View } from "react-native";
import BackButton from "../../components/UI/BackButton";
import ArticleItem from "../../components/helper/ArticleItem";

const Atricle = ({ route }) => {
  return (
    <View style={styles.container}>
      <BackButton />
      <ArticleItem {...route.params} />
    </View>
  );
}

export default Atricle;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 20,
  },
});