import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { images } from "../../constants/images";
import VerificationModal from "../../components/VerificationModal";

export default function SignUp() {
  const router = useRouter();
  
  // State for form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  
  // Modal visibility state
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleSignUp = () => {
    if (!email) return; // Keep simple: only trigger if email is provided
    setIsModalVisible(true);
  };

  const handleVerificationSuccess = () => {
    setIsModalVisible(false);
    // Automatically navigate to the home route (/) when code verification is complete
    router.replace("/");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        {/* Header Back Button */}
        <View className="px-6 pt-2 flex-row items-center justify-between">
          <TouchableOpacity 
            onPress={() => router.back()} 
            className="p-2 -ml-2 bg-surface rounded-full"
            activeOpacity={0.8}
          >
            <Ionicons name="chevron-back" size={24} color="#0D132B" />
          </TouchableOpacity>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Mascot Illustration */}
          <View className="items-center mt-2 mb-4">
            <Image 
              source={images.mascotAuth} 
              style={{ width: 120, height: 120 }} 
              contentFit="contain"
            />
          </View>

          {/* Heading */}
          <View className="px-6 mb-6">
            <Text className="text-h1 font-poppins-bold text-text-primary text-center leading-tight">
              Create your profile
            </Text>
            <Text className="text-body-medium font-poppins text-text-secondary text-center mt-1">
              Start your language journey today ✨
            </Text>
          </View>

          {/* Inputs Section */}
          <View className="px-6 gap-4">
            {/* Email Input */}
            <View className="bg-surface border border-border rounded-2xl px-4 py-2.5">
              <Text className="text-caption font-poppins-medium text-text-secondary">Email</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter your email"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
              />
            </View>

            {/* Password Input */}
            <View className="bg-surface border border-border rounded-2xl px-4 py-2.5 flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-caption font-poppins-medium text-text-secondary">Password</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Create a password"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!isPasswordVisible}
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={password}
                  onChangeText={setPassword}
                />
              </View>
              <TouchableOpacity 
                onPress={() => setIsPasswordVisible(!isPasswordVisible)} 
                className="p-1"
                activeOpacity={0.7}
              >
                <Ionicons name={isPasswordVisible ? "eye-off" : "eye"} size={22} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Main Action Button */}
            <TouchableOpacity
              onPress={handleSignUp}
              activeOpacity={0.9}
              className={`bg-primary border-b-4 border-primary-deep rounded-2xl h-14 justify-center items-center mt-4 shadow-sm ${
                !email ? "opacity-60" : ""
              }`}
              disabled={!email}
            >
              <Text className="text-white font-poppins-bold text-body-large">
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View className="flex-row items-center my-6 px-6">
            <View className="flex-1 h-[1px] bg-border" />
            <Text className="mx-4 text-body-small font-poppins-medium text-text-secondary">
              or continue with
            </Text>
            <View className="flex-1 h-[1px] bg-border" />
          </View>

          {/* Social Auth Buttons */}
          <View className="px-6 gap-3">
            {/* Google */}
            <TouchableOpacity
              activeOpacity={0.85}
              className="flex-row items-center justify-center bg-white border border-border rounded-2xl h-14 px-4 shadow-sm relative"
            >
              <Ionicons name="logo-google" size={20} color="#EA4335" style={styles.socialIcon} />
              <Text className="text-text-primary font-poppins-bold text-body-medium">
                Continue with Google
              </Text>
            </TouchableOpacity>

            {/* Facebook */}
            <TouchableOpacity
              activeOpacity={0.85}
              className="flex-row items-center justify-center bg-white border border-border rounded-2xl h-14 px-4 shadow-sm relative"
            >
              <Ionicons name="logo-facebook" size={20} color="#1877F2" style={styles.socialIcon} />
              <Text className="text-text-primary font-poppins-bold text-body-medium">
                Continue with Facebook
              </Text>
            </TouchableOpacity>

            {/* Apple */}
            <TouchableOpacity
              activeOpacity={0.85}
              className="flex-row items-center justify-center bg-white border border-border rounded-2xl h-14 px-4 shadow-sm relative"
            >
              <Ionicons name="logo-apple" size={20} color="#000000" style={styles.socialIcon} />
              <Text className="text-text-primary font-poppins-bold text-body-medium">
                Continue with Apple
              </Text>
            </TouchableOpacity>
          </View>

          {/* Toggle Screen Option */}
          <View className="flex-row items-center justify-center mt-8 pb-8">
            <Text className="text-body-medium font-poppins text-text-secondary">
              Already have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/sign-in")} activeOpacity={0.7}>
              <Text className="text-body-medium font-poppins-bold text-primary">
                Log in
              </Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>

      {/* Verification Modal Component */}
      <VerificationModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSuccess={handleVerificationSuccess}
        emailAddress={email}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  textInput: {
    fontFamily: "Poppins_600SemiBold",
    color: "#0D132B",
    fontSize: 15,
    padding: 0,
    marginTop: 2,
  },
  socialIcon: {
    position: "absolute",
    left: 20,
  }
});
