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
import { useAuth } from "../../context/auth";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useWishlist } from "../../context/WishListContext";
import { Order, UserStats } from "../../../../shared/types/order.ts";

const STRAPI_URL =
  process.env.EXPO_PUBLIC_STRAPI_URL || "http://localhost:1337";

interface AccountComponentProps {
  onLogout?: () => void;
}

export default function AccountComponent({ onLogout }: AccountComponentProps) {
  const { user, logout } = useAuth();
  const { wishlistCount } = useWishlist();

  // Account data states
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<UserStats>({
    totalOrders: 0,
    totalSpent: 0,
    favoriteCount: 0,
  });
  const [dataLoading, setDataLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUserData = async () => {
    if (!user) return;

    try {
      const jwt = await AsyncStorage.getItem("jwt");
      if (!jwt) {
        console.log("No JWT token found");
        return;
      }


      // Fetch orders with populated data
      const ordersResponse = await fetch(
        `${STRAPI_URL}/api/orders?populate[orderItems][populate][pokemon][populate]=*&sort=createdAt:desc`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      console.log("Orders response status:", ordersResponse.status);

      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json();

        const userOrders = ordersData.data || [];

        setOrders(userOrders);

        // Calculate stats
        const totalOrders = userOrders.length;
        const totalSpent = userOrders.reduce(
          (sum: number, order: Order) => sum + (Number(order.total) || 0),
          0
        );

        setStats({
          totalOrders,
          totalSpent,
          favoriteCount: 0, // You can implement wishlist later
        });
      } else {
        const errorData = await ordersResponse.text();
        console.error("Failed to fetch orders:", errorData);
      }
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
            onLogout?.();
          } catch (error) {
            Alert.alert("Error", "Failed to logout");
          }
        },
      },
    ]);
  };

  if (!user) {
    return null;
  }

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
                    {wishlistCount}
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
              <TouchableOpacity 
                className="flex-row items-center p-4 bg-gray-50 rounded-lg mb-3"
                onPress={() => router.push("/(tabs)/orders")}
              >
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
                onPress={() =>
                  router.push({
                    pathname: "/(tabs)",
                    params: { scrollToProducts: "true" },
                  })
                }>
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

          {/* Recent Orders */}
          <View className="bg-white rounded-xl p-6">
            <View className="flex-row items-center mb-4 pb-3 border-b border-gray-200">
              <Ionicons name="bag" size={20} color="#d97706" />
              <Text className="text-xl font-bold text-gray-900 ml-2">
                Recent Orders
              </Text>
            </View>

            {orders.length === 0 ? (
              <View className="items-center py-12">
                <View className="w-16 h-16 bg-gray-100 rounded-full items-center justify-center mb-4 border border-gray-200">
                  <Ionicons name="bag-outline" size={32} color="#9ca3af" />
                </View>
                <Text className="text-gray-600 mb-4 text-center">
                  No recent purchases found.
                </Text>
                <TouchableOpacity
                  className="flex-row items-center bg-yellow-400 px-6 py-3 rounded-lg"
                  onPress={() =>
                    router.push({
                      pathname: "/(tabs)",
                      params: { scrollToProducts: "true" },
                    })
                  }>
                  <Ionicons name="storefront" size={18} color="#000" />
                  <Text className="text-black font-bold ml-2">
                    Start Collecting Cards
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <ScrollView className="max-h-96">
                {orders.slice(0, 5).map((order) => (
                  <View
                    key={order.id}
                    className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    {/* Order Header */}
                    <View className="flex-row justify-between items-start mb-3">
                      <View className="flex-1">
                        <Text className="text-sm text-gray-600">
                          Order #{order.id}
                        </Text>
                        <Text className="text-xs text-gray-500 mt-1">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </Text>
                      </View>
                      <View className="items-end">
                        <Text className="text-lg font-bold text-gray-900">
                          ${Number(order.total).toFixed(2)}
                        </Text>
                        <View
                          className={`px-3 py-1 rounded-full mt-1 ${
                            order.orderStatus === "completed"
                              ? "bg-green-100"
                              : order.orderStatus === "pending"
                                ? "bg-yellow-100"
                                : "bg-gray-100"
                          }`}>
                          <Text
                            className={`text-xs font-semibold ${
                              order.orderStatus === "completed"
                                ? "text-green-800"
                                : order.orderStatus === "pending"
                                  ? "text-yellow-800"
                                  : "text-gray-800"
                            }`}>
                            {order.orderStatus.charAt(0).toUpperCase() +
                              order.orderStatus.slice(1)}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* Order Items Preview */}
                    {order.orderItems && order.orderItems.length > 0 && (
                      <View className="border-t border-gray-200 pt-3">
                        <Text className="text-xs text-gray-600 mb-2">
                          Items ({order.orderItems.length}):
                        </Text>
                        {order.orderItems.slice(0, 2).map((item) => (
                          <Text
                            key={item.id}
                            className="text-sm text-gray-700 mb-1">
                            • {item.Quantity}x {item.pokemon?.name || "Unknown"}
                          </Text>
                        ))}
                        {order.orderItems.length > 2 && (
                          <Text className="text-xs text-gray-500 mt-1">
                            +{order.orderItems.length - 2} more item(s)
                          </Text>
                        )}
                      </View>
                    )}
                  </View>
                ))}
                {orders.length > 5 && (
                  <Text className="text-center text-gray-500 text-sm mt-2">
                    Showing 5 of {orders.length} orders
                  </Text>
                )}
              </ScrollView>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
