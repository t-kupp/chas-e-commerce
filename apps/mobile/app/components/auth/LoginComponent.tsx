import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { useAuth } from "../../context/auth";
import { Ionicons } from "@expo/vector-icons";

interface LoginComponentProps {
  onLoginSuccess?: () => void;
}

export default function LoginComponent({
  onLoginSuccess,
}: LoginComponentProps) {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

      // Call success callback if provided
      onLoginSuccess?.();
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Authentication failed"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-800">
      <ScrollView className="flex-1">
        <View className="flex-1 px-8 pt-20 pb-8">
          {/* Header */}
          <View className="mb-12">
            <Text className="text-white text-4xl font-bold mb-2 text-center">
              POKÉMON <Text className="text-yellow-400">STORE</Text>
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
                  className="bg-gray-700 text-white px-4 py-4 rounded-lg text-base border border-gray-600 focus:border-yellow-400"
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
              <Text className="text-white text-base font-medium mb-2">
                Email
              </Text>
              <TextInput
                className="bg-gray-700 text-white px-4 py-4 rounded-lg text-base border border-gray-600 focus:border-yellow-400"
                placeholder="Enter your email"
                placeholderTextColor="#64748b"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Password Input */}
            <View className="mb-6">
              <Text className="text-white text-base font-medium mb-2">
                Password
              </Text>
              <TextInput
                className="bg-gray-700 text-white px-4 py-4 rounded-lg text-base border border-gray-600 focus:border-yellow-400"
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
                  onPress={() => setRememberMe(!rememberMe)}>
                  <View
                    className={`w-5 h-5 border-2 rounded mr-3 items-center justify-center ${
                      rememberMe
                        ? "bg-yellow-400 border-yellow-400"
                        : "border-gray-400"
                    }`}>
                    {rememberMe && (
                      <Ionicons name="checkmark" size={12} color="#000" />
                    )}
                  </View>
                  <Text className="text-white text-sm">Remember me</Text>
                </TouchableOpacity>

                <TouchableOpacity>
                  <Text className="text-yellow-400 text-sm font-medium border border-yellow-400 px-3 py-1 rounded-full">
                    Forgot password?
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            className={`py-4 rounded-lg mb-8 ${
              isLoading ? "bg-gray-600" : "bg-yellow-400"
            }`}
            onPress={handleSubmit}
            disabled={isLoading}>
            {isLoading ? (
              <View className="flex-row items-center justify-center">
                <ActivityIndicator color="#000" size="small" />
                <Text className="text-black text-lg font-bold ml-2">
                  {isLogin ? "Signing in..." : "Creating account..."}
                </Text>
              </View>
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
              <Text className="text-yellow-400 text-base font-medium">
                {isLogin ? "Create an account" : "Sign in"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
