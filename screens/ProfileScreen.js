import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const auth = getAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout Confirmation',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut(auth);
              navigation.replace('Login');
            } catch (error) {
              console.error('Logout error:', error.message);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F5F5' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Profile Screen</Text>
      <Text style={{ fontSize: 16, marginTop: 10 }}>This is your profile page.</Text>

      <TouchableOpacity
        onPress={handleLogout}
        style={{
          marginTop: 30,
          marginBottom: 50,
          backgroundColor: '#FF4D4D',
          paddingVertical: 12,
          paddingHorizontal: 24,
          borderRadius: 8,
        }}
      >
        <Text style={{ color: '#ffffff', fontWeight: 'bold', fontSize: 16 }}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileScreen;
