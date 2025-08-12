import useAuthStore from "@/store/authStore";
import { Button } from "@react-navigation/elements";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
// Import global styles

export default function Index() {
  const logout = useAuthStore(state=>state.logout);
  const handleLogout= async()=>{
    try{
      logout();
      router.replace('/(auth)/login')
    }catch(err){
      console.log(err)
    }
  }
  return (
    <View
     className="flex-1 items-center justify-center bg-white" >
      <Text  className="text-2xl font-bold text-center" >Edit app/ifuck youndex.tsx to edit this screen.</Text>
      <Pressable onPress={handleLogout} >
        <Text> logout </Text>
      </Pressable>
    </View>
  );
}
