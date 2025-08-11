import axios from "axios";
import * as SecureStore from "expo-secure-store";

const API_BASE_URL = __DEV__
     ?'http://192.168.100.88:3000/api'
     :'https://localhost8081:3000/api'; 

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});


api.interceptors.request.use(
    async (config) =>{
        try{
            const stored = await SecureStore.getItemAsync('auth_token');
            if (stored){
                const {token} = JSON.parse(stored);
                if (token){
                    config.headers.Authorization =`Bearer ${token}`;
                }
            }
        }catch (error) { 
            console.error('Error retrieving token from SecureStore:', error);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

//
api.interceptors.response.use(
    response => response,
    async (error)=>{
        if (error.response?.status === 401){
            await SecureStore.deleteItemAsync('auth_token');

        }
        return Promise.reject(error);
    }
);

export default api;