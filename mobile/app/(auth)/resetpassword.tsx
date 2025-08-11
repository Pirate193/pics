import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { use, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import useAuthStore from "@/store/authStore";

const Resetpassword = () => {
  const { token } = useLocalSearchParams<{ token: string }>();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const resetPassword = useAuthStore((state) => state.resetPassword);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);

  const handleSubmit = async () => {
    try {
      await resetPassword(token, newPassword);
      router.replace("/(auth)/login");
    } catch (err) {
      console.log("error", err);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View>
        <Text className="text-text text-2xl font-bold mt-4">
          Set New Password
        </Text>
        <Text className="text-text text-base mt-4">
          Create a strong password for your account{" "}
        </Text>
        <TextInput
          placeholder="New Password"
          placeholderTextColor="#9ca3af"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          autoCapitalize="none"
          className="border border-secondary rounded-xl p-4 text-text mt-4 "
        />
        <TextInput
          placeholder="Confirm New Password"
          placeholderTextColor="#9ca3af"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          autoCapitalize="none"
          className="border border-secondary rounded-xl p-4 text-text mt-4 "
        />
        {error && (
          <Text className="text-primary ">
            {error}
            <TouchableOpacity onPress={clearError}>
              <Text className="text-primary underline  "> clear error</Text>
            </TouchableOpacity>
          </Text>
        )}

        <TouchableOpacity
          className="bg-primary text-white p-4 rounded-lg mt-4 h-14 w-full"
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <Text className="text-text text-center text-lg"> Reset Password</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Resetpassword;

const styles = StyleSheet.create({});
