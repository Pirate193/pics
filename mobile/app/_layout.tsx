import { router, Stack } from "expo-router";
import '../global.css'; // Import global styles
import useAuthStore from "@/store/authStore";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import * as Linking from 'expo-linking';

export default function RootLayout() {
  const initializeAuth = useAuthStore((state)=>state.initializeAuth);
  const isloading = useAuthStore((state)=>state.isLoading);
  useEffect(()=>{
    initializeAuth();
    
    // const handleDeeplink =({url})=>{
    //   const {path,queryParams} = Linking.parse(url);
      
    //   if( path ==='verifyemail' && queryParams?.token ){
    //     router.push(`/(auth)/verifyemail?token=${queryParams.token}`);
    //   }else if (path === 'reset-password' && queryParams?.token ){
    //     router.push(`/(auth)/resetpassword?token=${queryParams.token}`);
    //   }
    // };
    // Linking.addEventListener('url',handleDeeplink);
    // Linking.getInitialURL().then(url=>{
    //   if (url) handleDeeplink({url});
    // });
    // return()=>{
    //   Linking.removeEventListener('url',handleDeeplink)
    // };
  },[])
  
  if(isloading){
    return (
      <View className='items-center justify-center' > 
         <ActivityIndicator size='large' color='#e60024' />
      </View>
     
    )
  }
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
