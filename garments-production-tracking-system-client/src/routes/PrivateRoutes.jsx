import { Navigate, useLocation } from "react-router";
import Loading from "../components/utils/Loading";
import useAuth from "../hooks/useAuth";

export default function PrivateRoute({children}){
    const { currentUser, loading } = useAuth();
    const location = useLocation();
    if(loading){
        return <section className="min-h-screen w-full flex justify-center items-center"><Loading /></section>;
    }
    if(!currentUser){
        return <Navigate to='/auth/login' state={location.pathname} />
    }
    return children;
}