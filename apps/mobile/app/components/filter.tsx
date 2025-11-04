import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React from "react";

export type SortOption =
  | "name-asc"
  | "name-desc"
  | "price-asc"
  | "price-desc"
  | null;

interface FilterProps {
  selectedSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export default function Filter({ selectedSort, onSortChange }: FilterProps) {
  const sortOptions: { value: SortOption; label: string }[] = [
    { value: null, label: "Default" },
    { value: "name-asc", label: "A-Z" },
    { value: "name-desc", label: "Z-A" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
  ];

  return (
    <View className="p-4">
      <Text className="text-xl font-bold mb-3">Sort by</Text>
      <View className="flex-row flex-wrap">
        {sortOptions.map((option) => (
          <TouchableOpacity
            key={option.label}
            onPress={() => onSortChange(option.value)}
            className={`px-4 py-2 mr-2 mb-2 rounded-full ${
              selectedSort === option.value ? "bg-blue-600" : "bg-gray-200"
            }`}
          >
            <Text
              className={`font-medium ${
                selectedSort === option.value ? "text-white" : "text-gray-800"
              }`}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
