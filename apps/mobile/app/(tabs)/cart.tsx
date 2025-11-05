import React from "react";
import {View, Text, Image, ScrollView} from "react-native";
import {useCart} from "../context/CartContext";

export default function CartPage() {
  const {total, items} = useCart();
  console.log("items :", items);

  return (
    <ScrollView>
      <View className="flex-1 items-center justify-center p-4">
        {items.length < 1 ? (
          <Text>Your cart is empty</Text>
        ) : (
          items.map((item) => {
            return (
              <View key={item.id}>
                <Text>Name: {item.name} </Text>
                <Text>Price: {item.price} </Text>
                <Image
                  height={250}
                  width={250}
                  resizeMode="contain"
                  source={{uri: `http://localhost:1337${item.image}`}}
                />
              </View>
            );
          })
        )}

        <Text>Total: {total}</Text>
      </View>
    </ScrollView>
  );
}
