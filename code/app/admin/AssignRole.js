import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { doc, getDocs, collection, updateDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { Feather } from '@expo/vector-icons';

export default function UserManagement() {
  const [userName, setUserName] = useState('');
  const [selectedRole, setSelectedRole] = useState('user');
  const [loading, setLoading] = useState(false);

  const handleUpdateRole = async () => {
    if (!userName) {
      Alert.alert('Error', 'Please enter a user email ID');
      return;
    }

    setLoading(true);

    try {
      const usersRef = collection(db, 'users');
      const querySnapshot = await getDocs(usersRef);
      let userId = '';

      querySnapshot.forEach((doc) => {
        const user = doc.data();
        if (user.email === userName) {
          userId = doc.id;
        }
      });

      if (userId) {
        const userRef = doc(usersRef, userId);
        await updateDoc(userRef, { role: selectedRole });
        setUserName('');
        Alert.alert(
          'Success',
          `Role updated successfully for user ${userName}`
        );
      } else {
        Alert.alert('Error', 'User not found');
      }
    } catch (error) {
      console.error('Error updating role:', error);
      Alert.alert('Error', 'Error updating role. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Feather name="mail" size={20} color="#007AFF" style={styles.icon} />
          <TextInput
            style={styles.input}
            value={userName}
            onChangeText={setUserName}
            placeholder="Enter User Email ID"
            placeholderTextColor="#999"
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.pickerContainer}>
          <Feather name="user" size={20} color="#007AFF" style={styles.icon} />
          <Picker
            selectedValue={selectedRole}
            onValueChange={(itemValue) => setSelectedRole(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Department Head" value="user" />
            <Picker.Item label="Finance Officer" value="officer" />
            <Picker.Item label="Administrator" value="admin" />
          </Picker>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleUpdateRole}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Feather
                name="check-circle"
                size={20}
                color="#fff"
                style={styles.buttonIcon}
              />
              <Text style={styles.buttonText}>Update Role</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  header: {
    backgroundColor: '#007AFF',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  icon: {
    marginLeft: 12,
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#333',
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  picker: {
    flex: 1,
    height: 50,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
