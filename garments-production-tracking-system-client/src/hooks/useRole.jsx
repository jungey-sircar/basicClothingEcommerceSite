import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

export default function useRole(){
    const axiosSecure = useAxiosSecure();
    const { currentUser, loading } = useAuth();
    const { data: role = 'buyer', isLoading } = useQuery({
        queryKey: ['user-role', currentUser?.email],
        enabled: !!currentUser?.email && !loading,
        queryFn: async () => {
            const response = await axiosSecure.get(`/api/users/role?email=${currentUser?.email}`);
            return response.data.role;
        }
    });
    return { role, isLoading: isLoading || loading};
}