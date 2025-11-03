import React, {useState, useEffect} from "react";
import {Text, View, Image, TouchableOpacity, ScrollView} from "react-native";

interface Pokemon {
  id: number;
  name: string;
  price: number;
  stock: number | null;
  image?: {
    url: string;
  };
}

export default function ProductCard() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadPokemons() {
    const res = await fetch(
      "http://localhost:1337/api/pokemons?populate[0]=image"
    );
    const data = await res.json();
    setPokemons(Array.isArray(data.data) ? data.data : []);
    setLoading(false);
  }

  useEffect(() => {
    loadPokemons();
  }, []);

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
        {pokemons.map((pokemon) => (
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
              {pokemon.stock ? `Stock: ${pokemon.stock}` : "Limited"}
            </Text>

            <Text className="text-xl font-bold text-blue-600 mb-3">
              ${pokemon.price}
            </Text>

            <TouchableOpacity
              className="bg-blue-500 py-2 px-4 rounded-md"
              onPress={() => console.log(`Buy ${pokemon.name}`)}
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
