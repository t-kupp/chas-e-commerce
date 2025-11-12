import React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useCart } from "../../context/CartContext";
import { usePokemon } from "@/hooks/usePokemonApiSlug";
import { ChevronLeft, Heart } from "lucide-react-native";
import { useWishlist } from "@/app/context/WishListContext";

export default function ProductDetail() {
  const { slug } = useLocalSearchParams();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const slugParam = typeof slug === "string" ? slug : undefined;

  const { addItem } = useCart();
  const { pokemon, loading } = usePokemon(slugParam);
  const STRAPI_URL =
    process.env.EXPO_PUBLIC_STRAPI_URL ?? "http://localhost:1337";

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!pokemon) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Product not found</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white pt-10">
      {/* Back Button */}
      <TouchableOpacity
        onPress={() => router.back()}
        className="absolute top-12 left-4 z-10 bg-white rounded-full p-2 shadow-lg"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
      >
        <ChevronLeft size={28} color="#000" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={{ padding: 20, alignItems: "center" }}>
        <View className="relative w-full">
          {pokemon.image?.url && (
            <Image
              source={{ uri: `${STRAPI_URL}${pokemon.image.url}` }}
              className="w-full h-[500px] rounded-lg mb-4"
              resizeMode="cover"
            />
          )}

          {/* Wishlist Heart Button - positioned to overlap card edge */}
          <TouchableOpacity
            onPress={() => {
              if (isInWishlist(pokemon.id)) {
                removeFromWishlist(pokemon.id);
              } else {
                addToWishlist(pokemon);
              }
            }}
            className="absolute -top-6 -right-6 bg-white rounded-full p-3 shadow-lg"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
          >
            <Heart
              size={28}
              fill={isInWishlist(pokemon.id) ? "red" : "none"}
              stroke="red"
              strokeWidth={2}
            />
          </TouchableOpacity>
        </View>

        <View className="w-full items-center">
          <View className="p-4 w-full flex-row justify-between items-center ">
            <Text className="text-2xl font-bold mb-2 text-center">
              {pokemon.name}
            </Text>

            <Text
              className={`text-sm ${pokemon.stock ? "text-green-600" : "text-red-600"} mb-4 text-center`}
            >
              {pokemon.stock ? `${pokemon.stock} in stock` : "Out of Stock"}
            </Text>
          </View>

          {/* <Text className="text-4xl font-bold mb-4 text-center">
            ${Number(pokemon.price).toFixed(2)}
          </Text> */}

          <View className="flex-row justify-between w-full mb-6">
            <View className="flex-1 pr-2 items-center">
              <Text className="text-xs text-gray-500">Type</Text>
              <Text className="text-base text-gray-800 text-center">
                {typeof pokemon.type === "string"
                  ? pokemon.type
                  : ((pokemon.type as any)?.name ??
                    (pokemon.type as any)?.title ??
                    "-")}
              </Text>
            </View>

            <View className="flex-1 px-2 items-center">
              <Text className="text-xs text-gray-500">Condition</Text>
              <Text className="text-base text-gray-800 text-center">
                {typeof pokemon.condition === "string"
                  ? pokemon.condition
                  : ((pokemon.condition as any)?.name ??
                    (pokemon.condition as any)?.title ??
                    "-")}
              </Text>
            </View>

            <View className="flex-1 pl-2 items-center">
              <Text className="text-xs text-gray-500">Rarity</Text>
              <Text className="text-base text-gray-800 text-center">
                {typeof pokemon.rarity === "string"
                  ? pokemon.rarity
                  : ((pokemon.rarity as any)?.name ??
                    (pokemon.rarity as any)?.title ??
                    "-")}
              </Text>
            </View>
          </View>
          <View className="w-full mb-6">
            <Text className="text-xs text-gray-500 mb-2">Description</Text>
            <Text className="text-base text-gray-800">
              {pokemon.description}
            </Text>
          </View>

          <TouchableOpacity
            // disabled={!pokemon.stock || pokemon.stock <= 0}
            onPress={() =>
              pokemon.stock > 0
                ? addItem({
                    id: pokemon.id,
                    documentId: pokemon.documentId,
                    name: pokemon.name,
                    price: pokemon.price,
                    image:
                      (pokemon.image as any)?.url ??
                      (pokemon.image as any) ??
                      undefined,
                    quantity: 1,
                    stock: pokemon.stock,
                  })
                : null
            }
            className="bg-black py-4 rounded-lg w-10/12 self-center mb-8"
          >
            <Text className="text-white text-center font-bold text-lg">
              Add to Cart • ${Number(pokemon.price).toFixed(2)}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
