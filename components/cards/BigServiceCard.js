import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";

const screenWidth = Dimensions.get("window").width;
const cardWidth = (screenWidth - 48) / 2;

const BigServiceCard = ({ styleData, onImagePress, onBookPress }) => {
  return (
    <View style={styles.card}>
      {/* Image clickable for modal */}
      <TouchableOpacity onPress={() => onImagePress(styleData.image)}>
        <View style={styles.imageWrapper}>
          <Image
            source={
              typeof styleData.image === "string"
                ? { uri: styleData.image }
                : styleData.image
            }
            style={styles.image}
          />
        </View>
      </TouchableOpacity>

      <View style={styles.cardContent}>
        <Text style={styles.styleName} numberOfLines={1}>
          {styleData.name}
        </Text>
        <Text style={styles.price}>₱{styleData.price}</Text>

        {/* Book Now button */}
        <TouchableOpacity style={styles.bookNowButton} onPress={onBookPress}>
          <Text style={styles.bookNowButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 20,
    width: cardWidth,
    overflow: "hidden",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,

    borderWidth: 0.6,
    borderColor: "#e2e2e2",
  },
  imageWrapper: {
    width: "100%",
    aspectRatio: 1,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  cardContent: {
    padding: 10,
    alignItems: "center",
  },
  styleName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1a1a1a",
    marginTop: 8,
    textAlign: "center",
    letterSpacing: 0.3,
  },
  price: {
    fontSize: 14,
    fontWeight: "600",
    color: "#d10000",
    marginTop: 4,
    textAlign: "center",
  },
  bookNowButton: {
    marginTop: 12,
    backgroundColor: "#007d3f",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 100,
    alignItems: "center",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  bookNowButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
});

export default BigServiceCard;
