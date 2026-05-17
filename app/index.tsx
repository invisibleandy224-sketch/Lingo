import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { images } from "../constants/images";

export default function Index() {
  const router = useRouter();

  return (
    <View className="flex-1 justify-center items-center bg-background p-4 gap-4">
      <Image 
        source={images.mascotLogo} 
        style={{ width: 150, height: 150 }} 
        contentFit="contain"
      />
      <Text className="text-h1 text-primary text-center font-poppins-bold">lingo</Text>

      <TouchableOpacity 
        style={styles.primaryButton}
        onPress={() => router.push("/onboarding")}
        activeOpacity={0.8}
      >
        <Text className="text-white font-poppins-bold text-body-large text-center">
          Go to Onboarding
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  primaryButton: {
    backgroundColor: "#6C4EF5",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 24,
    marginTop: 24,
  },
});
