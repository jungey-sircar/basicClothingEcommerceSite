import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import Loading from "../../components/utils/Loading";
import useAxios from "../../hooks/useAxios";

export default function ProductDetails() {
    const axios = useAxios();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const productParam = useParams();
    useEffect(() => {
        axios.get(`/api/products/${productParam.id}`)
            .then(res => {
                setLoading(false);
                setProduct(res.data.product);
            })
            .catch(err => {
                console.log(err);
            })
    }, []);
    if (loading) {
        return <Loading />
    }
    return (
        <div className="hero bg-base-200 min-h-screen">
            <title>Product Details</title>
            <div className="hero-content flex-col lg:flex-row">
                <img src={product.images[0]} className="max-w-sm rounded-lg shadow-2xl" />
                <div>
                    {/* Details */}
                    <div>
                        <h1 className="text-3xl font-bold">{product.name}</h1>
                        <p className="text-gray-500 mt-1">Category: {product.category}</p>
                        <p className="mt-4">{product.description}</p>
                        <div className="mt-4 space-y-2">
                            <p><strong>Price:</strong> $ {product.price}</p>
                            <p><strong>Available Items:</strong> {product.availableQuantity}</p>
                            <p><strong>Minimum Order:</strong> {product.moq}</p>
                            <p><strong>Payment:</strong> {product.paymentOption}</p>
                        </div>
                        {/* Order Button */}
                        <Link to={`/booking/${product._id}`} className="btn btn-primary mt-6" > Order Now </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}