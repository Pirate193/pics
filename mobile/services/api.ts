import axios from "axios";
import * as SecureStore from "expo-secure-store";

const API_BASE_URL ='http://192.168.100.89:3000/api';
     

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
            const token = await SecureStore.getItemAsync('auth_token');
            if (token){
                config.headers.Authorization =`Bearer ${token}`;
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
