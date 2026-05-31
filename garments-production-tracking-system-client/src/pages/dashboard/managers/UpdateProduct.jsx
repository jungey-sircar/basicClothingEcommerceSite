import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import uploadToImageBB from "../../../components/utils/uploadToImageBB";

export default function UpdateProduct() {
    const { id } = useParams();
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();
    const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm({
        defaultValues: {
            name: '',
            category: '',
            description: '',
            price: 0,
            paymentOption: '',
            demoVideoLink: '',
        }
    });
    const [loading, setLoading] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    /* 🔹 Fetch product */
    const { data: product, isLoading } = useQuery({
        queryKey: ["admin-product", id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/api/products/${id}`);
            return res.data.product;
        },
    });

    /* Prefill form */
    useEffect(() => {
        if (product) {
            reset({
                name: product.name || '',
                category: product.category || '',
                description: product.description || '',
                price: product.price || 0,
                paymentOption: product.paymentOption || '',
                demoVideoLink: product.demoVideoLink || '',
            });
            setExistingImages(product.images || []);
        }
    }, [product, reset]);
    /* Image selection */
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const validFiles = files.filter((f) => f.type.startsWith("image/"));
        if (validFiles.length !== files.length) {
            toast.error("Only image files are allowed");
            return;
        }
        setSelectedImages(validFiles);
        setImagePreviews(validFiles.map((f) => URL.createObjectURL(f)));
    };

    /* Submit */
    const handleUpdate = async (data) => {
        setLoading(true);
        try {
            const updatedProduct = {};
            // Compare each field with original product
            if (data.name !== product.name) updatedProduct.name = data.name;
            if (data.category !== product.category) updatedProduct.category = data.category;
            if (data.description !== product.description) updatedProduct.description = data.description;
            if (Number(data.price) !== product.price) updatedProduct.price = Number(data.price);
            if (data.paymentOption !== product.paymentOption) updatedProduct.paymentOption = data.paymentOption;
            if ((data.demoVideoLink || "") !== (product.demoVideoLink || "")) updatedProduct.demoVideoLink = data.demoVideoLink || "";
            // Upload images only if new images are selected
            if (selectedImages.length > 0) {
                const uploadedImages = await uploadToImageBB(selectedImages);
                updatedProduct.images = uploadedImages;
            }
            // If no changes, skip API call
            if (Object.keys(updatedProduct).length === 0) {
                Swal.fire({
                    position: "top-end",
                    icon: "error",
                    title: "No changes detected!",
                    showConfirmButton: false,
                    timer: 1500
                });
                setLoading(false);
                return;
            }
            // Send PATCH request
            const res = await axiosSecure.patch(`/api/manager/products/${id}`, updatedProduct);
            if (res.data.success) {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Product Data is Updated",
                    timer: 1500,
                    showConfirmButton: false,
                });
                navigate("/dashboard/manage-products");
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to update product");
        } finally {
            setLoading(false);
        }
    };

    if (isLoading) {
        return (
            <span className="loading loading-spinner loading-lg block mx-auto mt-10"></span>
        );
    }
    return (
        <section className="hero-content mx-auto mt-6">
            <title>Update Product | Dashboard</title>

            <div className="card bg-base-100 w-full shadow-2xl">
                <div className="card-body">
                    <h2 className="text-2xl md:text-3xl my-2 text-right">
                        Update Product
                    </h2>

                    <form onSubmit={handleSubmit(handleUpdate)}>
                        <fieldset className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {/* Name */}
                            <div>
                                <label className="label">Product Name</label>
                                <input
                                    className="input w-full"
                                    {...register("name", { required: true })}
                                />
                                {errors.name && <p className="text-red-500">Required</p>}
                            </div>
                            {/* Category */}
                            <div>
                                <label className="label">Category</label>
                                <select
                                    className="select w-full"
                                    {...register("category", { required: true })}
                                >
                                    <option value="shirt">Shirt</option>
                                    <option value="pant">Pant</option>
                                    <option value="jacket">Jacket</option>
                                    <option value="accessories">Accessories</option>
                                </select>
                            </div>
                            {/* Description */}
                            <div className="lg:col-span-2">
                                <label className="label">Description</label>
                                <textarea
                                    className="textarea textarea-bordered w-full"
                                    {...register("description", { required: true })}
                                />
                            </div>
                            {/* Price */}
                            <div>
                                <label className="label">Price</label>
                                <input
                                    type="number"
                                    className="input w-full"
                                    {...register("price", { required: true })}
                                />
                            </div>
                            {/* Demo Video */}
                            <div>
                                <label className="label">Demo Video Link</label>
                                <input
                                    className="input w-full"
                                    {...register("demoVideoLink")}
                                />
                            </div>
                            {/* Payment */}
                            <div>
                                <label className="label">Payment Option</label>
                                <select
                                    className="select w-full"
                                    {...register("paymentOption", { required: true })}
                                >
                                    <option value="Cash on Delivery">Cash on Delivery</option>
                                    <option value="Pay First">Pay First</option>
                                </select>
                            </div>
                            {/* Images */}
                            <div>
                                <label className="label">Update Images (optional)</label>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className="file-input w-full"
                                    onChange={handleImageChange}
                                />
                            </div>
                            {/* Existing Images */}
                            <div className="flex gap-2 flex-wrap">
                                {imagePreviews.length > 0
                                    ? imagePreviews.map((src, i) => (
                                        <img key={i} src={src} className="w-20 h-20 rounded" />
                                    ))
                                    : existingImages.map((src, i) => (
                                        <img key={i} src={src} className="w-20 h-20 rounded" />
                                    ))}
                            </div>
                            {/* Submit */}
                            <button
                                type="submit"
                                className="btn btn-neutral w-fit col-span-full"
                                disabled={loading}
                            >
                                {loading ? "Updating..." : "Update"}
                            </button>
                        </fieldset>
                    </form>
                </div>
            </div>
        </section>
    );
}