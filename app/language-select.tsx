import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { images } from "../constants/images";
import { languages } from "../data/languages";
import { useLanguageStore } from "../store/useLanguageStore";

function formatLearners(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}

export default function LanguageSelect() {
  const router = useRouter();
  const selectedLanguageId = useLanguageStore((state) => state.selectedLanguageId);
  const setSelectedLanguage = useLanguageStore((state) => state.setSelectedLanguage);
  const [selectedId, setSelectedId] = useState<string>(selectedLanguageId || "es");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLanguages = languages.filter((lang) =>
    lang.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      {/* Header */}
      <View className="flex-row items-center px-6 pt-4 pb-3">
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-2 -ml-2"
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={24} color="#0D132B" />
        </TouchableOpacity>
        <View className="flex-1 items-center mr-8">
          <Text className="text-h4 font-poppins-bold text-text-primary">
            Choose a language
          </Text>
        </View>
      </View>

      {/* Search Bar */}
      <View className="px-6 mb-4">
        <View className="flex-row items-center bg-surface rounded-2xl px-4 py-3">
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <TextInput
            placeholder="Search languages"
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 ml-3 text-body-medium font-poppins text-text-primary"
          />
        </View>
      </View>

      {/* Popular Section */}
      <Text className="px-6 text-body-large font-poppins-bold text-text-primary mb-3">
        Popular
      </Text>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-6 gap-3">
          {filteredLanguages.map((lang) => {
            const isSelected = selectedId === lang.id;
            return (
              <TouchableOpacity
                key={lang.id}
                activeOpacity={0.85}
                className={`flex-row items-center rounded-2xl p-4 ${
                  isSelected
                    ? "bg-primary/5 border-2 border-primary"
                    : "bg-white border border-border"
                }`}
                onPress={() => setSelectedId(lang.id)}
              >
                {/* Flag Circle */}
                <View className="w-12 h-12 rounded-full items-center justify-center bg-white shadow-sm">
                  <Text className="text-2xl">{lang.flag}</Text>
                </View>

                {/* Language Info */}
                <View className="flex-1 ml-4">
                  <Text className="text-h4 font-poppins-bold text-text-primary">
                    {lang.name}
                  </Text>
                  <Text className="text-body-small font-poppins text-text-secondary mt-0.5">
                    {formatLearners(lang.activeLearners)} learners
                  </Text>
                </View>

                {/* Selection Indicator */}
                {isSelected ? (
                  <View className="w-7 h-7 rounded-full bg-primary items-center justify-center">
                    <Ionicons name="checkmark" size={18} color="#FFFFFF" />
                  </View>
                ) : (
                  <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Confirmation Button */}
        <View className="px-6 mt-6">
          <TouchableOpacity
            activeOpacity={0.85}
            className="bg-primary rounded-2xl py-4 items-center"
            onPress={() => {
              setSelectedLanguage(selectedId);
              router.push({
                pathname: "/language/[id]",
                params: { id: selectedId },
              });
            }}
          >
            <Text className="text-white font-poppins-bold text-body-large">
              Continue
            </Text>
          </TouchableOpacity>
        </View>

        {/* Earth Image */}
        <View className="items-center mt-6 mb-4">
          <Image
            source={images.earth}
            style={{ width: 280, height: 160 }}
            contentFit="contain"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
