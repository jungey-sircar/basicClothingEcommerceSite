import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useState, useRef } from "react";
import toast from "react-hot-toast";

export default function ApprovedOrders() {
    const { currentUser } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [selectedOrder, setSelectedOrder] = useState(null);
    const addTrackingModalRef = useRef(null);
    const viewTrackingModalRef = useRef(null);
    // Fetch approved orders
    const { data: orders = [], isLoading, refetch } = useQuery({
        queryKey: ['approvedOrders', currentUser.email],
        queryFn: async () => {
            const res = await axiosSecure.get('/api/orders?status=approved');
            return res.data.orders;
        }
    });
    const openAddTrackingModal = (order) => {
        setSelectedOrder(order);
        addTrackingModalRef.current?.showModal();
    };
    const openViewTrackingModal = (order) => {
        setSelectedOrder(order);
        viewTrackingModalRef.current?.showModal();
    };
    const closeModal = () => {
        setSelectedOrder(null);
        addTrackingModalRef.current?.close();
        viewTrackingModalRef.current?.close();
    };
    const handleAddTracking = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const trackingData = {
            location: formData.get('location'),
            note: formData.get('note'),
            datetime: formData.get('datetime'),
            status: formData.get('status')
        };

        try {
            await axiosSecure.post(`/api/orders/${selectedOrder._id}/tracking`, trackingData);
            toast.success('Tracking info added!', { duration: 2000 });
            refetch();
            closeModal();
        } catch (err) {
            console.error(err);
            toast.error('Failed to add tracking info');
        }
    };
    if (isLoading) return <div className="p-4 text-center">Loading...</div>;
    return (
        <section className="p-4">
            <h2 className="text-2xl md:text-3xl my-4 text-center">Approved Orders ({orders.length})</h2>
            <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Sl</th>
                            <th>Order ID</th>
                            <th>User</th>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Approved Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order, index) => (
                            <tr key={order._id}>
                                <th>{index + 1}</th>
                                <td>{order._id}</td>
                                <td>{order.userName}</td>
                                <td>{order.productName}</td>
                                <td>{order.quantity}</td>
                                <td>{new Date(order.approvedAt).toLocaleString()}</td>
                                <td className="flex gap-2">
                                    <button
                                        className="btn btn-primary btn-outline btn-sm"
                                        onClick={() => openAddTrackingModal(order)}
                                    >
                                        Add Tracking
                                    </button>
                                    <button
                                        className="btn btn-info btn-outline btn-sm"
                                        onClick={() => openViewTrackingModal(order)}
                                    >
                                        View Tracking
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Tracking Modal */}
            <dialog ref={addTrackingModalRef} className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    <h3 className="font-bold text-lg mb-4">Add Tracking Info</h3>
                    {selectedOrder && (
                        <form onSubmit={handleAddTracking}>
                            <input type="text" name="location" placeholder="Location" className="input input-bordered w-full mb-2" required />
                            <input type="datetime-local" name="datetime" className="input input-bordered w-full mb-2" required />
                            <select name="status" className="select select-bordered w-full mb-2" required>
                                <option value="Cutting Completed">Cutting Completed</option>
                                <option value="Sewing Started">Sewing Started</option>
                                <option value="Finishing">Finishing</option>
                                <option value="QC Checked">QC Checked</option>
                                <option value="Packed">Packed</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Out for Delivery">Out for Delivery</option>
                            </select>
                            <textarea name="note" placeholder="Note" className="textarea textarea-bordered w-full mb-4"></textarea>
                            <div className="modal-action">
                                <button type="submit" className="btn btn-primary btn-outline">Add</button>
                                <button type="button" className="btn btn-secondary btn-outline" onClick={closeModal}>Cancel</button>
                            </div>
                        </form>
                    )}
                </div>
            </dialog>

            {/* View Tracking Modal */}
            <dialog ref={viewTrackingModalRef} className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    <h3 className="font-bold text-lg mb-4">Tracking Timeline</h3>
                    {selectedOrder && selectedOrder.tracking?.length ? (
                        <ul className="steps steps-vertical">
                            {selectedOrder.tracking.map((track, idx) => (
                                <li key={idx} className="step step-primary">
                                    <div>
                                        <p><strong>{track.status}</strong> - {track.location}</p>
                                        <p>{new Date(track.datetime).toLocaleString()}</p>
                                        <p>{track.note}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No tracking info yet.</p>
                    )}
                    <div className="modal-action">
                        <button className="btn btn-secondary btn-outline" onClick={closeModal}>Close</button>
                    </div>
                </div>
            </dialog>
        </section>
    );
}