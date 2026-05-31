import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useState, useRef } from "react";
import toast from "react-hot-toast";

export default function PendingOrders() {
    const { currentUser } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [selectedOrder, setSelectedOrder] = useState(null);
    const modalRef = useRef(null);

    // Fetch pending orders
    const { data: orders = [], refetch, isLoading } = useQuery({
        queryKey: ['pendingOrders', currentUser.email],
        queryFn: async () => {
            const response = await axiosSecure.get('/api/orders?status=pending');
            return response.data.orders;
        }
    });
    const openModal = (order) => {
        setSelectedOrder(order);
        modalRef.current?.showModal();
    }
    const closeModal = () => {
        setSelectedOrder(null);
        modalRef.current?.close();
    }
    const handleApprove = async (orderId) => {
        try {
            const res = await axiosSecure.patch(`/api/orders/${orderId}`, {
                status: 'approved',
                approvedAt: new Date().toISOString()
            });
            if(res.data.success){
                toast.success('Order approved!');
                refetch();
            }
        } catch (err) {
            console.error(err);
            toast.error('Failed to approve order.');
        }
    }

    const handleReject = async (orderId) => {
        try {
            const res = await axiosSecure.patch(`/api/manager/orders/${orderId}`, {
                status: 'rejected'
            });
            if(res.data.success){
                toast.success('Order rejected!');
                refetch();
            }
        } catch (err) {
            console.error(err);
            toast.error('Failed to reject order.');
        }
    }

    if(isLoading) return <p className="text-center mt-10">Loading orders...</p>;

    return (
        <section className="p-4">
            <title>Pending Orders | Dashboard</title>
            <h2 className="text-2xl md:text-3xl my-4 text-center">Pending Orders ({orders.length})</h2>
            <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>User</th>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Order Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>    
                    <tbody>
                        {orders.map(order => (
                            <tr key={order._id}>
                                <td>{order._id}</td>
                                <td>{order.userName} ({order.buyerEmail})</td>
                                <td>{order.productName}</td>
                                <td>{order.quantity}</td>
                                <td>{new Date(order.createdAt).toLocaleString()}</td>
                                <td className="flex gap-2">
                                    <button className="btn btn-primary btn-outline btn-sm" onClick={() => handleApprove(order._id)}>Approve</button>
                                    <button className="btn btn-secondary btn-outline btn-sm" onClick={() => handleReject(order._id)}>Reject</button>
                                    <button className="btn btn-info btn-outline btn-sm" onClick={() => openModal(order)}>View</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal for viewing order details */}
            <dialog ref={modalRef} className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    {selectedOrder && (
                        <>
                            <h3 className="font-bold text-lg mb-2">Order Details</h3>
                            <p><strong>Order ID:</strong> {selectedOrder._id}</p>
                            <p><strong>User:</strong> {selectedOrder.userName} ({selectedOrder.userEmail})</p>
                            <p><strong>Product:</strong> {selectedOrder.productName}</p>
                            <p><strong>Quantity:</strong> {selectedOrder.quantity}</p>
                            <p><strong>Order Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                            <p><strong>Status:</strong> {selectedOrder.status}</p>
                        </>
                    )}
                    <div className="modal-action">
                        <button className="btn" onClick={closeModal}>Close</button>
                    </div>
                </div>
            </dialog>
        </section>
    );
}