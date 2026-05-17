import { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { images } from "../constants/images";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@clerk/expo";

export default function Onboarding() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace("/");
    }
  }, [isLoaded, isSignedIn]);

  if (!isLoaded) {
    return null; // Return nothing while loading the auth state
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View className="flex-row items-center justify-center pt-4 pb-4">
        <Image 
          source={images.mascotLogo} 
          style={{ width: 36, height: 36 }} 
          contentFit="contain" 
        />
        <Text className="text-h2 font-poppins-bold text-primary ml-2">lingo</Text>
      </View>

      {/* Main Content */}
      <View className="flex-1 justify-center items-center px-6">
        <Image 
          source={images.mascotWelcome} 
          style={{ width: 300, height: 300 }} 
          contentFit="contain" 
        />
        
        {/* Title */}
        <View className="mt-8 mb-4">
          <Text className="text-h1 font-poppins-bold text-text-primary text-center leading-tight">
            Your AI language{"\n"}
            <Text className="text-primary">teacher<Text className="text-text-primary">.</Text></Text>
          </Text>
        </View>

        {/* Subtitle */}
        <Text className="text-body-large font-poppins text-text-secondary text-center px-4 leading-relaxed">
          Real conversations, personalized{"\n"}lessons, anytime, anywhere.
        </Text>
      </View>

      {/* Footer / Button */}
      <View className="px-6 pb-10">
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => router.push("/(auth)/sign-up")}
          activeOpacity={0.85}
        >
          <View className="flex-row items-center justify-between px-6 w-full">
            {/* Empty view to perfectly center the text while keeping the arrow on the right */}
            <View style={{ width: 24 }} />
            <Text className="text-white font-poppins-bold text-body-large text-center">
              Get Started
            </Text>
            <Ionicons name="chevron-forward" size={24} color="#FFFFFF" />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F9FAFB", // Sleek light background
  },
  primaryButton: {
    backgroundColor: "#6C4EF5",
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    shadowColor: "#6C4EF5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  }
});
