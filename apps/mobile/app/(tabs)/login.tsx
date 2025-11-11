import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../context/auth"; // Adjust the import path as needed

export default function AuthScreen() {
  const { login, register, user, logout } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      Alert.alert("Success", "You've been logged out");
    } catch (error) {
      Alert.alert("Error", "Failed to logout");
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (!isLogin && !username) {
      Alert.alert("Error", "Please enter a username");
      return;
    }

    setIsLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
        Alert.alert("Success", "Welcome back, Trainer!");
      } else {
        await register(username, email, password);
        Alert.alert("Success", "Account created successfully!");
      }
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Authentication failed"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // If user is logged in, show simple message
  if (user) {
    return (
      <View className="flex-1 bg-gray-800 items-center justify-center px-8">
        <Text className="text-white text-4xl font-bold mb-4">
          POKÉMON <Text className="text-[#fbbf24]">STORE</Text>
        </Text>
        <Text className="text-white text-2xl font-bold mb-8">Logged in</Text>
        <TouchableOpacity
          className="bg-[#fbbf24] py-4 px-8 rounded-lg"
          onPress={handleLogout}
        >
          <Text className="text-center text-black text-lg font-bold">
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-800">
      <View className="flex-1 px-8 pt-20 pb-8">
        {/* Header */}
        <View className="mb-12">
          <Text className="text-white text-4xl font-bold mb-2">
            POKÉMON <Text className="text-[#fbbf24]">STORE</Text>
          </Text>
        </View>

        {/* Welcome Message */}
        <View className="mb-8">
          <Text className="text-white text-3xl font-bold mb-2">
            {isLogin ? "Welcome back," : "Join us,"}
          </Text>
          <Text className="text-white text-3xl font-bold mb-3">Trainer</Text>
          <Text className="text-gray-400 text-base">
            {isLogin
              ? "Sign in to catch 'em all."
              : "Sign up to start your journey."}
          </Text>
        </View>

        {/* Form */}
        <View className="mb-6">
          {/* Username Input (only for sign up) */}
          {!isLogin && (
            <View className="mb-5">
              <Text className="text-white text-base font-medium mb-2">
                Username
              </Text>
              <TextInput
                className="bg-gray-700 text-white px-4 py-4 rounded-lg text-base"
                placeholder="Choose a username"
                placeholderTextColor="#64748b"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </View>
          )}

          {/* Email Input */}
          <View className="mb-5">
            <Text className="text-white text-base font-medium mb-2">Email</Text>
            <TextInput
              className="bg-gray-700 text-white px-4 py-4 rounded-lg text-base"
              placeholder="Enter your email"
              placeholderTextColor="#64748b"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Password Input */}
          <View className="mb-4">
            <Text className="text-white text-base font-medium mb-2">
              Password
            </Text>
            <TextInput
              className="bg-gray-700 text-white px-4 py-4 rounded-lg text-base"
              placeholder="········"
              placeholderTextColor="#64748b"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {/* Remember Me & Forgot Password */}
          {isLogin && (
            <View className="flex-row justify-between items-center mb-6">
              <TouchableOpacity
                className="flex-row items-center"
                onPress={() => setRememberMe(!rememberMe)}
              >
                <View
                  className={`w-5 h-5 border-2 rounded mr-2 ${rememberMe ? "bg-[#fbbf24] border-[#fbbf24]" : "border-gray-400"}`}
                />
                <Text className="text-white text-sm">Remember me</Text>
              </TouchableOpacity>

              <TouchableOpacity>
                <Text className="text-[#fbbf24] text-sm font-medium border border-[#fbbf24] px-3 py-1 rounded-full">
                  Forgot password?
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          className="bg-[#fbbf24] py-4 rounded-lg mb-8"
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text className="text-center text-black text-lg font-bold">
              {isLogin ? "Sign in" : "Create account"}
            </Text>
          )}
        </TouchableOpacity>

        {/* Toggle Auth Mode */}
        <View className="flex-row justify-center">
          <Text className="text-gray-400 text-base">
            {isLogin
              ? "New to the Pokémon Store? "
              : "Already have an account? "}
          </Text>
          <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
            <Text className="text-[#fbbf24] text-base font-medium">
              {isLogin ? "Create an account" : "Sign in"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
