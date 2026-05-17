import React, { useRef, useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface VerificationModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  emailAddress: string;
}

export default function VerificationModal({ 
  visible, 
  onClose, 
  onSuccess, 
  emailAddress 
}: VerificationModalProps) {
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRef = useRef<TextInput>(null);

  // Auto-focus input when modal becomes visible
  useEffect(() => {
    if (visible) {
      setCode("");
      setIsVerifying(false);
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  const handleCodeChange = (text: string) => {
    // Only allow numeric input
    const cleaned = text.replace(/[^0-9]/g, "");
    if (cleaned.length <= 6) {
      setCode(cleaned);
      
      // Auto-submit when last digit is entered
      if (cleaned.length === 6) {
        setIsVerifying(true);
        // Simulate beautiful network request verification
        setTimeout(() => {
          setIsVerifying(false);
          onSuccess();
        }, 800);
      }
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.overlay}
      >
        {/* Modal Container */}
        <View className="bg-white w-[90%] max-w-[400px] rounded-[32px] p-6 shadow-2xl border border-border items-center relative">
          
          {/* Close Button */}
          <TouchableOpacity 
            onPress={onClose}
            className="absolute right-5 top-5 p-1 bg-surface rounded-full"
            activeOpacity={0.8}
          >
            <Ionicons name="close" size={20} color="#6B7280" />
          </TouchableOpacity>

          {/* Icon */}
          <View className="w-16 h-16 bg-[#EEF2F6] rounded-full justify-center items-center mt-2 mb-4">
            <Ionicons name="mail-open-outline" size={32} color="#6C4EF5" />
          </View>

          {/* Title */}
          <Text className="text-h3 font-poppins-bold text-text-primary text-center">
            Verify your email
          </Text>

          {/* Description */}
          <Text className="text-body-small font-poppins text-text-secondary text-center mt-2 px-3 leading-relaxed">
            {"We've sent a 6-digit verification code to"}{"\n"}
            <Text className="font-poppins-semibold text-text-primary">{emailAddress || "your email"}</Text>.
          </Text>

          {/* Input Box Row */}
          <TouchableOpacity 
            activeOpacity={1} 
            onPress={() => inputRef.current?.focus()}
            className="flex-row justify-between w-full px-2 my-6"
          >
            {Array.from({ length: 6 }).map((_, index) => {
              const digit = code[index] || "";
              const isFocused = index === code.length && visible && !isVerifying;
              const hasValue = digit !== "";

              return (
                <View
                  key={index}
                  className={`w-11 h-14 border-2 rounded-xl justify-center items-center bg-surface transition-all ${
                    isFocused 
                      ? "border-primary bg-white shadow-sm" 
                      : hasValue 
                        ? "border-text-primary bg-white" 
                        : "border-border"
                  }`}
                >
                  <Text className="text-h3 font-poppins-bold text-text-primary">
                    {digit}
                  </Text>
                  {/* Cursor blink effect for active box */}
                  {isFocused && (
                    <View className="absolute bottom-2.5 w-5 h-0.5 bg-primary animate-pulse" style={{ width: 20 }} />
                  )}
                </View>
              );
            })}
          </TouchableOpacity>

          {/* Hidden text input */}
          <TextInput
            ref={inputRef}
            value={code}
            onChangeText={handleCodeChange}
            keyboardType="number-pad"
            maxLength={6}
            style={styles.hiddenInput}
            secureTextEntry={false}
            autoComplete="one-time-code"
            editable={!isVerifying}
          />

          {/* Loading Indicator or Resend Actions */}
          {isVerifying ? (
            <View className="flex-row items-center justify-center py-2">
              <ActivityIndicator color="#6C4EF5" size="small" />
              <Text className="text-body-medium font-poppins text-primary ml-2">
                Verifying code...
              </Text>
            </View>
          ) : (
            <View className="flex-row items-center justify-center py-2">
              <Text className="text-body-small font-poppins text-text-secondary">
                {"Didn't receive the code? "}
              </Text>
              <TouchableOpacity onPress={() => setCode("")} activeOpacity={0.7}>
                <Text className="text-body-small font-poppins-semibold text-primary">
                  Resend
                </Text>
              </TouchableOpacity>
            </View>
          )}

        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(13, 19, 43, 0.45)", // Gorgeous smooth backdrop
    justifyContent: "center",
    alignItems: "center",
  },
  hiddenInput: {
    position: "absolute",
    width: 0,
    height: 0,
    opacity: 0,
  },
});
