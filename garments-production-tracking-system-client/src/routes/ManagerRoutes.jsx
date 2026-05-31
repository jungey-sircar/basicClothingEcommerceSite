import Loading from "../components/utils/Loading";
import useRole from "../hooks/useRole";
import ForbiddenAccess from "../pages/auth/ForbiddenAccess";

export default function ManagerRoute({children}){
    const { role, isLoading } = useRole();
    if(isLoading){
        return <Loading />;
    }
    if(role !== 'manager'){
        return <ForbiddenAccess />
    }
    return children;
}