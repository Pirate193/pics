import useAuthStore from "@/store/authStore";
import { Stack } from "expo-router";
export default function AuthLayout() {
  // Use the auth store to check if the user is authenticated
  const { isAuthenticated } = useAuthStore();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="verifyemail" />
      <Stack.Screen name="resetpassword" />
    </Stack>
  );
}