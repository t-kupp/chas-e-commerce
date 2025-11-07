import React from "react";
import {View, Text, ScrollView, TouchableOpacity, Image} from "react-native";
import {Heart, Trash2, ShoppingCart} from "lucide-react-native";
import {useWishlist} from "../context/WishListContext";

export default function Wishlist() {
  const {wishlistItems, clearWishlist, removeFromWishlist, wishlistCount} =
    useWishlist();

  if (wishlistItems.length === 0) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center px-6">
        <Heart size={64} color="#E5E7EB" fill="#E5E7EB" />
        <Text className="text-2xl font-bold text-gray-800 mt-4">
          Your Wishlist is Empty
        </Text>
        <Text className="text-gray-500 text-center mt-2">
          Start adding items you love to your wishlist
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50 pt-20">
      {/* Header */}
      <View className="bg-white px-6 py-4 border-b border-gray-200">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-bold text-gray-800">
              My Wishlist
            </Text>
            <Text className="text-gray-500 mt-1">
              {wishlistCount} {wishlistCount === 1 ? "item" : "items"}
            </Text>
          </View>
          <TouchableOpacity
            onPress={clearWishlist}
            className="bg-red-50 px-4 py-2 rounded-full"
          >
            <Text className="text-red-600 font-semibold">Clear All</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Wishlist Items */}
      <ScrollView className="flex-1 px-4 py-4">
        {wishlistItems.map((item) => (
          <View
            key={item.id}
            className="bg-white rounded-2xl mb-4 overflow-hidden shadow-sm"
          >
            {/* Card Content */}
            <View className="flex-row p-4">
              {/* Product Image */}
              <View className="w-36 h-36 bg-gray-100 rounded-xl mr-4 items-center justify-center">
                {item.image ? (
                  <Image
                    source={{uri: `http://localhost:1337${item.image.url}`}}
                    className="w-full h-full rounded-xl"
                    resizeMode="cover"
                  />
                ) : (
                  <ShoppingCart size={32} color="#9CA3AF" />
                )}
              </View>

              {/* Product Details */}
              <View className="flex-1 justify-center">
                <Text
                  className="text-lg font-bold text-gray-800 pr-8"
                  numberOfLines={2}
                >
                  {item.name}
                </Text>
                {item.price && (
                  <Text className="text-xl font-bold text-gray-800 mt-2">
                    ${item.price}
                  </Text>
                )}
              </View>

              {/* Heart Icon */}
              <TouchableOpacity
                onPress={() => removeFromWishlist(item.id)}
                className="absolute top-3 right-3 bg-red-50 p-2.5 rounded-full"
              >
                <Heart size={20} color="#EF4444" fill="#EF4444" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
