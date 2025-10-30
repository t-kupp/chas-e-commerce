import React from "react";
import { StyleSheet, View, Text } from "react-native";

import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";

export default function HomeScreen() {
  console.log("HomeScreen render");

  return (
    <ThemedView style={styles.container}>
      {/* Debug banner — very visible to confirm rendering */}

      <ThemedText type="title" style={styles.title}>
        Welcome
      </ThemedText>
      <ThemedText style={styles.subtitle}>
        This is a fresh start for the mobile page.
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    textAlign: "center",
    maxWidth: 380,
  },
  debug: {
    position: "absolute",
    top: 48,
    left: 12,
    zIndex: 9999,
    backgroundColor: "#ff0",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  debugText: {
    color: "#000",
    fontWeight: "700",
  },
});
