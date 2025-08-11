import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { use, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router, useLocalSearchParams } from 'expo-router'
import useAuthStore from '@/store/authStore'

const Verifyemail = () => {
  const {token}= useLocalSearchParams<{token:string}>();
  const Verifyemail = useAuthStore(state=>state.verifyEmail);
  const isLoading = useAuthStore(state=>state.isLoading);
  const error = useAuthStore(state=>state.error);
  const clearError = useAuthStore(state=>state.clearError);


  useEffect(()=>{
    if(token){
      Verifyemail(token)
         .then(()=>{
          setTimeout(()=>router.replace('/(tabs)'),2000);
         })
         .catch(()=>{
          //we dont need to dothis because our store aleardy handled the error
         });
    }
  },[token])
  return (
    <SafeAreaView className='bg-background flex-1 justify-center items-center ' >
          {isLoading? (
            <View className='p-5 justify-center items-center m-4 ' >
              <ActivityIndicator size='large' color='#e60024' />
              <Text className='text-text text-center ' > Verifying your email</Text>
            </View>
          ): error ?(
            <View className='p-5 justify-center items-center m-4' >
              <Text className='text-primary text-center text-lg' >{error} </Text>
              <TouchableOpacity onPress={clearError} className='p-4 rounded-lg bg-primary h-14 w-full ' >
                <Text className='text-text text-center text-lg' > Dismiss</Text>
              </TouchableOpacity>
            </View>
          ):(
            <View className='p-4 m-4 items-center justify-center ' >
              <Text className='text-text text-center text-base' >Email veried Succesfully</Text>
              <Text className='text-text text-center text-base' > Redirecting to home screen.....</Text>
            </View>
          )

          }
    </SafeAreaView>
  )
}

export default Verifyemail

const styles = StyleSheet.create({})