import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useFavorites } from "../../context/FavoritesContext";

const screenWidth = Dimensions.get("window").width;
const cardWidth = (screenWidth - 48) / 2;

const BigServiceCard = ({
  styleData,
  onImagePress,
  onBookPress,
  isSoftGel,
  onAddDesignPress,
  isFootSpa,
}) => {
  const { toggleFavorite, isFavorite } = useFavorites();
  const favorite = isFavorite(styleData.name);
  const hasMultipleImages = Array.isArray(styleData.images);

  if (isFootSpa && hasMultipleImages) {
    // Foot Spa special multi-image full width card
    return (
      <View style={styles.fullWidthCard}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
          {styleData.images.map((img, index) => (
            <TouchableOpacity key={index} onPress={() => onImagePress(img)}>
              <Image source={img} style={styles.footSpaImage} />
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.styleName}>{styleData.name}</Text>
        <Text style={styles.description}>
          A complete foot spa with manicure and pedicure for full relaxation.
        </Text>
        <Text style={styles.price}>₱{styleData.price}</Text>

        <View style={styles.bottomRow}>
          <TouchableOpacity
            style={styles.heartButton}
            onPress={() => toggleFavorite(styleData)}
          >
            <Ionicons
              name={favorite ? "heart" : "heart-outline"}
              size={18}
              color="#fff"
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.bookNowButton} onPress={onBookPress}>
            <Text style={styles.bookNowButtonText}>Book Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Default card for other styles (including Soft Gel)
  return (
    <View style={styles.card}>
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
        <View style={styles.namePriceRow}>
          <Text style={styles.styleName} numberOfLines={1}>
            {styleData.name}
          </Text>
          <Text style={styles.price}>₱{styleData.price}</Text>
        </View>

        {styleData.description && (
          <Text style={styles.description} numberOfLines={3}>
            {styleData.description}
          </Text>
        )}

        {isSoftGel && (
          <TouchableOpacity
            style={styles.addDesignButton}
            onPress={onAddDesignPress}
          >
            <Text style={styles.addDesignText}>+ Design</Text>
          </TouchableOpacity>
        )}

        <View style={styles.bottomRow}>
          <TouchableOpacity
            style={styles.heartButton}
            onPress={() => toggleFavorite(styleData)}
          >
            <Ionicons
              name={favorite ? "heart" : "heart-outline"}
              size={18}
              color="#fff"
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.bookNowButton} onPress={onBookPress}>
            <Text style={styles.bookNowButtonText}>Book Now</Text>
          </TouchableOpacity>
        </View>
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
    elevation: 5,
    borderWidth: 0.6,
    borderColor: "#e2e2e2",
  },
  fullWidthCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 20,
    width: screenWidth - 32,
    padding: 12,
    overflow: "hidden",
    elevation: 5,
    borderWidth: 0.5,
    borderColor: "#e5e5e5",
    alignSelf: "center",
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
  footSpaImage: {
    width: (screenWidth - 64) / 3,
    height: 100,
    borderRadius: 8,
    marginRight: 8,
    resizeMode: "cover",
  },
  cardContent: {
    padding: 12,
  },
  namePriceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  styleName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1a1a1a",
    flex: 1,
    marginRight: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: "700",
    color: "#d10000",
  },
  description: {
    fontSize: 13,
    color: "#555",
    marginBottom: 12,
    lineHeight: 18,
  },
  addDesignButton: {
    backgroundColor: "#f1c40f",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 50,
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  addDesignText: {
    color: "#1a1a1a",
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    gap: 6,
  },
  heartButton: {
    backgroundColor: "#007d3f",
    padding: 6,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  bookNowButton: {
    backgroundColor: "#007d3f",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 100,
    elevation: 1,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 40,
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
