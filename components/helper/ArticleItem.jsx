import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Colors from "../../constants/Colors";


const ArticleItem = ({ title, date, image, description, toArticle }) => {

  const navigation = useNavigation();

  function handleOpenArticle() {
    if(!toArticle) {
      navigation.navigate('Article', { title, date, image, description, toArticle: true });
    }
  }

  return (
    <Pressable
      style={[styles.container, toArticle && { padding: 0, marginTop: 34 }]}
      onPress={handleOpenArticle}
    >
      <View style={[styles.dateContainer, toArticle && { margin: 15 }]}>
        <Text style={[styles.date, toArticle && { color: Colors.MainColor }]}>
          { date }
        </Text>
      </View>

      <View style={styles.imageContainer}>
        <Image source={image} style={toArticle ? styles.articleImage : styles.image} />
      </View>

      <View style={[styles.textContainer, toArticle && { marginTop: 34 }]}>
        <Text style={toArticle ? styles.articleTitle : styles.title}>
          {title}
        </Text>
        <Text style={toArticle ? styles.description : styles.text}>
          { toArticle ? description : "Click to read the article." }
        </Text>
      </View>
    </Pressable>
  );
}

export default ArticleItem;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.MainColor,
    marginTop: 20,
    padding: 15,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: Colors.MainColor,
  },
  imageContainer: {
    alignItems: 'center',
  },
  image: {
    width: 303,
    height: 96,
  },
  articleImage: {
    width: 322,
    height: 102,
  },
  dateContainer: {
    backgroundColor: Colors.white,
    padding: 10,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 5,
    marginLeft: 'auto',
  },
  date: {
    color: Colors.black500,
    fontSize: 16,
    fontWeight: '300',
  },
  textContainer: {
    backgroundColor: Colors.white,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 24,
    marginTop: 20,
  },
  title: {
    color: Colors.black,
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 26,
  },
  articleTitle: {
    color: Colors.MainColor,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '500',
    lineHeight: 31,
  },
  text: {
    color: Colors.black500,
    fontSize: 16,
    fontWeight: '300',
    lineHeight: 28,
    textAlign: 'center',
    marginTop: 5,
  },
  description: {
    color: Colors.black,
    fontSize: 18,
    fontWeight: '300',
    lineHeight: 31,
    marginTop: 14,
  }
});