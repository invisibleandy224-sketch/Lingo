import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { images } from "../../constants/images";
import VerificationModal from "../../components/VerificationModal";
import { useSignIn, useSSO, useAuth } from "@clerk/expo";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

export default function SignIn() {
  const router = useRouter();
  const { signIn, errors, fetchStatus } = useSignIn();
  const { startSSOFlow } = useSSO();
  const { isSignedIn } = useAuth();
  
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  React.useEffect(() => {
    if (isSignedIn) {
      router.replace("/");
    }
  }, [isSignedIn]);

  const handleSignIn = async () => {
    if (!email) return;
    
    setIsLoading(true);
    try {
      const { error: createError } = await signIn.create({
        identifier: email,
      });
      if (createError) {
        const msg = createError.longMessage || createError.message || "Failed to initiate sign-in.";
        alert(msg);
        return;
      }

      const { error: sendError } = await signIn.emailCode.sendCode();
      if (sendError) {
        const msg = sendError.longMessage || sendError.message || "Failed to send verification code.";
        alert(msg);
        return;
      }

      setIsModalVisible(true);
    } catch (err: any) {
      const msg = err?.longMessage || err?.message || "Something went wrong. Please try again.";
      alert(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (code: string) => {
    const { error: verifyError } = await signIn.emailCode.verifyCode({ code });
    if (verifyError) {
      throw verifyError;
    }

    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            console.log(session?.currentTask);
            return;
          }
          const url = decorateUrl("/");
          router.replace(url as "/");
        },
      });
    } else {
      throw new Error(`Sign-in status: ${signIn.status}`);
    }
  };

  const handleVerificationSuccess = () => {
    setIsModalVisible(false);
    router.replace("/");
  };

  const handleResendCode = async () => {
    const { error } = await signIn.emailCode.sendCode();
    if (error) {
      const msg = error.longMessage || error.message || "Failed to resend code.";
      alert(msg);
    }
  };

  const handleSocialSignIn = async (strategy: "oauth_google" | "oauth_facebook" | "oauth_apple") => {
    try {
      const { createdSessionId, setActive: setSessionActive } = await startSSOFlow({
        strategy,
        redirectUrl: "duolingoclone://oauth-callback",
      });
      
      if (createdSessionId && setSessionActive) {
        await setSessionActive({ session: createdSessionId });
        router.replace("/");
      }
    } catch (err: any) {
      console.error(err);
      const errorMsg = err.errors?.[0]?.message || err.message || "Failed to sign in with social provider.";
      alert(errorMsg);
    }
  };

  const fieldError = (field: keyof typeof errors.fields) => {
    const err = errors.fields[field];
    return err?.message || null;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
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
          <View className="items-center mt-2 mb-4">
            <Image 
              source={images.mascotAuth} 
              style={{ width: 120, height: 120 }} 
              contentFit="contain"
            />
          </View>

          <View className="px-6 mb-6">
            <Text className="text-h1 font-poppins-bold text-text-primary text-center leading-tight">
              Welcome back
            </Text>
            <Text className="text-body-medium font-poppins text-text-secondary text-center mt-1">
              Sign in to your account to continue ⚡️
            </Text>
          </View>

          <View className="px-6 gap-4">
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
                editable={!isLoading}
              />
            </View>
            {fieldError("identifier") && (
              <Text className="text-red-500 font-poppins text-caption -mt-2">
                {fieldError("identifier")}
              </Text>
            )}

            <TouchableOpacity
              onPress={handleSignIn}
              activeOpacity={0.9}
              className={`bg-primary border-b-4 border-primary-deep rounded-2xl h-14 justify-center items-center mt-4 shadow-sm ${
                !email || isLoading || fetchStatus === "fetching" ? "opacity-60" : ""
              }`}
              disabled={!email || isLoading || fetchStatus === "fetching"}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text className="text-white font-poppins-bold text-body-large">
                  Sign In
                </Text>
              )}
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center my-6 px-6">
            <View className="flex-1 h-[1px] bg-border" />
            <Text className="mx-4 text-body-small font-poppins-medium text-text-secondary">
              or continue with
            </Text>
            <View className="flex-1 h-[1px] bg-border" />
          </View>

          <View className="px-6 gap-3">
            <TouchableOpacity
              activeOpacity={0.85}
              className="flex-row items-center justify-center bg-white border border-border rounded-2xl h-14 px-4 shadow-sm relative"
              onPress={() => handleSocialSignIn("oauth_google")}
            >
              <Ionicons name="logo-google" size={20} color="#EA4335" style={styles.socialIcon} />
              <Text className="text-text-primary font-poppins-bold text-body-medium">
                Continue with Google
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              className="flex-row items-center justify-center bg-white border border-border rounded-2xl h-14 px-4 shadow-sm relative"
              onPress={() => handleSocialSignIn("oauth_facebook")}
            >
              <Ionicons name="logo-facebook" size={20} color="#1877F2" style={styles.socialIcon} />
              <Text className="text-text-primary font-poppins-bold text-body-medium">
                Continue with Facebook
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              className="flex-row items-center justify-center bg-white border border-border rounded-2xl h-14 px-4 shadow-sm relative"
              onPress={() => handleSocialSignIn("oauth_apple")}
            >
              <Ionicons name="logo-apple" size={20} color="#000000" style={styles.socialIcon} />
              <Text className="text-text-primary font-poppins-bold text-body-medium">
                Continue with Apple
              </Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center justify-center mt-8 pb-8">
            <Text className="text-body-medium font-poppins text-text-secondary">
              {"Don't have an account? "}
            </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/sign-up")} activeOpacity={0.7}>
              <Text className="text-body-medium font-poppins-bold text-primary">
                Sign up
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <VerificationModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSuccess={handleVerificationSuccess}
        emailAddress={email}
        onVerifyCode={handleVerifyCode}
        onResendCode={handleResendCode}
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
