import React from "react";
import {View, Text, Image, TouchableOpacity, ScrollView} from "react-native";
import {useLocalSearchParams} from "expo-router";
import {useCart} from "../context/CartContext";
import {usePokemon} from "@/hooks/usePokemonApiSlug";

export default function ProductDetail() {
  const {slug} = useLocalSearchParams();
  const slugParam = typeof slug === "string" ? slug : undefined;

  const {addItem} = useCart();
  const {pokemon, loading} = usePokemon(slugParam);
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
    <View className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{padding: 16, alignItems: "center"}}>
        {pokemon.image?.url && (
          <Image
            source={{uri: `${STRAPI_URL}${pokemon.image.url}`}}
            className="w-full h-[500px] rounded-lg mb-4"
            resizeMode="cover"
          />
        )}

        <View className="w-full items-center">
          <Text className="text-2xl font-bold mb-2 text-center">
            {pokemon.name}
          </Text>

          <Text className="text-sm text-gray-600 mb-4 text-center">
            {pokemon.stock ? `${pokemon.stock} in stock` : "Out of Stock"}
          </Text>

          <Text className="text-4xl font-bold mb-4 text-center">
            ${Number(pokemon.price).toFixed(2)}
          </Text>

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

          <TouchableOpacity
            // disabled={!pokemon.stock || pokemon.stock <= 0}
            onPress={() =>
              pokemon.stock > 0
                ? addItem({
                    id: pokemon.id,
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
              Add to Cart
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
// import React from "react";
// import {View, Text, Image, TouchableOpacity, ScrollView} from "react-native";
// import {useLocalSearchParams, router} from "expo-router";
// import {useCart} from "../context/CartContext";
// import {usePokemon} from "@/hooks/usePokemonApiSlug";

// export default function ProductDetail() {
//   const {slug} = useLocalSearchParams();
//   const slugParam = typeof slug === "string" ? slug : undefined;

//   // Cart context
//   const {addItem} = useCart();

//   // Fetch pokemon by slug
//   const {pokemon, loading} = usePokemon(slugParam);

//   if (loading) {
//     return (
//       <View className="flex-1 items-center justify-center">
//         <Text>Loading...</Text>
//       </View>
//     );
//   }

//   if (!pokemon) {
//     return (
//       <View className="flex-1 items-center justify-center">
//         <Text>Pokemon not found</Text>
//       </View>
//     );
//   }

//   return (
//     <ScrollView className="flex-1 bg-white">
//       <View className="flex p-4">
//         {/* Bild */}
//         {pokemon.image?.url && (
//           <Image
//             source={{uri: `http://localhost:1337${pokemon.image.url}`}}
//             className="w-full h-96 rounded-lg mb-4"
//             resizeMode="cover"
//           />
//         )}

//         {/* Info */}
//         <Text className="text-3xl font-bold mb-2">{pokemon.name}</Text>
//         <Text className="text-2xl font-bold mb-4">${pokemon.price}</Text>
//         <Text className="text-gray-600 mb-6 text-right ">
//           {pokemon.stock ? `${pokemon.stock} in stock` : "Out of Stock"}
//         </Text>

//         {/* -Buy button */}
//         <TouchableOpacity
//           onPress={() =>
//             addItem({
//               id: pokemon.id,
//               name: pokemon.name,
//               price: pokemon.price,
//               image: pokemon.image?.url,
//               quantity: 1,
//             })
//           }
//           className="bg-black py-4 px-6 rounded-lg"
//         >
//           <Text className="text-white font-bold text-lg text-center">
//             Add to Cart
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   );
// }
