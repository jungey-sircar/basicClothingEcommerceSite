import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { MdDeleteForever } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { Link } from "react-router";
import Swal from "sweetalert2";
import { useState } from "react";

export default function AllOrders() {
    const { currentUser } = useAuth();
    const [updatingId, setUpdatingId] = useState(null);
    const axiosSecure = useAxiosSecure();
    // data fetch using tanstack query
    const { data: orders = [], refetch } = useQuery({
        queryKey: ['orders', currentUser.email],
        queryFn: async () => {
            const response = await axiosSecure.get('/api/admin/orders?limit=12');
            return response.data.orders;
        }
    });
    console.log(orders);
    return (
        <section className="p-4">
            <title>All Orders | Dashboard</title>
            <h2 className="text-2xl md:text-3xl my-4 text-center">All Orders</h2>
            <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
                <table className="table">
                    {/* head */}
                    <thead>
                        <tr>
                            <th>Sl</th>
                            <th>Order ID</th>
                            <th>User</th>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            orders.map((order, index) => <tr key={order._id}>
                                <th>{index + 1}</th>
                                <td>{order._id}</td>
                                <td>{order.buyer}</td>
                                <td>{order.product}</td>
                                <td>{order.quantity}</td>
                                <td>{order.status}</td>
                                <td>
                                    <Link to={`/dashboard/all-orders/${order._id}`} className="btn btn-neutral btn-outline mr-4">
                                        <FaEdit className="text-xl md:text-2xl" />
                                    </Link>
                                </td>
                            </tr>)
                        }
                    </tbody>
                </table>
            </div>
        </section>
    );
}