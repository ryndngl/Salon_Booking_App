import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Animated,
  Easing,
  Image,
  ScrollView,
  Switch,
  StyleSheet,
  TextInput
} from "react-native";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useDarkMode } from '../context/DarkModeContext'; // Import global context

// Import mo muna itong StyleSheet para sa Dark Mode styles
const darkStyles = StyleSheet.create({
  container: {
    backgroundColor: "#121212", // Dark background
  },
  header: {
    backgroundColor: '#1E1E1E', // Dark header background
    borderBottomColor: '#2C2C2C', // Dark border
  },
  headerTitle: {
    color: '#E0E0E0', // Light text
  },
  profileCard: {
    backgroundColor: '#1E1E1E', // Dark card background
  },
  userName: {
    color: '#E0E0E0', // Light text
  },
  userEmail: {
    color: '#B0B0B0', // Lighter text
  },
  userPhone: {
    color: '#B0B0B0', // Lighter text
  },
  phoneInput: {
    backgroundColor: '#2C2C2C', // Dark input field
    borderColor: "#3A3A3A",
    color: '#E0E0E0', // Light text
  },
  menuSection: {
    backgroundColor: '#1E1E1E', // Dark menu section background
  },
  sectionTitle: {
    color: '#E0E0E0', // Light text
  },
  placeholderItem: {
    backgroundColor: '#1E1E1E',
  },
  placeholderText: {
    color: '#777', // Darker text
  },
  menuItemText: {
    color: '#E0E0E0', // Light text
  },
  menuDivider: {
    backgroundColor: '#2C2C2C', // Darker divider
  },
  versionContainer: {
    backgroundColor: "#121212", // same as container
  },
  versionText: {
    color: '#777', // Darker text
  },
  confirmBox: {
    backgroundColor: "#1E1E1E", // Dark modal background
  },
  confirmTitle: {
    color: "#E0E0E0", // Light text
  },
  confirmMessage: {
    color: "#B0B0B0", // Lighter text
  },
});

export default function ProfileScreen({ navigation }) {
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [logoutSuccessVisible, setLogoutSuccessVisible] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [bookingReminders, setBookingReminders] = useState(true);
  const [promos, setPromos] = useState(false);
  
  // Use global dark mode context instead of local state
  const { darkMode, toggleDarkMode } = useDarkMode();

  const [user, setUser] = useState({
    uid: null,
    name: "",
    email: "",
    phone: "",
    photo: "",
  });

  const [phoneEditable, setPhoneEditable] = useState(false);

  // Fetch logged-in user info
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          uid: currentUser.uid,
          name: currentUser.displayName || "No Name",
          email: currentUser.email || "No Email",
          phone: "",
          photo: currentUser.photoURL || "",
        });
      }
    });

    return () => unsubscribe();
  }, []);

  // Combined styles using a conditional approach
  const combinedStyles = (lightStyle, darkStyle) => {
    return [lightStyle, darkMode && darkStyle];
  };

  const confirmLogout = () => setConfirmVisible(true);

const handleLogout = async () => {
  setConfirmVisible(false);
  const auth = getAuth();
  try {
    await signOut(auth);

    // Ipakita modal at reset animation values
    setLogoutSuccessVisible(true);
    scaleAnim.setValue(0.5);
    fadeAnim.setValue(0);

    // Bounce + fade in animation
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3, // mas mababa = mas bounce
        tension: 120, // dagdag energy sa bounce
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();

    // After 2 seconds, fade out at balik sa login
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setLogoutSuccessVisible(false);
        navigation.replace("Login");
      });
    }, 2000);
    
  } catch (error) {
    console.error("Logout failed:", error);
  }
};


  const pastBookings = [
    { service: 'Hair Cut', date: 'Jan 25, 2025' },
    { service: 'Soft Gel', date: 'Jan 10, 2025' },
    { service: 'Hair Color', date: 'Dec 28, 2024' },
  ];

  const paymentMethods = [
    { name: 'GCash', isDefault: true },
    { name: 'Credit/Debit Card', isDefault: false },
    { name: 'Cash on Service', isDefault: false },
  ];

  const [loyaltyPoints, setLoyaltyPoints] = useState(150);

  const menuSections = [
    // Favorites Section
    {
      title: 'Favorites',
      items: [
        { icon: 'favorite', label: 'Your saved services will appear here', isPlaceholder: true },
      ]
    },
    // Booking History Section
    {
      title: 'Past Bookings',
      items: pastBookings.map(booking => ({
        icon: 'history',
        label: `${booking.service} - ${booking.date}`,
        hasAction: true,
        actionText: 'Book Again'
      }))
    },
    // Payment Methods Section
    {
      title: 'Payment Methods',
      items: [
        ...paymentMethods.map(method => ({
          icon: 'payment',
          label: method.name,
          isDefault: method.isDefault,
          hasToggle: true
        })),
        { icon: 'add', label: 'Add Payment Method', hasAction: true }
      ]
    },
    // Loyalty & Rewards Section
    {
      title: 'Loyalty & Rewards',
      items: [
        { icon: 'stars', label: `You have ${loyaltyPoints} points`, isPoints: true },
        { icon: 'redeem', label: 'Redeem Rewards', hasAction: true }
      ]
    },
    // Notifications & Settings Section
    {
      title: 'Notifications & Settings',
      items: [
        { icon: 'notifications', label: 'Booking Reminders', hasSwitch: true, value: bookingReminders, onChange: setBookingReminders },
        { icon: 'local-offer', label: 'Promos & Offers', hasSwitch: true, value: promos, onChange: setPromos },
        { icon: 'dark-mode', label: 'Dark Mode', hasSwitch: true, value: darkMode, onChange: toggleDarkMode }, // Use global toggle
        { icon: 'lock', label: 'Change Password', hasAction: true }
      ]
    },
    // Help & Support Section - Updated with navigation
    {
      title: 'Help & Support',
      items: [
        { icon: 'help', label: 'FAQs', onPress: () => navigation.navigate('FAQs') },
        { icon: 'chat', label: 'Contact Us', onPress: () => navigation.navigate('ContactUs') },
        { icon: 'description', label: 'Terms & Conditions', onPress: () => navigation.navigate('TermsConditions') },
        { icon: 'privacy-tip', label: 'Privacy Policy', onPress: () => navigation.navigate('PrivacyPolicy') }
      ]
    },
    // Logout Section
    {
      title: '',
      items: [
        { icon: 'logout', label: 'Log Out', isLogout: true, onPress: confirmLogout },
      ]
    }
  ];

  return (
    <>
      <View style={combinedStyles(styles.container, darkStyles.container)}>
        {/* Header */}
        <View style={combinedStyles(styles.header, darkStyles.header)}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color={darkMode ? "#E0E0E0" : "#333"} />
          </TouchableOpacity>
          <Text style={combinedStyles(styles.headerTitle, darkStyles.headerTitle)}>My Profile</Text>
          <Icon name="settings" size={24} color={darkMode ? "#E0E0E0" : "#333"} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Section */}
          <View style={combinedStyles(styles.profileCard, darkStyles.profileCard)}>
            <View style={styles.profileHeader}>
              <View style={styles.profileImageContainer}>
                {user.photo ? (
                  <Image source={{ uri: user.photo }} style={styles.profileImage} />
                ) : (
                  <View style={styles.placeholderCircle}>
                    <Icon name="person" size={40} color="#999" />
                  </View>
                )}
                <View style={styles.cameraIcon}>
                  <Icon name="camera-alt" size={12} color="#fff" />
                </View>
              </View>
              <View style={styles.profileInfo}>
                <Text style={combinedStyles(styles.userName, darkStyles.userName)}>{user.name}</Text>
                <Text style={combinedStyles(styles.userEmail, darkStyles.userEmail)}>{user.email}</Text>
                {phoneEditable ? (
                  <TextInput
                    style={combinedStyles(styles.phoneInput, darkStyles.phoneInput)}
                    placeholder="+63 --- --- ----"
                    value={user.phone}
                    onChangeText={(text) => setUser({ ...user, phone: text })}
                    keyboardType="phone-pad"
                    placeholderTextColor={darkMode ? "#777" : "#aaa"}
                  />
                ) : (
                  <Text style={combinedStyles(styles.userPhone, darkStyles.userPhone)}>
                    {user.phone || "No phone number"}
                  </Text>
                )}
              </View>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setPhoneEditable(!phoneEditable)}
            >
              <Text style={styles.editButtonText}>
                {phoneEditable ? "Save Phone" : "Edit Profile"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Menu Sections */}
          <View style={styles.menuContainer}>
            {menuSections.map((section, sectionIndex) => (
              <View key={sectionIndex} style={combinedStyles(styles.menuSection, darkStyles.menuSection)}>
                {section.title && (
                  <Text style={combinedStyles(styles.sectionTitle, darkStyles.sectionTitle)}>{section.title}</Text>
                )}
                
                {section.items.map((item, itemIndex) => (
                  <View key={itemIndex}>
                    {item.isPlaceholder ? (
                      <View style={combinedStyles(styles.placeholderItem, darkStyles.placeholderItem)}>
                        <Icon name={item.icon} size={20} color={darkMode ? "#444" : "#ccc"} />
                        <Text style={combinedStyles(styles.placeholderText, darkStyles.placeholderText)}>{item.label}</Text>
                      </View>
                    ) : (
                      <TouchableOpacity 
                        style={styles.menuItem}
                        onPress={item.onPress || (() => {})}
                      >
                        <View style={styles.menuItemLeft}>
                          <Icon 
                            name={item.icon} 
                            size={20} 
                            color={
                              item.isLogout ? "#d13f3f" : item.isPoints ? "#4CAF50" : (darkMode ? "#B0B0B0" : "#666")
                            } 
                          />
                          <View style={styles.menuItemContent}>
                            <Text style={[
                              combinedStyles(styles.menuItemText, darkStyles.menuItemText),
                              item.isLogout && styles.logoutText,
                              item.isPoints && styles.pointsText
                            ]}>
                              {item.label}
                            </Text>
                            {item.isDefault && (
                              <Text style={styles.defaultText}>Default</Text>
                            )}
                          </View>
                        </View>
                        
                        <View style={styles.menuItemRight}>
                          {item.hasSwitch && (
                            <Switch
                              value={item.value}
                              onValueChange={item.onChange}
                              trackColor={{ false: darkMode ? "#444" : "#ddd", true: "#4CAF50" }}
                              thumbColor={darkMode ? "#fff" : "#fff"}
                            />
                          )}
                          {item.hasAction && (
                            <TouchableOpacity style={styles.actionButton}>
                              <Text style={styles.actionText}>
                                {item.actionText || 'View'}
                              </Text>
                            </TouchableOpacity>
                          )}
                          {!item.hasSwitch && !item.hasAction && !item.isLogout && (
                            <Icon name="chevron-right" size={20} color={darkMode ? "#444" : "#ccc"} />
                          )}
                        </View>
                      </TouchableOpacity>
                    )}
                    {itemIndex < section.items.length - 1 && (
                      <View style={combinedStyles(styles.menuDivider, darkStyles.menuDivider)} />
                    )}
                  </View>
                ))}
              </View>
            ))}
          </View>
          {/* App Version */}
          <View style={combinedStyles(styles.versionContainer, darkStyles.versionContainer)}>
            <Text style={combinedStyles(styles.versionText, darkStyles.versionText)}>App version 0.1</Text>
          </View>
        </ScrollView>
      </View>

      {/* Confirmation Modal */}
      <Modal transparent visible={confirmVisible} animationType="fade" statusBarTranslucent>
        <View style={styles.confirmContainer}>
          <View style={combinedStyles(styles.confirmBox, darkStyles.confirmBox)}>
            <Text style={combinedStyles(styles.confirmTitle, darkStyles.confirmTitle)}>Are you sure?</Text>
            <Text style={combinedStyles(styles.confirmMessage, darkStyles.confirmMessage)}>
              Do you really want to log out?
            </Text>
            <View style={styles.confirmButtons}>
              <TouchableOpacity
                style={[styles.confirmBtn, { backgroundColor: "#d13f3f" }]}
                onPress={handleLogout}
              >
                <Text style={styles.confirmBtnText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmBtn, { backgroundColor: "#ff9900" }]}
                onPress={() => setConfirmVisible(false)}
              >
                <Text style={styles.confirmBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Logout Success Modal */}
      <Modal transparent visible={logoutSuccessVisible} animationType="fade" statusBarTranslucent>
        <View style={styles.confirmContainer}>
          <Animated.View style={[
            combinedStyles(styles.confirmBox, darkStyles.confirmBox),
            {
              transform: [{ scale: scaleAnim }],
              opacity: fadeAnim,
            },
          ]}>
            <Icon name="logout" size={48} color="#4CAF50" />
            <Text style={combinedStyles(styles.confirmTitle, darkStyles.confirmTitle)}>Logged Out Successfully!</Text>
            <Text style={combinedStyles(styles.confirmMessage, darkStyles.confirmMessage)}>Redirecting to login...</Text>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginTop: 55,
    marginHorizontal: 16,
    borderRadius: 12,
    elevation: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    zIndex: -1,
  },
  scrollView: {
    flex: 1,
  },
  profileCard: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginBottom: 10,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImageContainer: {
    position: 'relative',
    marginRight: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  placeholderCircle: {
    width: 95,
    height: 95,
    borderRadius: 50,
    backgroundColor: "#e0e0e0",
    alignItems: "center",
    justifyContent: "center",
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#666',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  userPhone: {
    fontSize: 14,
    color: '#666',
  },
  phoneInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontSize: 14,
    color: "#333",
    marginTop: 4,
  },
  editButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: 'center',
    width: 160,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    flexWrap: 'wrap',
  },
  menuContainer: {
    paddingHorizontal: 16,
  },
  menuSection: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    paddingVertical: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 8,
  },
  placeholderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  placeholderText: {
    fontSize: 14,
    color: '#999',
    marginLeft: 12,
    fontStyle: 'italic',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemContent: {
    marginLeft: 12,
    flex: 1,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
  },
  defaultText: {
    fontSize: 12,
    color: '#4CAF50',
    marginTop: 2,
  },
  pointsText: {
    color: '#4CAF50',
    fontWeight: '500',
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#4CAF50',
    borderRadius: 6,
  },
  actionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  logoutText: {
    color: '#d13f3f',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginLeft: 48,
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 75,
  },
  versionText: {
    fontSize: 14,
    color: '#999',
  },
  confirmContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    zIndex: 9999,
  },
  confirmBox: {
    width: 280,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  confirmTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 8,
  },
  confirmMessage: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
    marginBottom: 20,
  },
  confirmButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  confirmBtn: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  confirmBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});