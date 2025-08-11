import { Alert, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link, router } from 'expo-router'
import useAuthStore from '@/store/authStore'

const Register = () => {
  const [username,setUsername]=useState('');
  const[email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [confirmpassword,setConfirmPassword]=useState('');
  const register = useAuthStore(state=>state.register);
  const isLoading = useAuthStore(state=>state.isLoading);
  const error=useAuthStore(state=>state.error);

  const handleRegister=async()=>{
    try{
      await register(username,email,password);
      Alert.alert('verify your email','we have sent a verification link to your email address ',[{text:'OK',onPress:()=>router.replace('/(auth)/verifyemail')}])
    }catch(err){
      console.log('error occured ', err);
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
             placeholder='username'
             placeholderTextColor='#9ca3af'
             value={username}
             onChangeText={setUsername}
             
             className='border border-secondary rounded-xl p-4 text-text '
            />
              <TextInput
             placeholder='email address'
             placeholderTextColor='#9ca3af'
             value={email}
             onChangeText={setEmail}
             keyboardType='email-address'
             className='border border-secondary rounded-xl p-4 text-text mt-6 '
            />
            
            <TextInput
             placeholder='password'
             placeholderTextColor='#9ca3af'
             value={password}
             onChangeText={setPassword}
             secureTextEntry
             className='border border-secondary rounded-xl p-4 mt-5 text-text'
            />

            <TextInput
             placeholder='password'
             placeholderTextColor='#9ca3af'
             value={confirmpassword}
             onChangeText={setConfirmPassword}
             secureTextEntry
             className='border border-secondary rounded-xl p-4 mt-5 text-text'
            />
          
    
            { error && (
                <Text className='text-red-50 mb-4 text-center' >{error} </Text>
            )}
           
            {/* {sign in button } */}
            <TouchableOpacity className='bg-primary text-white p-4 rounded-lg mt-4 h-14 w-full' onPress={handleRegister} disabled={isLoading} >
              <Text className='text-text text-center text-lg' > Sign Up</Text>
            </TouchableOpacity>
                  {/* sugn in with google  */}
            <View className='flex-row items-center justify-center mt-8'>
              {/* <Image source={{uri:'https://via.placeholder.com/20'}} /> */}
              <Text className='text-text ml-2' >Sign Up with Google</Text>
            </View>
            </View>
            {/* register */}
            <Text className='text-text text-center mt-8' > you have an  account? {''}
              
              <Link href='/(auth)/login' >
              <Text className='text-primary underline cursor-pointer' > Login</Text>
              </Link>
            </Text>
            
    
        </SafeAreaView>
  )
}

export default Register

const styles = StyleSheet.create({})