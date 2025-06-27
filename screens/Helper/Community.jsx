import { FlatList, StyleSheet, View, Platform } from "react-native";
import ForgetPassHeader from "../../components/Auth/ForgetPassHeader";
import SearchInput from "../../components/UI/SearchInput";
import ArticleItem from "../../components/helper/Community/ArticleItem";

const subTitle =
  "Welcome to optima’s community where you can find everything related to us and the people we help.";

const ARTICLE_DATA = [
  {
    id: 1,
    title: `Optima is launching its first product today the “Optima” application.`,
    date: `Feb 9 2025`,
    hasImage: false,
    image: require("../../assets/Images/Main-Titled-Logo.png"),
    description: `Lorem ipsum dolor sit amet consectetur. Quis faucibus gravida euismod porta sapie. Nibh leo pulvinar viverra elit sed sed enim enim. Platea eget nunc aliquam purus adipiscing non mauris. Vulputate dolor metus in tristique eget. Tristique tortor elementum bibendum id in laoreet. Aliquam varius ut tincidunt eget consectetur gravida arcu iaculienim. Nunc faucibus volutpat dapibus nisi molestie purus dignissim. Proin mauris lacus amet. Netus quis molestie eu feugiat. Mollis mauris egestas lobortis amet. Tellus pellentesque massa cras nuncissim.`,
  },
  {
    id: 2,
    title: `The first ever conference for educating people about blindness and how to deal with it.`,
    date: `Jan 13 2025`,
    hasImage: false,
    image: require("../../assets/Images/Main-Titled-Logo.png"),
    description: `Lorem ipsum dolor sit amet consectetur. Quis faucibus gravida euismod porta sapie. Nibh leo pulvinar viverra elit sed sed enim enim. Platea eget nunc aliquam purus adipiscing non mauris. Vulputate dolor metus in tristique eget. Tristique tortor elementum bibendum id in laoreet. Aliquam varius ut tincidunt eget consectetur gravida arcu iaculienim. Nunc faucibus volutpat dapibus nisi molestie purus dignissim. Proin mauris lacus amet. Netus quis molestie eu feugiat. Mollis mauris egestas lobortis amet. Tellus pellentesque massa cras nuncissim.`,
  },
  {
    id: 3,
    title: `Optima is launching its first product today the “Optima” application.`,
    date: `Feb 9 2025`,
    hasImage: false,
    image: require("../../assets/Images/Main-Titled-Logo.png"),
    description: `Lorem ipsum dolor sit amet consectetur. Quis faucibus gravida euismod porta sapie. Nibh leo pulvinar viverra elit sed sed enim enim. Platea eget nunc aliquam purus adipiscing non mauris. Vulputate dolor metus in tristique eget. Tristique tortor elementum bibendum id in laoreet. Aliquam varius ut tincidunt eget consectetur gravida arcu iaculienim. Nunc faucibus volutpat dapibus nisi molestie purus dignissim. Proin mauris lacus amet. Netus quis molestie eu feugiat. Mollis mauris egestas lobortis amet. Tellus pellentesque massa cras nuncissim.`,
  },
  {
    id: 4,
    title: `The first ever conference for educating people about blindness and how to deal with it.`,
    date: `Jan 13 2025`,
    hasImage: false,
    image: require("../../assets/Images/Main-Titled-Logo.png"),
    description: `Lorem ipsum dolor sit amet consectetur. Quis faucibus gravida euismod porta sapie. Nibh leo pulvinar viverra elit sed sed enim enim. Platea eget nunc aliquam purus adipiscing non mauris. Vulputate dolor metus in tristique eget. Tristique tortor elementum bibendum id in laoreet. Aliquam varius ut tincidunt eget consectetur gravida arcu iaculienim. Nunc faucibus volutpat dapibus nisi molestie purus dignissim. Proin mauris lacus amet. Netus quis molestie eu feugiat. Mollis mauris egestas lobortis amet. Tellus pellentesque massa cras nuncissim.`,
  },
];

const Community = () => {
  return (
    <View style={styles.container}>
      <ForgetPassHeader title='Community' subTitle={subTitle} community />
      <SearchInput />

      <FlatList
        data={ARTICLE_DATA}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ArticleItem {...item} />}
        style={styles.articlesContainer}
      />
    </View>
  );
};

export default Community;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "white",
    gap: 10,
    paddingTop: Platform.OS === "android" ? 60 : 0,
  },
  articlesContainer: {
    marginTop: 20,
  },
});
