import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';
import api from '@/services/api';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

//lets now define the types for our auth state
interface AuthState {
    token: string | null;
    user: {id: string;
          username: string;
          email: string;
          isVerified: boolean
        
     } | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    register: (username: string, email: string, password: string) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    verifyEmail:(token: string) => Promise<void>;
    forgotPassword: (email: string) => Promise<void>;
    resetPassword: (token: string, newPassword: string) => Promise<void>;
    initializeAuth: () => Promise<void>;
    clearError: () => void;
}
// storage using SecureStore
const secureStorage = {
    getItem: async (name: string): Promise<string | null> => {
        try{
            return await SecureStore.getItemAsync(name);

        }catch (error){
            console.error('Error retrieving item from SecureStore:', error);
            return null;
        }
    },
    setItem: async (name:string,value: string): Promise<void>=>{
        try{
            await SecureStore.setItemAsync(name, value);
        }catch (error){
            console.error('Error setting item in SecureStore:', error);
        }
    },
    removeItem: async(name:string):Promise<void> =>{
        try{
            await SecureStore.deleteItemAsync(name);
        }catch(error){
            console.error('Error removing item from SecureStore:', error);
        }
    },
};

//create the auth store using zustand
const useAuthStore = create<AuthState>()(
    persist(
        (set,get)=>({
             token: null,
             user: null,
             isAuthenticated: false,
             isLoading: true, //start with loading state
             error: null,

             //register new user 
             register: async (username, email, password) => {
                set({isLoading: true, error: null});
                try {
                    const response = await api.post('/auth/register',{
                        username,
                        email,
                        password
                    })
                    //store the token in SecureStore
                    await secureStorage.setItem('auth_token',response.data.token);
                    set({
                        token: response.data.token,
                        user: response.data.user,
                        isAuthenticated: true,
                        isLoading: false,
                    });
                }catch(error:any){
                    const message = error.response?.data?.error || 'Registration failed';
                    set({
                        error: message,
                        isLoading: false,
                    });
                    throw new Error(message);
                }
             },
             // login user 

            login: async (email, password) => {
                set({isLoading:true, error: null});
                try{
                    const response = await api.post('/auth/login',{
                        email,
                        password
                    });
                    //store the token in SecureStore
                    await secureStorage.setItem('auth_token', response.data.token);
                    set({
                        token: response.data.token,
                        user: response.data.user,
                        isAuthenticated: true,
                        isLoading: false,
                    });
                }catch(error:any){
                    const message = error.response?.data?.error || 'Login failed';
                    set({
                        error: message,
                        isLoading: false,
                    });
                    throw new Error(message);
                }
            },
            // logout user now
            logout: async ()=>{
                await secureStorage.removeItem('auth_token');
                set({
                    token: null,
                    user: null,
                    isAuthenticated: false,
                    error: null,
                });
            },
            //verify email
            verifyEmail: async(token)=>{
                set({ isLoading:true, error:null});
                try{
                    const response = await api.get(`/auth/verify-email/${token}`);
                    set(state=>({
                        user:state.user ? {...state.user, isVerified:true}:null,
                        isLoading: false,
                    }));
                }catch(error:any){
                    const message = error.response?.data?.error || 'Email verification failed';
                    set({
                        error: message,
                        isLoading: false,
                    });
                    throw new Error(message);
                }

            },
            // forgot password 
            forgotPassword: async (email)=>{
                set({isLoading:true, error: null});
                try{
                    await api.post('/auth/forgot-password',{email});
                    set({isLoading: false});
                }catch (error:any){
                    const message = error.response?.data?.error || 'Forgot password failed';
                    set({
                        error: message,
                        isLoading: false,
                    });
                    throw new Error(message);
                }
            },
            // reset password
            resetPassword: async (token, newPassword)=>{
                set({isLoading:true, error:null});
                try{
                    const response = await api.put(`/auth/reset-password/${token}`,{
                        newPassword
                    });
                    //store the new token in SecureStore
                    await secureStorage.setItem('auth_token', response.data.token);
                    set({
                        token: response.data.token,
                        user: response.data.user,
                        isAuthenticated: true,
                        isLoading: false,
                    });
                }catch (error:any){
                    const message = error.response?.data?.error || 'Reset password failed';
                    set({
                        error: message,
                        isLoading: false,
                    });
                    throw new Error(message);
                }
            },

            //initialize the store
            initializeAuth: async () =>{
                set({isLoading:true});
                try{
                    const token = await secureStorage.getItem('auth_token');
                    if (token){
                        //set token in api headers
                        api.defaults.headers.common['Authorization']=`Bearer ${token}`;
                        //fetch user data
                        const userResponse = await api.get('/auth/me');
                        set({
                            token,
                            user: userResponse.data,
                            isAuthenticated: true,
                            isLoading: false,
                        });
                    }else {
                        set({
                            isLoading:false,
                        })
                    }
                }catch (error){
                    await secureStorage.removeItem('auth_token');
                    set({
                        token: null,
                        user: null,
                        isAuthenticated: false,
                        isLoading: false,
                });
            }
        },
            //clear error
            clearError: () => {
                set({error: null});
            },
        }),
        {
            name: 'auth-storage', // unique name for the storage
            storage: createJSONStorage(() => secureStorage), // use our custom SecureStore
            partialize: (state) => ({
                token: state.token,
        })
        }
    )
);
export default useAuthStore;