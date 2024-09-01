import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Checkbox from 'expo-checkbox';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig';
import tw from 'twrnc';
import { Feather } from '@expo/vector-icons';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async () => {
    if (email === '' || password === '') {
      Alert.alert('Error', 'Please enter a valid email and password');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await updateProfile(user, { displayName: name });

      await setDoc(doc(db, 'users', user.uid), {
        id: user.uid,
        email: user.email,
        displayName: name,
        role: 'none',
      });

      Alert.alert('Success', 'Your account has been created successfully');
      // Navigate to Dashboard or appropriate screen
    } catch (error) {
      console.error('Error during signup:', error);
      Alert.alert(
        'Signup Error',
        error.message ||
          'Please enter a valid username and password (minimum 8 characters)'
      );
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-100`}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={tw`flex-1`}
      >
        <ScrollView
          contentContainerStyle={tw`flex-grow justify-center px-6 py-10`}
        >
          <View style={tw`bg-white rounded-3xl shadow-lg px-8 py-10`}>
            <Text
              style={tw`text-4xl font-bold text-center text-indigo-600 mb-8`}
            >
              Create Account
            </Text>

            <View style={tw`mb-6`}>
              <Text style={tw`text-gray-700 text-lg font-semibold mb-2`}>
                Name
              </Text>
              <View style={tw`flex-row items-center border-b border-gray-300`}>
                <Feather
                  name="user"
                  size={20}
                  color="#4F46E5"
                  style={tw`mr-2`}
                />
                <TextInput
                  style={tw`flex-1 py-2 text-lg text-gray-700`}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your name"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            <View style={tw`mb-6`}>
              <Text style={tw`text-gray-700 text-lg font-semibold mb-2`}>
                Email
              </Text>
              <View style={tw`flex-row items-center border-b border-gray-300`}>
                <Feather
                  name="mail"
                  size={20}
                  color="#4F46E5"
                  style={tw`mr-2`}
                />
                <TextInput
                  style={tw`flex-1 py-2 text-lg text-gray-700`}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            <View style={tw`mb-6`}>
              <Text style={tw`text-gray-700 text-lg font-semibold mb-2`}>
                Password
              </Text>
              <View style={tw`flex-row items-center border-b border-gray-300`}>
                <Feather
                  name="lock"
                  size={20}
                  color="#4F46E5"
                  style={tw`mr-2`}
                />
                <TextInput
                  style={tw`flex-1 py-2 text-lg text-gray-700`}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Feather
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={20}
                    color="#4F46E5"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={tw`flex-row items-center mb-6`}>
              <Checkbox
                style={tw`w-6 h-6 mr-2`}
                value={agree}
                onValueChange={setAgree}
                color={agree ? '#4F46E5' : undefined}
              />
              <Text style={tw`text-gray-600`}>
                I agree to the Terms and Conditions
              </Text>
            </View>

            <TouchableOpacity
              style={tw`${
                agree ? 'bg-indigo-600' : 'bg-gray-400'
              } rounded-full py-3 px-6`}
              onPress={handleSubmit}
              disabled={!agree}
            >
              <Text style={tw`text-white text-lg font-semibold text-center`}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUp;
