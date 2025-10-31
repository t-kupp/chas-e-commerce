import React from "react";
import {View, StyleSheet} from "react-native";
import {Tabs} from "expo-router";

export default function Layout() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Tabs screenOptions={{headerShown: false}}>
          <Tabs.Screen name="index" options={{title: "Home"}} />
          <Tabs.Screen name="cart" options={{title: "Cart"}} />
          <Tabs.Screen name="login" options={{title: "Login"}} />
        </Tabs>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  content: {flex: 1},
});
