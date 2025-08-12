import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import useAuthStore from '@/store/authStore';
import * as Linking from 'expo-linking';

const Verifyemail = () => {
  const [verificationStatus, setVerificationStatus] = useState<string | null>(null);
  const Verifyemail = useAuthStore(state => state.verifyEmail);
  const isLoading = useAuthStore(state => state.isLoading);
  const error = useAuthStore(state => state.error);
  const clearError = useAuthStore(state => state.clearError);

  const handleVerification = useCallback(async (url: string) => {
    try {
      const { success, token } = Linking.parse(url).queryParams as { success: string; token: string };
      if (success === 'true' && token) {
        await Verifyemail(token);
        setVerificationStatus('success');
        setTimeout(() => router.replace('/(tabs)'), 2000);
      } else {
        setVerificationStatus('error');
      }
    } catch (e) {
      console.error('Linking error:', e);
      setVerificationStatus('error');
    }
  }, [Verifyemail]);

  useEffect(() => {
    const handleLinking = async () => {
      const url = await Linking.getInitialURL();
      if (url) {
        handleVerification(url);
      }
    };

    Linking.addEventListener('url', (event) => {
      handleVerification(event.url);
    });

    handleLinking();

    return () => {
      Linking.removeEventListener('url', (event) => {
        handleVerification(event.url);
      });
    };
  }, [handleVerification]);

  useEffect(() => {
    if (error) {
      setVerificationStatus('error');
    }
  }, [error]);

  return (
    <SafeAreaView className="bg-background flex-1 justify-center items-center">
      {isLoading ? (
        <View className="p-5 justify-center items-center m-4">
          <ActivityIndicator size="large" color="#e60024" />
          <Text className="text-text text-center">Verifying your email</Text>
        </View>
      ) : verificationStatus === 'error' ? (
        <View className="p-5 justify-center items-center m-4">
          <Text className="text-primary text-center text-lg">{error || 'Verification failed'}</Text>
          <TouchableOpacity onPress={clearError} className="p-4 rounded-lg bg-primary h-14 w-full">
            <Text className="text-text text-center text-lg">Dismiss</Text>
          </TouchableOpacity>
        </View>
      ) : verificationStatus === 'success' ? (
        <View className="p-4 m-4 items-center justify-center">
          <Text className="text-text text-center text-base">Email verified Successfully</Text>
          <Text className="text-text text-center text-base">Redirecting to home screen.....</Text>
        </View>
      ) : (
        <View className="p-5 justify-center items-center m-4">
          <Text className="text-text text-center">Awaiting verification...</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Verifyemail;

const styles = StyleSheet.create({});