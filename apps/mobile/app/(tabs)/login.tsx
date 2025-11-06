import React, {useState} from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = () => {
    console.log(isLogin ? "Login" : "Sign up", {email, password});
  };

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
        >
          <Text className="text-center text-black text-lg font-bold">
            {isLogin ? "Sign in" : "Create account"}
          </Text>
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
