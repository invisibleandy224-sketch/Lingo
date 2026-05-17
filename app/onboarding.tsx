import { View, Text, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

export default function OnboardingScreen() {
  return (
    <SafeAreaView className="flex-1 bg-light-purple">
      <View className="flex-1 items-center justify-between px-6 pb-12">
        <View className="items-center pt-8">
          <Image
            source={require("../assets/images/moscot-logo.png")}
            className="w-20 h-20"
            resizeMode="contain"
          />
          <Text className="font-poppins-bold text-h2 text-dark mt-3">
            LINGO
          </Text>
        </View>

        <View className="items-center">
          <Image
            source={require("../assets/images/mascot-welcome.png")}
            className="w-72 h-72"
            resizeMode="contain"
          />
          <Text className="font-poppins-bold text-h3 text-dark text-center mt-6">
            Learn a new language{"\n"}with fun!
          </Text>
          <Text className="font-poppins text-body text-gray text-center mt-3 px-4">
            Discover interactive lessons, earn rewards, and build your streak
            every day.
          </Text>
        </View>

        <View className="w-full">
          <TouchableOpacity
            className="bg-primary w-full py-4 rounded-button items-center"
            onPress={() => router.push("/auth")}
            activeOpacity={0.8}
          >
            <Text className="font-poppins-bold text-body-lg text-white">
              Get started
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="w-full py-4 items-center mt-3"
            onPress={() => router.push("/auth")}
            activeOpacity={0.8}
          >
            <Text className="font-poppins-semibold text-body text-primary">
              I already have an account
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
