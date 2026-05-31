import { useQuery } from "@tanstack/react-query";
import UserCard from "./UserCard";
import { useMemo, useRef, useState } from "react";
import { MdClose } from "react-icons/md";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

export default function ManageUsers() {
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState(""); // empty = all roles
    const modalRef = useRef(null);
    const axiosSecure = useAxiosSecure();
    // state for suspend modal
    const [showSuspendModal, setShowSuspendModal] = useState(false);
    const [suspendReason, setSuspendReason] = useState("");
    const [suspendFeedback, setSuspendFeedback] = useState("");

    // data fetch using tanstack query
    const { data: users = [], refetch } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const response = await axiosSecure.get('/api/admin/users');
            return response.data.users;
        }
    });

    // open and close Modal
    const showModal = (user) => {
        setSelectedUser(user);
        modalRef.current?.showModal();
    }
    const closeModal = () => {
        setSelectedUser(null);  // Reset selectedUser to null when the modal closes
        modalRef.current?.close();  // Close the modal
    };

    // handle role update
    const handleRoleUpdate = (e) => {
        e.preventDefault();
        const selectedRole = e.target.role.value;
        if (selectedUser.status === 'active' && selectedUser.role === selectedRole) {
            toast.error('no changes is made', { duration: 2000, style: { padding: ' 10px 20px' } });
            return;
        }
        console.log('approve', selectedRole);
        takeAction({ role: selectedRole, status: 'active' });
    }

    const handleReject = () => {
        if (selectedUser.status === 'rejected') {
            toast.error('no changes is made', { duration: 2000, style: { padding: ' 10px 20px' } });
            return;
        }
        takeAction({ status: 'rejected' });
    }

    // udpate Roll and status
    const takeAction = (updates) => {
        axiosSecure.patch(`/api/admin/users/${selectedUser._id}`, updates)
            .then(response => {
                refetch();
                closeModal();
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Update is done",
                    showConfirmButton: false,
                    timer: 1500
                });
            })
            .catch(error => console.log(error));
    }
    // Filtered users based on search and role
    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const matchesSearch =
                user.name.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.trim().toLowerCase());
            const matchesRole = roleFilter ? user.role === roleFilter : true;
            return matchesSearch && matchesRole;
        });
    }, [users, searchTerm, roleFilter]);
    // handle suspend
    const handleSuspend = (user) => {
        closeModal(); // close main modal
        setSelectedUser(user);
        setSuspendReason("");
        setSuspendFeedback("");
        setShowSuspendModal(true);
    };
    const submitSuspend = (e) => {
        e.preventDefault();
        if (!suspendReason || !suspendFeedback) {
            toast.error("Please fill all fields", { duration: 2000 });
            return;
        }
        axiosSecure.patch(`/api/admin/users/${selectedUser._id}`, {
            status: "suspended",
            suspendReason,
            suspendFeedback
        })
            .then(() => {
                refetch();
                setShowSuspendModal(false);
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "User suspended successfully",
                    showConfirmButton: false,
                    timer: 1500
                });
            })
            .catch(err => console.error(err));
    };


    return (
        <section className="p-4">
            <title>Manage Users | Dashboard</title>
            <h2 className="text-2xl md:text-3xl mb-2">Manage Users : {filteredUsers.length}</h2>
            {/* Search & Filter */}
            <div className="flex gap-4 mb-4 justify-end">
                <input
                    type="text"
                    placeholder="Search by name or email"
                    className="input input-bordered w-full max-w-xs"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                    className="select select-bordered max-w-xs"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                >
                    <option value="">All Roles</option>
                    <option value="buyer">Buyer</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                </select>
            </div>
            <section className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
                <table className="table">
                    {/* head */}
                    <thead>
                        <tr>
                            <th></th>
                            <th>Profile</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            filteredUsers.map((user, index) => <UserCard user={user} key={user._id} serial={index} showModal={showModal} />)
                        }
                    </tbody>
                </table>
            </section>
            <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle" ref={modalRef}>
                <div className="modal-box">
                    {
                        selectedUser && <ul className="list bg-base-100 rounded-box shadow-sm mb-4">
                            <li className="list-row">
                                <div><img className="size-14 md:size-20 rounded-box" src={selectedUser.photoURL} alt={selectedUser.name} /></div>
                                <div>
                                    <div className="uppercase md:text-xl">{selectedUser.name}</div>
                                    <div className="text-xs font-semibold opacity-60">{selectedUser.email}</div>
                                    <p>Role: {selectedUser.role}</p>
                                </div>
                                <p>{selectedUser.status}</p>
                            </li>
                        </ul>
                    }
                    {
                        selectedUser && <form onSubmit={handleRoleUpdate}>
                            <h3 className="font-bold text-lg mb-2">Update the role</h3>
                            <div className="join mb-6">
                                {["buyer", "manager", "admin"].map((role) => (
                                    <input
                                        key={role}
                                        type="radio"
                                        name="role"
                                        value={role}
                                        aria-label={role}
                                        className="join-item btn"
                                        defaultChecked={selectedUser?.role === role}  // Preselect radio based on user's role
                                    />
                                ))}
                            </div>
                            <h3 className="font-bold text-lg">Confirm Update?</h3>
                            <div className="mt-2 flex gap-3">
                                <button type="submit" className="btn btn-primary btn-outline">Approve</button>
                                <button type="button" className="btn btn-secondary btn-outline" onClick={handleReject}>Reject</button>
                                <button
                                    type="button"
                                    className="btn btn-warning btn-outline"
                                    onClick={() => handleSuspend(selectedUser)}
                                    disabled={selectedUser.status === "suspended"} >
                                    Suspend
                                </button>
                            </div>
                        </form>
                    }
                    <div className="modal-action">
                        <form method="dialog">
                            <button className="btn" onClick={closeModal}><MdClose /></button>
                        </form>
                    </div>
                </div>
            </dialog>
            {/* suspend modal */}
            {showSuspendModal && selectedUser && (
                <dialog className="modal modal-bottom sm:modal-middle" open>
                    <div className="modal-box">
                        <h3 className="font-bold text-lg mb-4">Suspend {selectedUser.name}</h3>
                        <form onSubmit={submitSuspend}>
                            <label className="label">Reason</label>
                            <input
                                type="text"
                                placeholder="Reason for suspension"
                                className="input input-bordered w-full mb-3"
                                value={suspendReason}
                                onChange={(e) => setSuspendReason(e.target.value)}
                                required
                            />
                            <label className="label">Feedback</label>
                            <textarea
                                placeholder="Feedback for user"
                                className="textarea textarea-bordered w-full mb-3"
                                value={suspendFeedback}
                                onChange={(e) => setSuspendFeedback(e.target.value)}
                                required
                            ></textarea>
                            <div className="modal-action flex justify-end gap-2">
                                <button type="submit" className="btn btn-warning">Suspend</button>
                                <button type="button" className="btn" onClick={() => setShowSuspendModal(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </dialog>
            )}

        </section>
    );
}