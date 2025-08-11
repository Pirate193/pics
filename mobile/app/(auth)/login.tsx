import { StyleSheet, Text, View,Image, StatusBar, TextInput, TouchableOpacity ,} from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import useAuthStore from '@/store/authStore';
import { Link, router } from 'expo-router';

const Login = () => {
    const [email,setEmail] = useState('');
    const [password,setPassword]= useState('');
    const login = useAuthStore((state)=>state.login);
    const isLoading = useAuthStore((state)=> state.isLoading);
    const error = useAuthStore((state)=>state.error);

    const handleLogin = async ()=>{
      try{
           await login(email,password);
           router.replace('/(tabs)')
      }catch(err){
        console.log("error",err);
      }
    }

  return (
    <SafeAreaView className='flex-1 bg-background  ' >
        <StatusBar barStyle='light-content' />
        
        <View className='items-center mt-8'>
          <Text className='text-3xl text-center mt-4 text-text font-bold' > Get a life you want </Text>
        </View>
        

        <View className='px-8 mt-16' >
          <TextInput
         placeholder='email address'
         placeholderTextColor='#9ca3af'
         value={email}
         onChangeText={setEmail}
         keyboardType='email-address'
         className='border border-secondary rounded-xl p-4 text-text '
        />
        
        <TextInput
         placeholder='password'
         placeholderTextColor='#9ca3af'
         value={password}
         onChangeText={setPassword}
         secureTextEntry
         className='border border-secondary rounded-xl p-4 mt-5 text-text'
        />
        {/* forgot button  */}
        <Link href='/(auth)/forgotpassword' >
         <Text className='text-primary text-sm underline cursor-pointer ' >
          Forgot password
        </Text>
        </Link>

        { error && (
            <Text className='text-red-50 mb-4 text-center' >{error} </Text>
        )}
       
        {/* {sign in button } */}
        <TouchableOpacity className='bg-primary text-white p-4 rounded-lg mt-4 h-14 w-full' onPress={handleLogin} disabled={isLoading} >
          <Text className='text-text text-center text-lg' > Sign In</Text>
        </TouchableOpacity>
              {/* sugn in with google  */}
        <View className='flex-row items-center justify-center mt-8'>
          {/* <Image source={{uri:'https://via.placeholder.com/20'}} /> */}
          <Text className='text-text ml-2' >Sign in with Google</Text>
        </View>
        </View>
        {/* register */}
        <Text className='text-text text-center mt-8' > dont have an  account? {''}
          
          <Link href='/(auth)/register' >
          <Text className='text-primary underline cursor-pointer' > Register</Text>
          </Link>
        </Text>
        

    </SafeAreaView>
  )
}

export default Login

const styles = StyleSheet.create({})