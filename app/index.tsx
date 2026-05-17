import React, { useEffect } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ActivityIndicator 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useAuth } from "@clerk/expo";
import { images } from "../constants/images";
import { Ionicons } from "@expo/vector-icons";

export default function Index() {
  const { isSignedIn, isLoaded, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace("/onboarding");
    }
  }, [isLoaded, isSignedIn]);

  if (!isLoaded) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color="#6C4EF5" />
      </View>
    );
  }

  if (!isSignedIn) {
    return null;
  }

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <View className="flex-1 justify-center items-center px-6 gap-8">
        <View className="items-center">
          <Image 
            source={images.mascotLogo} 
            style={{ width: 64, height: 64 }} 
            contentFit="contain" 
          />
          <Text className="text-h1 font-poppins-bold text-primary mt-2">lingo</Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleSignOut}
          className="bg-white border border-border border-b-4 border-b-border rounded-2xl h-14 px-8 justify-center items-center shadow-sm"
        >
          <View className="flex-row items-center">
            <Ionicons name="log-out-outline" size={18} color="#0D132B" style={{ marginRight: 8 }} />
            <Text className="text-text-primary font-poppins-bold text-body-large">
              Log Out
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
