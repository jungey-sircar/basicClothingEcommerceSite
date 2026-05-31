import axios from "axios";
import { useEffect } from "react";
import useAuth from "./useAuth";
import { useNavigate } from "react-router";

// axios instance
const axiosSecure = axios.create({
    baseURL: import.meta.env.VITE_BACKEND
});

export default function useAxiosSecure() {
    const { currentUser, logoutUser } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        // request interceptor
        const reqInterceptor = axiosSecure.interceptors.request.use(async (config) => {
            if (currentUser) {
                const idToken = await currentUser.getIdToken();
                config.headers.Authorization = `Bearer ${idToken}`;
            }
            return config;
        }, (error) => {
            return Promise.reject(error);
        });

        // response interceptor
        const resInterceptor = axiosSecure.interceptors.response.use(res => {
            return res;
        }, error => {
            if(error.status === 401 || error.status === 403){
                logoutUser()
                  .then(() => {
                    navigate('/auth/login');
                  });
            }
            return Promise.reject(error);
        });

        // cleanup intereceptors
        return () => {
            axiosSecure.interceptors.request.eject(reqInterceptor);
            axiosSecure.interceptors.response.eject(resInterceptor);
        }
    }, [currentUser]);

    return axiosSecure;
}