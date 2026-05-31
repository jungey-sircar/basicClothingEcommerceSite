import { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Loading from "../../components/utils/Loading";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";

export default function MyProfile() {
    const { currentUser, logoutUser } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (currentUser?.email) {
            axiosSecure.get(`/api/users/profile?email=${currentUser.email}`)
                .then(res => {
                    setProfile(res.data.user);
                    setLoading(false);
                })
                .catch(err => console.log(err));
        }
    }, [currentUser]);

    const handleLogout = () => {
        Swal.fire({
            title: "Are you sure to Logout?",
            text: "You have to login again to get access!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, continue!"
        }).then((result) => {
            if (result.isConfirmed) {
                logoutUser()
                    .then(() => {
                        Swal.fire({
                            title: "Logged Out!",
                            text: "You have successfully logged out.",
                            icon: "success"
                        });
                    })
                    .catch(error => {
                        Swal.fire({
                            title: "OPPS!",
                            text: "Error loggin out.",
                            icon: "error"
                        });
                    });
            }
        });
    }
    if (loading) return <Loading />;
    return (
        <section className="hero bg-base-200 min-h-screen">
            <title>My Profile | Dashboard</title>
            <div className="hero-content flex-col lg:flex-row gap-8">
                <div>
                    <img
                        src={profile.photoURL || "https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp"}
                        alt="Profile"
                        className="w-full max-w-sm rounded-lg shadow-2xl mx-auto"
                    />
                </div>
                <div className="w-full bg-base-100">
                    <div className=" shadow-md p-6 rounded-lg space-y-2">
                        <p><strong>Name:</strong> {profile.name}</p>
                        <p><strong>Email:</strong> {profile.email}</p>
                        <p><strong>Role:</strong> {profile.role}</p>
                        <p><strong>Status:</strong> {profile.status}</p>
                        <p><strong>Account Created:</strong> {new Date(profile.createdAt).toLocaleString()}</p>
                        <p><strong>Last Updated:</strong> {new Date(profile.updatedAt).toLocaleString()}</p>
                        {/* Show suspend info only if user is suspended */}
                        {profile.status === 'suspended' && (
                            <div className="mt-4 p-4 bg-red-100 rounded-lg">
                                <p><strong>Suspend Reason:</strong> {profile.suspendReason}</p>
                                <p><strong>Feedback:</strong> {profile.suspendFeedback}</p>
                            </div>
                        )}
                    </div>
                    <div className="flex justify-center">
                        <button className="btn btn-error mt-6" onClick={handleLogout}>logout</button>
                    </div>
                </div>
            </div>
        </section>
    );
}