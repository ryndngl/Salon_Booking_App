import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation, useRoute } from '@react-navigation/native';

const timeSlots = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
  '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
  '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
  '05:00 PM',
];

const allServices = [
  'Hair Cut',
  'Hair Color',
  'Rebond & Forms',
  'Hair Treatment',
  'Foot Spa',
  'Nail Care',
];

const hairCutOptions = ['Men', 'Women', 'Kids'];
const haircutStyles = {
  Men: ['Barber Cut', 'Fade', 'Undercut'],
  Women: ['Layered Cut', 'Pixie', 'Bob'],
  Kids: ['Trim', 'Cute Bangs', 'Cartoon Style'],
};

const BookingFormScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const passedServiceName = route?.params?.serviceName || '';
  const [serviceName, setServiceName] = useState(passedServiceName);
  const [category, setCategory] = useState('');
  const [style, setStyle] = useState('');
  const [name, setName] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState('');

  const isHairCut = serviceName === 'Hair Cut';
  const comingFromCTA = passedServiceName === '';

  const handleDateChange = (event, selectedDate) => {
    if (selectedDate) setDate(selectedDate);
    setShowDatePicker(false);
  };

  const handleSubmit = () => {
    if (!name || !date || !selectedTime || !serviceName) {
      Alert.alert('Missing Info', 'Please fill out all required fields.');
      return;
    }

    const bookingData = {
      name,
      serviceName,
      category,
      style,
      date: date.toLocaleDateString(),
      time: selectedTime,
    };

    navigation.navigate('PaymentMethodScreen', { bookingData });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.label}>Name:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          value={name}
          onChangeText={setName}
        />

        {comingFromCTA && (
          <>
            <Text style={styles.label}>Service Type:</Text>
            <View style={styles.optionsContainer}>
              {allServices.map((service) => (
                <TouchableOpacity
                  key={service}
                  style={[
                    styles.optionButton,
                    serviceName === service && styles.optionButtonSelected,
                  ]}
                  onPress={() => {
                    setServiceName(service);
                    setCategory('');
                    setStyle('');
                  }}
                >
                  <Text
                    style={[
                      styles.optionButtonText,
                      serviceName === service && styles.optionButtonTextSelected,
                    ]}
                  >
                    {service}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {isHairCut && (
          <>
            <Text style={styles.label}>Category:</Text>
            <View style={styles.optionsContainer}>
              {hairCutOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.optionButton,
                    category === option && styles.optionButtonSelected,
                  ]}
                  onPress={() => {
                    setCategory(option);
                    setStyle('');
                  }}
                >
                  <Text
                    style={[
                      styles.optionButtonText,
                      category === option && styles.optionButtonTextSelected,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {category && (
              <>
                <Text style={styles.label}>Style:</Text>
                <View style={styles.optionsContainer}>
                  {haircutStyles[category].map((opt) => (
                    <TouchableOpacity
                      key={opt}
                      style={[
                        styles.optionButton,
                        style === opt && styles.optionButtonSelected,
                      ]}
                      onPress={() => setStyle(opt)}
                    >
                      <Text
                        style={[
                          styles.optionButtonText,
                          style === opt && styles.optionButtonTextSelected,
                        ]}
                      >
                        {opt}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}
          </>
        )}

        <Text style={styles.label}>Date:</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
          <Text>{date.toDateString()}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}

        <Text style={styles.label}>Select Time Slot:</Text>
        <View style={styles.timeSlotContainer}>
          {timeSlots.map((slot, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.timeSlot,
                selectedTime === slot && styles.selectedTimeSlot,
              ]}
              onPress={() => setSelectedTime(slot)}
            >
              <Text
                style={[
                  styles.timeSlotText,
                  selectedTime === slot && styles.selectedTimeSlotText,
                ]}
              >
                {slot}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default BookingFormScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 60,
  },
  label: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    marginTop: 5,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  optionsContainer: {
    flexDirection: 'row',
    marginTop: 10,
    flexWrap: 'wrap',
    gap: 10,
  },
  optionButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 10,
    marginBottom: 10,
  },
  optionButtonSelected: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  optionButtonText: {
    color: '#333',
    fontWeight: '500',
  },
  optionButtonTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  timeSlotContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 10,
  },
  timeSlot: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    margin: 5,
    backgroundColor: '#f9f9f9',
  },
  selectedTimeSlot: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  timeSlotText: {
    color: '#333',
    fontSize: 14,
  },
  selectedTimeSlotText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  button: {
    marginTop: 30,
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
