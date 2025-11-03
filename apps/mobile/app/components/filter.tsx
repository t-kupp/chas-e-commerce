import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React, { useState } from "react";

const types = [
  "bug",
  "dark",
  "dragon",
  "electric",
  "fairy",
  "fighting",
  "fire",
  "flying",
  "ghost",
  "grass",
  "ground",
  "ice",
  "normal",
  "poison",
  "psychic",
  "rock",
  "steel",
  "water",
];

const typeColors: { [key: string]: string } = {
  bug: "#A8B820",
  dark: "#705848",
  dragon: "#7038F8",
  electric: "#F8D030",
  fairy: "#EE99AC",
  fighting: "#C03028",
  fire: "#F08030",
  flying: "#A890F0",
  ghost: "#705898",
  grass: "#78C850",
  ground: "#E0C068",
  ice: "#98D8D8",
  normal: "#A8A878",
  poison: "#A040A0",
  psychic: "#F85888",
  rock: "#B8A038",
  steel: "#B8B8D0",
  water: "#6890F0",
};

export default function Filter() {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  return (
    <View className="p-10">
      <Text className="text-2xl font-bold mb-4">Filter by Type</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-row"
      >
        {types.map((type) => (
          <TouchableOpacity
            key={type}
            onPress={() => setSelectedType(type)}
            style={{
              backgroundColor: typeColors[type],
              marginHorizontal: 8,
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 9999,
              borderWidth: 4,
              borderColor: selectedType === type ? "#FBBF24" : typeColors[type],
              alignItems: "center",
            }}
          >
            <Text className="text-base font-bold text-white capitalize">
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
