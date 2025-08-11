import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import useAuthStore from "@/store/authStore";
import { Link, router } from "expo-router";

const Forgotpassword = () => {
  const [email, setEmail] = useState("");
  const forgetpassword = useAuthStore((state) => state.forgotPassword);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);

  const handleSubmit = async () => {
    try {
      await forgetpassword(email);
      Alert.alert(
        "Check your Email ",
        "we sent a password rest link to your email address",
        [{ text: "OK", onPress: () => router.push("/(auth)/login") }]
      );
    } catch (err) {
      console.log("error occured ", err);
    }
  };

  return (
    <SafeAreaView className="bg-background flex-1">
      <View className="mt-4 justify-center items-center">
        <Text
          className="text-text text-center text-2xl font-bold
            "
        >
          {" "}
          Forgot password
        </Text>
      </View>
      <View className="m-4 justify-center">
        <Text className="text-text text-center text-base">
          Enter Your Email to reset Your Password{" "}
        </Text>
        <TextInput
          placeholder="email address"
          placeholderTextColor="#9ca3af"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          className="border border-secondary rounded-xl p-4 text-text mt-2 "
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
          <Text className="text-text text-center text-lg">
            {" "}
            Send Reset Link
          </Text>
        </TouchableOpacity>

        <Link href="/(auth)/login" className="mt-4">
          <Text className="text-primary underline cursor-pointer">
            {" "}
            Back to Login
          </Text>
        </Link>
      </View>
      <Link href="/(auth)/resetpassword" className="text-text">
        reset password
      </Link>
    </SafeAreaView>
  );
};

export default Forgotpassword;

const styles = StyleSheet.create({});
