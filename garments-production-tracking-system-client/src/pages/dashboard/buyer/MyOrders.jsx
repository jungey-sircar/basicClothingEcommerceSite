import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

export default function MyOrders() {
    const { currentUser } = useAuth();
    const axiosSecure = useAxiosSecure();
    // data fetch using tanstack query
    const { data: orders = [] } = useQuery({
        queryKey: ['orders', currentUser.email],
        queryFn: async () => {
            const response = await axiosSecure.get(`/api/orders/my`);
            return response.data.orders;
        }
    });
    return (
        <section className="p-4">
            <title>My Orders | Dashboard</title>
            <h2 className="text-2xl md:text-3xl my-4 text-center">My Orders</h2>
            <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
                <table className="table">
                    {/* head */}
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Status</th>
                            <th>Payment</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            orders.map(product => <tr key={product._id}>
                                <th>{product._id}</th>
                                <td>{product.productName}</td>
                                <td>{product.quantity}</td>
                                <td>{product.status}</td>
                                <td>{product.paymentOption}</td>
                                <td className="flex gap-3 items-center">
                                    <button type='button' className="btn btn-primary">view</button>
                                    <button type='button' className="btn btn-primary">cansel</button>
                                </td>
                            </tr>)
                        }
                    </tbody>
                </table>
            </div>
        </section>
    );
}