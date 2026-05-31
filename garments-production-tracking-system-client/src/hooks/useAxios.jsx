import axios from "axios";

// axios instance
const axiosDefault = axios.create({
    baseURL: import.meta.env.VITE_BACKEND
});

export default function useAxios(){
    return axiosDefault;
}