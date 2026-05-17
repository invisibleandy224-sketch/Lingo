import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center px-6">
        <Text className="font-poppins-bold text-hero text-dark">
          Hello
        </Text>
        <Text className="font-poppins text-body text-gray mt-4 text-center">
          Welcome to your Duolingo-inspired language learning app
        </Text>
        <TouchableOpacity
          className="bg-primary mt-8 px-8 py-4 rounded-button"
          onPress={() => router.push("/onboarding")}
          activeOpacity={0.8}
        >
          <Text className="font-poppins-bold text-body-lg text-white">
            Open Onboarding
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
