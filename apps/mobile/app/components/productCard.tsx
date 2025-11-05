import React, {useState, useEffect} from "react";
import {Text, View, Image, TouchableOpacity, ScrollView} from "react-native";
import {Link} from "expo-router";
import {Pokemon} from "@/types";
import {SortOption} from "./filter";
import {useCart} from "../context/CartContext";

interface ProductCardProps {
  sortBy?: SortOption;
}

export default function ProductCard({sortBy}: ProductCardProps) {
  const STRAPI_URL = process.env.EXPO_PUBLIC_STRAPI_URL;
  const {addItem} = useCart();
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadPokemons() {
    const res = await fetch(`${STRAPI_URL}/api/pokemons?populate=*`);
    const data = await res.json();
    setPokemons(data.data);
    setLoading(false);
  }

  useEffect(() => {
    loadPokemons();
  }, []);

  // Apply sorting to pokemons
  const sortedPokemons = React.useMemo(() => {
    const pokemonsCopy = [...pokemons];

    switch (sortBy) {
      case "name-asc":
        return pokemonsCopy.sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return pokemonsCopy.sort((a, b) => b.name.localeCompare(a.name));
      case "price-asc":
        return pokemonsCopy.sort((a, b) => a.price - b.price);
      case "price-desc":
        return pokemonsCopy.sort((a, b) => b.price - a.price);
      default:
        return pokemonsCopy;
    }
  }, [pokemons, sortBy]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <View className="flex-row flex-wrap justify-center p-2">
        {sortedPokemons.map((pokemon) => (
          <View
            key={pokemon.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 m-2 w-44 items-center"
          >
            {/* Bild */}
            {pokemon.image?.url ? (
              <Image
                source={{uri: `http://localhost:1337${pokemon.image.url}`}}
                className="w-full h-56 rounded-md mb-3"
                resizeMode="cover"
              />
            ) : (
              <View className="w-full h-32 bg-gray-200 rounded-md mb-3 items-center justify-center">
                <Text className="text-gray-500 text-xs">No Image</Text>
              </View>
            )}

            <Text className="text-lg font-bold text-gray-900 mb-1">
              {pokemon.name}
            </Text>

            <Text className="text-xs text-gray-500 mb-2">
              {pokemon.stock ? `Stock: ${pokemon.stock}` : "Out of Stock"}
            </Text>

            <Text className="text-xl font-bold black mb-3">
              ${pokemon.price}
            </Text>

            {/* View Details länk */}
            <Link href={`/productCardDetailPage/${pokemon.documentId}`}>
              <Text className="black underline mb-3 text-center">
                View Details
              </Text>
            </Link>

            <TouchableOpacity
              className="bg-black py-2 px-4 rounded-md"
              onPress={() =>
                addItem({
                  id: pokemon.id,
                  name: pokemon.name,
                  price: pokemon.price,
                  image: pokemon.image?.url,
                  quantity: 1,
                })
              }
            >
              <Text className="text-white font-medium text-center">
                Buy Now
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
