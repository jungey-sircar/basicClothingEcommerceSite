import { useQuery } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Loading from "../../components/utils/Loading";
import { BarChart, LineChart, Bar, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function AdminDashboard() {
    const { currentUser } = useAuth();
    const axiosSecure = useAxiosSecure();
    // data fetch using tanstack query
    const { data = [], isLoading } = useQuery({
        queryKey: ['stats', currentUser.email],
        queryFn: async () => {
            const response = await axiosSecure.get('/api/admin/dashboard-stats');
            return response.data;
        }
    });
    console.log(data);
    const userData = [
        { role: "Admin", count: data.users?.admin || 0 },
        { role: "Manager", count: data.users?.manager || 0 },
        { role: "Buyer", count: data.users?.buyer || 0 },
    ];
    const ordersData = [
        { name: "Total Orders", count: data?.orders || 0 }
    ];
    const productData = [
        {
            name: "Total Products", count: data?.products || 0,
        },
    ];
    if (isLoading) return <section className="min-h-screen w-full flex justify-center items-center"><Loading /></section>
    return (
        <section className="max-w-7xl p-6 md:p-10">
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                <section className="flex flex-col">
                    <h1 className="text-2xl lg:text-4xl font-bold mb-4 grow">Users Stats</h1>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={userData}>
                            <XAxis dataKey="role" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" />
                        </BarChart>
                    </ResponsiveContainer>
                </section>
                <section className="flex flex-col">
                    <h1 className="text-2xl lg:text-4xl font-bold mb-4 grow"> Product Stats</h1>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={productData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Bar
                                dataKey="count"
                                radius={[6, 6, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </section>
                <section className="flex flex-col">
                    <h1 className="text-2xl lg:text-4xl font-bold mb-4 grow">Orders Stats </h1>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={ordersData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="count"
                                strokeWidth={3}
                                dot={{ r: 5 }}
                                activeDot={{ r: 7 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </section>
            </div>
        </section>
    );
}