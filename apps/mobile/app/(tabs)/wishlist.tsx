import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
} from "react-native";
import { Heart, Trash2, ShoppingCart, X } from "lucide-react-native";
import { useWishlist } from "../context/WishListContext";

export default function Wishlist() {
  const { wishlistItems, clearWishlist, removeFromWishlist, wishlistCount } =
    useWishlist();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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
            className="bg-white rounded-xl mb-3 overflow-hidden shadow-sm border border-gray-100"
          >
            {/* Card Content */}
            <View className="flex-row p-3">
              {/* Product Image */}
              <TouchableOpacity
                onPress={() =>
                  item.image &&
                  setSelectedImage(`http://localhost:1337${item.image.url}`)
                }
                className="w-28 h-40 bg-gray-100 rounded-lg mr-3 items-center justify-center"
              >
                {item.image ? (
                  <Image
                    source={{ uri: `http://localhost:1337${item.image.url}` }}
                    className="w-full h-full rounded-lg"
                    resizeMode="cover"
                  />
                ) : (
                  <ShoppingCart size={24} color="#9CA3AF" />
                )}
              </TouchableOpacity>

              {/* Product Details */}
              <View className="flex-1 pr-8">
                <Text
                  className="text-base font-semibold text-gray-900 mb-1"
                  numberOfLines={2}
                >
                  {item.name}
                </Text>
                {item.price && (
                  <Text className="text-lg font-bold text-gray-800">
                    ${Number(item.price).toFixed(2)}
                  </Text>
                )}
                {item.stock !== undefined && (
                  <Text
                    className={`text-xs mt-1 ${item.stock > 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {item.stock > 0
                      ? `In Stock: ${item.stock}`
                      : "Out of Stock"}
                  </Text>
                )}
              </View>

              {/* Remove Icon */}
              <TouchableOpacity
                onPress={() => removeFromWishlist(item.id)}
                className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-sm border border-gray-200"
              >
                <Trash2 size={16} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Image Modal */}
      <Modal
        visible={selectedImage !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedImage(null)}
      >
        <View className="flex-1 bg-black/90 items-center justify-center">
          {/* Close Button */}
          <TouchableOpacity
            onPress={() => setSelectedImage(null)}
            className="absolute top-12 right-6 bg-white/20 p-3 rounded-full z-10"
          >
            <X size={28} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Large Image */}
          {selectedImage && (
            <Image
              source={{ uri: selectedImage }}
              className="w-11/12 h-3/4 rounded-2xl"
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>
    </View>
  );
}
