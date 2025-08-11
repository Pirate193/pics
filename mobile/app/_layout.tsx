import { Stack } from "expo-router";
import '../global.css'; // Import global styles
import useAuthStore from "@/store/authStore";
import { useEffect } from "react";

export default function RootLayout() {
  const initializeAuth = useAuthStore((state)=>state.initializeAuth);
  const isloading = useAuthStore((state)=>state.isLoading);
  useEffect(()=>{
    initializeAuth();
  },[])
  
  
  return(
     <Stack>
      <Stack.Screen name="(auth)" options={{
        headerShown: false,
      }} />
      <Stack.Screen name="(tabs)" options={{
        headerShown: false,
      }} />
     </Stack>
  )
}
