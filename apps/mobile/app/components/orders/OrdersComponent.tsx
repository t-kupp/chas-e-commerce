import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  SafeAreaView,
  RefreshControl,
} from "react-native";
import { useAuth } from "../../context/auth";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STRAPI_URL =
  process.env.EXPO_PUBLIC_STRAPI_URL || "http://localhost:1337";

interface Pokemon {
  id: number;
  documentId: string;
  name: string;
  price: number;
  image: {
    url: string;
  };
}

interface OrderItem {
  id: number;
  pokemon: Pokemon;
  Quantity: number;
}

interface Order {
  id: number;
  documentId: string;
  total: number;
  orderStatus: string;
  createdAt: string;
  orderItems: OrderItem[];
}

export default function OrdersComponent() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async () => {
    if (!user) return;

    try {
      const jwt = await AsyncStorage.getItem("jwt");
      if (!jwt) {
        console.log("No JWT token found");
        return;
      }

      const url = `${STRAPI_URL}/api/orders?populate[orderItems][populate][pokemon][populate]=*&sort=createdAt:desc`;
      console.log("Fetching orders with URL:", url);
      console.log("User ID:", user.id);

      const ordersResponse = await fetch(url, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      const data = await ordersResponse.json();
      console.log("Orders response:", data);
      console.log("First order:", JSON.stringify(data.data?.[0], null, 2));
      console.log(
        "First order item:",
        JSON.stringify(data.data?.[0]?.orderItems?.[0], null, 2)
      );

      if (ordersResponse.ok) {
        if (data.error) {
          console.error("Error fetching orders:", data.error);
          setOrders([]);
        } else {
          setOrders(data.data || []);
        }
      } else {
        console.error("Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!user) {
    router.replace("/(tabs)/profile");
    return null;
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="px-4 py-3 border-b border-gray-200">
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/profile")}
          className="flex-row items-center mb-2">
          <Ionicons name="arrow-back" size={24} color="#374151" />
          <Text className="ml-2 text-base">Back to Account</Text>
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-gray-900">My Orders</Text>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#fbbf24" />
          <Text className="text-gray-600 mt-2">Loading orders...</Text>
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <View className="p-4">
            {orders.length === 0 ? (
              <View className="bg-white rounded-xl p-8 items-center">
                <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-4">
                  <Ionicons name="bag-outline" size={40} color="#9ca3af" />
                </View>
                <Text className="text-xl font-semibold text-gray-900 mb-2">
                  No Orders Yet
                </Text>
                <Text className="text-gray-600 text-center mb-6">
                  You haven't placed any orders yet. Start shopping to see your
                  orders here.
                </Text>
                <TouchableOpacity
                  className="bg-yellow-400 px-6 py-3 rounded-lg"
                  onPress={() => router.push("/(tabs)")}>
                  <Text className="font-semibold text-black">
                    Start Shopping
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View className="space-y-4">
                {orders.map((order) => (
                  <View
                    key={order.id}
                    className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden mb-4">
                    {/* Order Header */}
                    <View className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                      <View className="flex-row justify-between items-start">
                        <View>
                          <Text className="text-lg font-semibold text-gray-900">
                            Order #{order.id}
                          </Text>
                          <Text className="text-gray-600 text-sm mt-1">
                            Placed on {formatDate(order.createdAt)}
                          </Text>
                        </View>
                        <View className="items-end">
                          <Text className="text-2xl font-bold text-gray-900">
                            ${Number(order.total).toFixed(2)}
                          </Text>
                          <View
                            className={`px-3 py-1 rounded-full mt-2 ${getStatusColor(order.orderStatus)}`}>
                            <Text className="text-sm font-medium">
                              {order.orderStatus.charAt(0).toUpperCase() +
                                order.orderStatus.slice(1)}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>

                    {/* Order Items */}
                    <View className="p-6">
                      <Text className="font-semibold text-gray-900 mb-4">
                        Items ({order.orderItems?.length || 0})
                      </Text>

                      <View className="space-y-4">
                        {order.orderItems?.map((item) => (
                          <View
                            key={item.id}
                            className="flex-row items-center gap-4 p-4 bg-gray-50 rounded-lg">
                            {/* Pokemon Image */}
                            <View className="w-16 h-20 bg-white rounded-md overflow-hidden border border-gray-200">
                              {item.pokemon?.image?.url ? (
                                <Image
                                  source={{
                                    uri: item.pokemon.image.url.startsWith(
                                      "http"
                                    )
                                      ? item.pokemon.image.url
                                      : `${STRAPI_URL}${item.pokemon.image.url}`,
                                  }}
                                  className="w-full h-full"
                                  resizeMode="cover"
                                />
                              ) : (
                                <View className="w-full h-full items-center justify-center">
                                  <Ionicons
                                    name="image-outline"
                                    size={24}
                                    color="#9ca3af"
                                  />
                                </View>
                              )}
                            </View>

                            {/* Pokemon Details */}
                            <View className="flex-1">
                              <Text className="font-semibold text-gray-900">
                                {item.pokemon?.name || "Unknown Pokémon"}
                              </Text>
                              <Text className="text-sm text-gray-600 mt-1">
                                Quantity: {item.Quantity}
                              </Text>
                              <Text className="text-sm text-gray-600">
                                Price: $
                                {Number(item.pokemon?.price || 0).toFixed(2)}{" "}
                                each
                              </Text>
                            </View>

                            {/* Item Total */}
                            <View className="items-end">
                              <Text className="font-semibold text-gray-900">
                                $
                                {(
                                  Number(item.pokemon?.price || 0) *
                                  item.Quantity
                                ).toFixed(2)}
                              </Text>
                            </View>
                          </View>
                        ))}
                      </View>

                      {/* Order Total */}
                      <View className="mt-6 pt-4 border-t border-gray-200">
                        <View className="flex-row justify-between items-center">
                          <Text className="font-semibold text-gray-900">
                            Order Total:
                          </Text>
                          <Text className="text-xl font-bold text-gray-900">
                            ${Number(order.total).toFixed(2)}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
