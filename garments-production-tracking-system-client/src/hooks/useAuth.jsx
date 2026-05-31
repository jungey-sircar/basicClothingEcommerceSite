import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function useAuth(){
    const authInfo = useContext(AuthContext);
    return authInfo;
}