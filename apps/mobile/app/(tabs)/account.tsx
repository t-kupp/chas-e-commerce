import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  RefreshControl,
} from "react-native";
import { useAuth } from "../context/auth";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const STRAPI_URL =
  process.env.EXPO_PUBLIC_STRAPI_URL || "http://localhost:1337";

interface Order {
  id: number;
  documentId: string;
  total: number;
  orderStatus: string;
  createdAt: string;
  orderItems?: {
    id: number;
    Quantity: number;
    pokemon?: {
      name: string;
      price: number;
    };
  }[];
}

interface UserStats {
  totalOrders: number;
  totalSpent: number;
  favoriteCount: number;
}

export default function AccountScreen() {
  const { user, logout, isLoading } = useAuth();

  // Account data states
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<UserStats>({
    totalOrders: 0,
    totalSpent: 0,
    favoriteCount: 0,
  });
  const [dataLoading, setDataLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/(tabs)/login");
    }
  }, [user, isLoading]);

  const fetchUserData = async () => {
    if (!user) return;

    try {
      // Simulate some data for now
      setOrders([]);
      setStats({
        totalOrders: 0,
        totalSpent: 0,
        favoriteCount: 0,
      });
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    } finally {
      setDataLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user) {
      setDataLoading(true);
      fetchUserData();
    }
  }, [user]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchUserData();
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await logout();
            router.replace("/(tabs)/login");
          } catch (error) {
            Alert.alert("Error", "Failed to logout");
          }
        },
      },
    ]);
  };

  if (isLoading || !user) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#fbbf24" />
        <Text className="text-gray-600 mt-4 text-lg">Loading...</Text>
      </SafeAreaView>
    );
  }

  // If user is logged in, show account dashboard
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View className="p-4">
          {/* Header */}
          <View className="bg-white rounded-xl p-6 mb-6 border-l-4 border-gray-800">
            <View className="flex-row justify-between items-start">
              <View className="flex-1">
                <View className="flex-row items-center mb-4">
                  <View className="w-16 h-16 bg-gray-100 rounded-full items-center justify-center mr-4">
                    <Ionicons name="person" size={32} color="#6b7280" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-2xl font-bold text-gray-900 mb-1">
                      Welcome back,
                    </Text>
                    <Text className="text-2xl font-bold text-gray-900 mb-2">
                      {user.username}!
                    </Text>
                    <View className="flex-row items-center">
                      <Ionicons name="mail" size={16} color="#6b7280" />
                      <Text className="text-gray-600 ml-2">{user.email}</Text>
                    </View>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                onPress={handleLogout}
                className="bg-gray-100 p-3 rounded-lg border border-gray-200">
                <Ionicons name="log-out-outline" size={20} color="#374151" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Stats Cards */}
          <View className="mb-6">
            <View className="flex-row mb-4">
              {/* Total Orders */}
              <View className="flex-1 bg-white rounded-xl p-4 mr-2 border-l-4 border-yellow-400">
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className="text-gray-600 text-sm font-medium mb-1">
                      Total Orders
                    </Text>
                    <Text className="text-2xl font-bold text-gray-900">
                      {stats.totalOrders}
                    </Text>
                  </View>
                  <View className="w-10 h-10 bg-yellow-100 rounded-lg items-center justify-center">
                    <Ionicons name="bag" size={20} color="#d97706" />
                  </View>
                </View>
              </View>

              {/* Total Spent */}
              <View className="flex-1 bg-white rounded-xl p-4 ml-2 border-l-4 border-green-500">
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className="text-gray-600 text-sm font-medium mb-1">
                      Total Spent
                    </Text>
                    <Text className="text-2xl font-bold text-gray-900">
                      ${stats.totalSpent.toFixed(2)}
                    </Text>
                  </View>
                  <View className="w-10 h-10 bg-green-100 rounded-lg items-center justify-center">
                    <Ionicons name="trending-up" size={20} color="#059669" />
                  </View>
                </View>
              </View>
            </View>

            {/* Wishlist */}
            <View className="bg-white rounded-xl p-4 border-l-4 border-red-500">
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-gray-600 text-sm font-medium mb-1">
                    Wishlist Cards
                  </Text>
                  <Text className="text-2xl font-bold text-gray-900">
                    {stats.favoriteCount}
                  </Text>
                </View>
                <View className="w-10 h-10 bg-red-100 rounded-lg items-center justify-center">
                  <Ionicons name="heart" size={20} color="#dc2626" />
                </View>
              </View>
            </View>
          </View>

          {/* Quick Actions */}
          <View className="bg-white rounded-xl p-6 mb-6">
            <View className="flex-row items-center mb-4 pb-3 border-b border-gray-200">
              <Ionicons name="settings" size={20} color="#d97706" />
              <Text className="text-xl font-bold text-gray-900 ml-2">
                Quick Actions
              </Text>
            </View>

            <View>
              <TouchableOpacity className="flex-row items-center p-4 bg-gray-50 rounded-lg mb-3">
                <View className="w-10 h-10 bg-yellow-100 rounded-lg items-center justify-center mr-3">
                  <Ionicons name="bag" size={20} color="#d97706" />
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-gray-900">
                    View Orders
                  </Text>
                  <Text className="text-sm text-gray-600">
                    Track your purchases
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#6b7280" />
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-row items-center p-4 bg-gray-50 rounded-lg mb-3"
                onPress={() => router.push("/(tabs)/wishlist")}>
                <View className="w-10 h-10 bg-red-100 rounded-lg items-center justify-center mr-3">
                  <Ionicons name="heart" size={20} color="#dc2626" />
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-gray-900">Wishlist</Text>
                  <Text className="text-sm text-gray-600">
                    Saved rare cards
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#6b7280" />
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-row items-center p-4 bg-gray-50 rounded-lg"
                onPress={() => router.push("/(tabs)/index")}>
                <View className="w-10 h-10 bg-green-100 rounded-lg items-center justify-center mr-3">
                  <Ionicons name="storefront" size={20} color="#059669" />
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-gray-900">
                    Browse Cards
                  </Text>
                  <Text className="text-sm text-gray-600">
                    Discover new rarities
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Recent Orders Empty State */}
          <View className="bg-white rounded-xl p-6">
            <View className="flex-row items-center mb-4 pb-3 border-b border-gray-200">
              <Ionicons name="bag" size={20} color="#d97706" />
              <Text className="text-xl font-bold text-gray-900 ml-2">
                Recent Orders
              </Text>
            </View>

            <View className="items-center py-12">
              <View className="w-16 h-16 bg-gray-100 rounded-full items-center justify-center mb-4 border border-gray-200">
                <Ionicons name="bag-outline" size={32} color="#9ca3af" />
              </View>
              <Text className="text-gray-600 mb-4 text-center">
                No recent purchases found.
              </Text>
              <TouchableOpacity
                className="flex-row items-center bg-yellow-400 px-6 py-3 rounded-lg"
                onPress={() => router.push("/(tabs)/index")}>
                <Ionicons name="storefront" size={18} color="#000" />
                <Text className="text-black font-bold ml-2">
                  Start Collecting Cards
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
