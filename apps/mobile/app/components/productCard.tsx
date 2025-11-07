// ...existing code...
import React from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import {Link} from "expo-router";
import {SortOption} from "../../../shared/types/pokemon";
import {useCart} from "../context/CartContext";
import {usePokemons} from "@/hooks/usePokemonApi";
import {ShoppingCart, Dot} from "lucide-react-native";

interface ProductCardProps {
  sortBy?: SortOption;
}

export default function ProductCard({sortBy}: ProductCardProps) {
  const {addItem} = useCart();
  const {pokemons = [], loading} = usePokemons();

  function sortedPokemons() {
    const arr = [...pokemons]; // kopiera så vi inte muterar original

    switch (sortBy) {
      case "name-asc":
        return arr.sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return arr.sort((a, b) => b.name.localeCompare(a.name));
      case "price-asc":
        return arr.sort((a, b) => a.price - b.price);
      case "price-desc":
        return arr.sort((a, b) => b.price - a.price);
      default:
        return arr;
    }
  }
  const sorted = sortedPokemons();

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{paddingVertical: 8}}>
      <View className="flex-row flex-wrap justify-center p-2">
        {sorted.map((pokemon) => (
          <View
            key={pokemon.id}
            className="bg-white rounded-xl shadow-md border border-gray-200 p-3 m-2 w-44"
          >
            {/* Bild */}
            {pokemon.image?.url ? (
              <Image
                source={{uri: `http://localhost:1337${pokemon.image.url}`}}
                className="w-full h-52 rounded-lg mb-3"
                resizeMode="cover"
              />
            ) : (
              <View className="w-full h-36 bg-gray-100 rounded-lg mb-3 items-center justify-center">
                <Text className="text-gray-400 text-xs">No Image</Text>
              </View>
            )}

            <View className="w-full">
              <Text
                className="text-base font-semibold text-gray-900"
                numberOfLines={2}
              >
                {pokemon.name}
              </Text>

              <Text
                className={
                  pokemon.stock
                    ? "text-xs text-green-600 mt-1"
                    : "text-xs text-red-600 mt-1"
                }
              >
                {pokemon.stock ? `Stock: ${pokemon.stock}` : "Out of Stock"}
              </Text>

              <Text className="text-lg font-bold text-black mt-2">
                ${Number(pokemon.price).toFixed(2)}
              </Text>

              <Link href={`/productCardDetailPage/${pokemon.documentId}`}>
                <Text className="text-sm text-blue-600 underline mt-2">
                  View details
                </Text>
              </Link>

              <TouchableOpacity
                className="bg-yellow-500 text-white py-2 flex justify-center items-center gap-2 rounded-md mt-3"
                onPress={() =>
                  pokemon.stock > 0
                    ? addItem({
                        id: pokemon.id,
                        name: pokemon.name,
                        price: pokemon.price,
                        image: pokemon.image?.url,
                        stock: pokemon.stock,
                        quantity: 1,
                      })
                    : ""
                }
                accessibilityLabel={`Add ${pokemon.name} to cart`}
              >
                <Text className="text-white text-center font-medium">
                  <ShoppingCart size={12} color={"white"} /> Add to cart
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
