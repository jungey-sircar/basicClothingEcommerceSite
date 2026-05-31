import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { Link } from "react-router";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import Swal from "sweetalert2";

export default function ManageProducts() {
    const { currentUser } = useAuth();
    const axiosSecure = useAxiosSecure();
    // data fetch using tanstack query
    const { data: products = [], refetch } = useQuery({
        queryKey: ['products', currentUser.email],
        queryFn: async () => {
            const response = await axiosSecure.get('/api/products/my');
            return response.data.products;
        }
    });
    const handleDelete = (product) => {
        Swal.fire({
            title: "Are you sure to Delete?",
            text: `Product : ${product.name}`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, continue!"
        }).then((result) => {
            if (result.isConfirmed) {
                axiosSecure.delete(`/api/manager/products/${product._id}`)
                    .then((res) => {
                        refetch();
                        Swal.fire({
                            title: "Product is Deleted",
                            text: `Deleted ${product.name}`,
                            icon: "success"
                        });
                    })
                    .catch(error => {
                        Swal.fire({
                            title: "OPPS!",
                            text: "Error deleting product.",
                            icon: "error"
                        });
                    });
            }
        });
    }
    return (
        <section className="p-4">
            <title>Manage Products | Dashboard</title>
            <h2 className="text-2xl md:text-3xl my-4 text-center">All Products</h2>
            <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
                <table className="table">
                    {/* head */}
                    <thead>
                        <tr>
                            <th>Sl</th>
                            <th>Image</th>
                            <th>Product Name</th>
                            <th>Price</th>
                            <th>Payment Option</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            products.map((product, index) => <tr key={product._id}>
                                <th>{index + 1}</th>
                                <td>
                                    <div className="avatar">
                                        <div className="w-24 rounded">
                                            <img src={product.images[0]} alt={product.name} />
                                        </div>
                                    </div>
                                </td>
                                <td>{product.name}</td>
                                <td>{product.price}</td>
                                <td>{product.paymentOption}</td>
                                <td>
                                    <Link to={`/dashboard/manage-products/update/${product._id}`} className="btn btn-neutral btn-outline mr-4">
                                        <FaEdit className="text-xl md:text-2xl" />
                                    </Link>
                                    <button type='button' className="btn btn-secondary btn-outline" onClick={() => handleDelete(product)}>
                                        <MdDeleteForever className="text-xl md:text-2xl" />
                                    </button>
                                </td>
                            </tr>)
                        }
                    </tbody>
                </table>
            </div>
        </section>
    );
}