import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;
const cardWidth = (screenWidth - 48) / 2; // for 2-column grid with spacing
const categories = ['Men', 'Women', 'Kids'];

const ServiceDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { service } = route.params;

  const [selectedCategory, setSelectedCategory] = useState('Men');

 const isHairCut = service.name.trim().toLowerCase() === 'hair cut';

 const filteredStyles = isHairCut
  ? service.styles.filter((style) => style.category === selectedCategory)
  : service.styles.filter((style) => !style.category);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingTop: 20 }}>
      <Text style={styles.title}>{service.name}</Text>

      {/* Category Tabs */}
     {service.name === 'Hair Cut' && (
  <View style={styles.tabs}>
    {categories.map((category) => (
      <TouchableOpacity
        key={category}
        style={[
          styles.tabButton,
          selectedCategory === category && styles.activeTab,
        ]}
        onPress={() => setSelectedCategory(category)}
      >
        <Text
          style={[
            styles.tabText,
            selectedCategory === category && styles.activeTabText,
          ]}
        >
          {category}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
)}

      {/* Grid of Styles */}
      <View style={styles.grid}>
        {filteredStyles.map((style, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.cardContent}>
              <Image source={style.image} style={styles.image} />
              <Text style={styles.styleName}>{style.name}</Text>
              <Text style={styles.price}>₱{style.price}</Text>

              <TouchableOpacity
                style={styles.bookNowButton}
                onPress={() =>
                  navigation.navigate('BookingFormScreen', {
                    serviceName: service.name,
                    styleName: style.name,
                    stylePrice: style.price,
                  })
                }
              >
                <Text style={styles.bookNowButtonText}>Book Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default ServiceDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#000',
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    borderColor: 'transparent',
  },
  activeTab: {
    borderColor: '#7a0000',
  },
  tabText: {
    fontSize: 16,
    color: '#555',
  },
  activeTabText: {
    color: '#7a0000',
    fontWeight: 'bold',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    marginBottom: 16,
    width: cardWidth,
    overflow: 'hidden',
    elevation: 3,
  },
  cardContent: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
    resizeMode: 'cover',
    backgroundColor: '#ddd',
  },
  styleName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
    textAlign: 'center',
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#7a0000',
    marginTop: 6,
  },
  bookNowButton: {
    marginTop: 10,
    backgroundColor: '#7a0000',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  bookNowButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
