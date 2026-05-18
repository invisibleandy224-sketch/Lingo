import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useAuth } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { images } from "../constants/images";
import { languages } from "../data/languages";
import { useLanguageStore } from "../store/useLanguageStore";

export default function Index() {
  const { isSignedIn, isLoaded, signOut } = useAuth();
  const router = useRouter();

  const selectedLanguageId = useLanguageStore((state) => state.selectedLanguageId);
  const clearLanguage = useLanguageStore((state) => state.clearLanguage);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace("/onboarding");
    } else if (isLoaded && isSignedIn && !selectedLanguageId) {
      router.replace("/language-select");
    }
  }, [isLoaded, isSignedIn, selectedLanguageId]);

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

  const handleResetLanguage = () => {
    Alert.alert(
      "Reset Language",
      "This will clear your language selection. You'll need to choose again.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => {
            clearLanguage();
            router.replace("/language-select");
          },
        },
      ]
    );
  };

  const difficultyColor = (d: string) => {
    switch (d) {
      case "beginner": return { bg: "#E8F5E9", text: "#2E7D32" };
      case "intermediate": return { bg: "#FFF3E0", text: "#E65100" };
      case "advanced": return { bg: "#FFEBEE", text: "#C62828" };
      default: return { bg: "#F3E5F5", text: "#6A1B9A" };
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <View className="flex-row items-center justify-between px-6 pt-4 pb-3">
        <View className="flex-row items-center">
          <Image
            source={images.mascotLogo}
            style={{ width: 32, height: 32 }}
            contentFit="contain"
          />
          <Text className="text-h3 font-poppins-bold text-primary ml-2">lingo</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <TouchableOpacity
            onPress={handleResetLanguage}
            className="p-2"
            activeOpacity={0.7}
          >
            <Ionicons name="refresh-outline" size={22} color="#6B7280" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => signOut()}
            className="p-2"
            activeOpacity={0.7}
          >
            <Ionicons name="log-out-outline" size={22} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-6 mb-6">
          <Text className="text-h1 font-poppins-bold text-text-primary">
            Pick a language
          </Text>
          <Text className="text-body-medium font-poppins text-text-secondary mt-1">
            Start your learning journey
          </Text>
        </View>

        <View className="px-6 gap-3">
          {languages.map((lang) => {
            const diff = difficultyColor(lang.difficulty);
            return (
              <TouchableOpacity
                key={lang.id}
                activeOpacity={0.85}
                className="flex-row items-center bg-white border border-border rounded-3xl p-4 shadow-sm"
                onPress={() => router.push({ pathname: "/language/[id]", params: { id: lang.id } })}
              >
                <View className="w-14 h-14 rounded-2xl items-center justify-center" style={{ backgroundColor: `${lang.color}15` }}>
                  <Text className="text-2xl">{lang.flag}</Text>
                </View>
                <View className="flex-1 ml-4">
                  <Text className="text-h4 font-poppins-bold text-text-primary">
                    {lang.name}
                  </Text>
                  <Text className="text-body-small font-poppins text-text-secondary mt-0.5">
                    {lang.nativeName}
                  </Text>
                  <View className="flex-row items-center mt-2 gap-2">
                    <View className="px-2 py-0.5 rounded-full" style={{ backgroundColor: diff.bg }}>
                      <Text className="text-caption font-poppins-semibold uppercase tracking-wider" style={{ color: diff.text }}>
                        {lang.difficulty}
                      </Text>
                    </View>
                    <Text className="text-caption font-poppins text-text-secondary">
                      {lang.lessonCount} lessons
                    </Text>
                  </View>
                </View>
                <View className="items-end">
                  <Text className="text-body-small font-poppins-bold text-primary">
                    {lang.activeLearners.toLocaleString()}
                  </Text>
                  <Text className="text-caption font-poppins text-text-secondary">
                    learners
                  </Text>
                  <Ionicons name="chevron-forward" size={18} color="#D1D5DB" style={{ marginTop: 4 }} />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
