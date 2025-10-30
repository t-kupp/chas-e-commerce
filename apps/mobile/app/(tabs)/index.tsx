import React from "react";
import { StyleSheet, View, Text } from "react-native";

import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";

export default function HomeScreen() {
  console.log("HomeScreen render");

  return (
    <ThemedView className="flex-1 items-center justify-center p-4">
      {/* Debug banner — very visible to confirm rendering */}

      <ThemedText type="title" className="text-blue-600">
        Welcome
      </ThemedText>
      <ThemedText className="text-center max-w-[380px]">
        This is a fresh start for the mobile page.
      </ThemedText>
    </ThemedView>
  );
}
