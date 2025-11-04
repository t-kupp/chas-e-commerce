import React, {useState, useEffect} from "react";
import {View, Text, Image, TouchableOpacity, ScrollView} from "react-native";
import {useLocalSearchParams, router} from "expo-router";
import {Pokemon} from "../../types";

export default function ProductDetail() {
  const {slug} = useLocalSearchParams();
  const STRAPI_URL = process.env.EXPO_PUBLIC_STRAPI_URL;

  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadPokemon() {
    const res = await fetch(`${STRAPI_URL}/api/pokemons/${slug}?populate=*`);
    const data = await res.json();
    setPokemon(data.data);
    setLoading(false);
  }

  useEffect(() => {
    if (slug) loadPokemon();
  }, [slug]);

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
        <Text>Pokemon not found</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex p-4">
        {/* Bild */}
        {pokemon.image?.url && (
          <Image
            source={{uri: `http://localhost:1337${pokemon.image.url}`}}
            className="w-full h-96 rounded-lg mb-4"
            resizeMode="cover"
          />
        )}

        {/* Info */}
        <Text className="text-3xl font-bold mb-2">{pokemon.name}</Text>
        <Text className="text-2xl font-bold mb-4">${pokemon.price}</Text>
        <Text className="text-gray-600 mb-6 text-right ">
          {pokemon.stock ? `${pokemon.stock} in stock` : "Out of Stock"}
        </Text>

        {/* Köp-knapp */}
        <TouchableOpacity className="bg-blue-500 py-4 px-6 rounded-lg">
          <Text className="text-white font-bold text-lg text-center">
            Add to Cart
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
