import { useForm } from "react-hook-form";
import Loading from "../../components/utils/Loading";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import useAuth from "../../hooks/useAuth";

export default function Booking() {
    console.log('booking')
    const { currentUser } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [product, setProduct] = useState(null);
    const [ loading, setLoading ] = useState(true);
    const [ ordering, setOrdering ] = useState(false);
    const productParam = useParams();
    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const navigate = useNavigate();
    useEffect(() => {
        axiosSecure.get(`/api/products/${productParam.id}`)
            .then(res => {
                setLoading(false);
                setProduct(res.data.product);
            })
            .catch(err => {
                setLoading(false);
                console.log(err);
            })
    }, []);
    const handleOrder = (data) => {
        data.totalPrice = data.quantity * product.price;
        data.productId = product._id;
        setOrdering(true);
        axiosSecure.post('/api/orders', data)
          .then(res => {
            setOrdering(false);
            navigate('/dashboard/my-orders');
          })
          .catch(err => console.log(err));
    }
    if (loading) {
        return <section className="w-full h-[60vh] flex justify-center items-center"> <Loading /> </section>
    }
    return (
        <section className="hero-content mx-auto mt-6 md:mt-8">
            <title>Book a Product</title>
            <div className="card bg-base-100 w-full shadow-2xl">
                <div className="card-body">
                    <h2 className="text-2xl md:text-3xl my-2 text-right">Book a Product</h2>
                    <form onSubmit={handleSubmit(handleOrder)}>
                        <fieldset className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div className="flex flex-col lg:col-span-2">
                                <div className="avatar">
                                    <div className="w-full max-w-60 rounded">
                                        <img src={product.images[0]} alt={product.name} />
                                    </div>
                                </div>
                            </div>
                            {/* Email (read-only) */}
                            <div className="flex flex-col">
                                <label className="label">Email</label>
                                <input
                                    type="email"
                                    className="input w-full"
                                    value={currentUser?.email || ""}
                                    {...register("buyerEmail")}
                                    readOnly
                                />
                            </div>

                            {/* Product Title (read-only) */}
                            <div className="flex flex-col">
                                <label className="label">Product Name</label>
                                <input
                                    type="text"
                                    className="input w-full"
                                    value={product.name}
                                    {...register("productName")}
                                    readOnly
                                />
                            </div>

                            {/* Price / Payment Info (read-only) */}
                            <div className="flex flex-col">
                                <label className="label">Price (per unit)</label>
                                <input
                                    type="number"
                                    className="input w-full"
                                    value={product.price}
                                    {...register("price")}
                                    readOnly
                                />
                            </div>

                            {/* First Name */}
                            <div className="flex flex-col">
                                <label className="label">First Name</label>
                                <input
                                    type="text"
                                    className="input w-full"
                                    {...register("firstName", { required: true })}
                                />
                            </div>

                            {/* Last Name */}
                            <div className="flex flex-col">
                                <label className="label">Last Name</label>
                                <input
                                    type="text"
                                    className="input w-full"
                                    {...register("lastName", { required: true })}
                                />
                            </div>

                            {/* Order Quantity */}
                            <div className="flex flex-col">
                                <label className="label">
                                    Order Quantity (Min: {product.moq}, Max: {product.availableQuantity})
                                </label>
                                <input
                                    type="number"
                                    className="input w-full"
                                    {...register("quantity", {
                                        required: true,
                                        min: product.moq,
                                        max: product.availableQuantity
                                    })}
                                />
                                {errors.quantity?.type === 'min' && <span>Quantity cannot be less than MOQ</span>}
                                {errors.quantity?.type === 'max' && <span>Quantity cannot exceed available stock</span>}
                            </div>

                            {/* Total Price (read-only, calculated) */}
                            <div className="flex flex-col">
                                <label className="label">Total Price</label>
                                <input
                                    type="number"
                                    className="input w-full"
                                    value={Number(watch("quantity") || 0) * product.price}
                                    readOnly
                                />
                            </div>

                            {/* Contact Number */}
                            <div className="flex flex-col">
                                <label className="label">Contact Number</label>
                                <input
                                    type="tel"
                                    className="input w-full"
                                    {...register("contactNumber", { required: true })}
                                />
                            </div>

                            {/* Delivery Address */}
                            <div className="flex flex-col lg:col-span-2">
                                <label className="label">Delivery Address</label>
                                <textarea
                                    className="textarea textarea-bordered w-full"
                                    {...register("address", { required: true })}
                                />
                            </div>

                            {/* Additional Notes */}
                            <div className="flex flex-col lg:col-span-2">
                                <label className="label">Additional Notes</label>
                                <textarea
                                    className="textarea textarea-bordered w-full"
                                    {...register("notes")}
                                />
                            </div>

                            {/* Submit */}
                            <div className="lg:col-span-2">
                                <button className="btn btn-primary" type="submit" disabled={ordering}>
                                    Confirm Order
                                </button>
                            </div>
                        </fieldset>
                    </form>

                </div>
            </div>
        </section>
    );
}