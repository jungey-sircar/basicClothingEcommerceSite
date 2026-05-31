import Loading from "../components/utils/Loading";
import useRole from "../hooks/useRole";

export default function BuyerRoutes({ children }) {
    const { role, isLoading } = useRole();
    if (isLoading) {
        return <Loading />;
    }
    if (role !== 'buyer') {
        return <section className="p-4">
            <h2 className="text-2xl text-red-500">Only buyers can see this page</h2>
        </section>
    }
    return children;
}