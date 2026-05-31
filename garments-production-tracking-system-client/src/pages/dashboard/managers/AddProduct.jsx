import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import uploadToImageBB from "../../../components/utils/uploadToImageBB";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

export default function AddProduct() {
    const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm();
    const [imagePreviews, setImagePreviews] = useState([]);
    const [selectedImages, setSelectedImages] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const axiosSecure = useAxiosSecure();

    // Handle image selection
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        // allow only images
        const validFiles = files.filter(file =>
            file.type.startsWith("image/")
        );
        if (validFiles.length !== files.length) {
            toast.error("Only image files are allowed");
            return;
        }
        setSelectedImages(validFiles);
        setImagePreviews(validFiles.map(file => URL.createObjectURL(file)));
    };

    // handle save form
    async function handleRegister(data) {
        setLoading(true);
        // check the image first
        if (selectedImages.length === 0) {
            toast.error("Please select at least one image");
            setLoading(false);
            return;
        }
        try {
            const imageURLs = await uploadToImageBB(selectedImages);
            const productData = {
                name: data.name,
                category: data.category,
                description: data.description,
                price: Number(data.price),
                availableQuantity: Number(data.availableQuantity),
                moq: Number(data.minimumOrderQuantity),
                paymentOption: data.paymentOption,
                showOnHome: data.showOnHome || false,
                images: imageURLs,
                demoVideoLink: data.demoVideoLink || ""
            };

            const res = await axiosSecure.post('/api/products', productData);

            if (res.data.success) {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Product is added",
                    showConfirmButton: false,
                    timer: 1500
                });

                reset();
                setSelectedImages([]);
                setImagePreviews([]);
            } else {
                Swal.fire({
                    position: "top-end",
                    icon: "error",
                    title: "Could not save product",
                    showConfirmButton: false,
                    timer: 1500
                });
            }

        } catch (err) {
            console.error(err);
            toast.error("Failed to save product");
        } finally {
            setLoading(false);
        }
    }
    return (
        <section className="hero-content mx-auto mt-6 md:mt-8">
            <title>Add Product | Dashboard</title>
            <div className="card bg-base-100 w-full shadow-2xl">
                <div className="card-body">
                    <h2 className="text-2xl md:text-3xl my-2 text-right">Add a Product</h2>
                    <form onSubmit={handleSubmit(handleRegister)}>
                        <fieldset className="fieldset grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {/* Product Name */}
                            <div className="flex flex-col">
                                <label htmlFor="name" className="label">Product Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    className="input w-full"
                                    placeholder="Product Name"
                                    {...register('name', { required: true })}
                                />
                                {errors.name && <span className="text-red-500">Product Name is required</span>}
                            </div>

                            {/* Category */}
                            <div className="flex flex-col">
                                <label htmlFor="category" className="label">Category</label>
                                <select
                                    defaultValue=""
                                    className="select w-full"
                                    {...register('category', { required: true })}
                                >
                                    <option value='' disabled>Select Category</option>
                                    <option value='shirt'>Shirt</option>
                                    <option value='pant'>Pant</option>
                                    <option value='jacket'>Jacket</option>
                                    <option value='accessories'>Accessories</option>
                                </select>
                                {errors.category && <span className="text-red-500">Category is required</span>}
                            </div>

                            {/* Description */}
                            <div className="flex flex-col col-span-1 lg:col-span-2">
                                <label htmlFor="description" className="label">Product Description</label>
                                <textarea
                                    id="description"
                                    className="input w-full h-20 text-wrap"
                                    placeholder="Product Description"
                                    {...register('description', { required: true })}
                                ></textarea>
                                {errors.description && <span className="text-red-500">Product Description is required</span>}
                            </div>

                            {/* Price */}
                            <div className="flex flex-col">
                                <label htmlFor="price" className="label">Price</label>
                                <input
                                    type="number"
                                    id="price"
                                    className="input w-full"
                                    placeholder="Price"
                                    {...register('price', { required: true })}
                                />
                                {errors.price && <span className="text-red-500">Price is required</span>}
                            </div>

                            {/* Available Quantity */}
                            <div className="flex flex-col">
                                <label htmlFor="available-quantity" className="label">Available Quantity</label>
                                <input
                                    type="number"
                                    id="available-quantity"
                                    className="input w-full"
                                    placeholder="Available Quantity"
                                    {...register('availableQuantity', { required: true })}
                                />
                                {errors.availableQuantity && <span className="text-red-500">Quantity is required</span>}
                            </div>

                            {/* Minimum Order Quantity */}
                            <div className="flex flex-col">
                                <label htmlFor="minimum-order-quantity" className="label">Minimum Order Quantity</label>
                                <input
                                    type="number"
                                    id="minimum-order-quantity"
                                    className="input w-full"
                                    placeholder="Minimum Order Quantity"
                                    {...register('minimumOrderQuantity', { required: true })}
                                />
                                {errors.minimumOrderQuantity && <span className="text-red-500">MOQ is required</span>}
                            </div>

                            {/* Demo Video */}
                            <div className="flex flex-col">
                                <label htmlFor="video-link" className="label">Demo Video Link</label>
                                <input
                                    type="url"
                                    id="video-link"
                                    className="input w-full"
                                    placeholder="Video Link (optional)"
                                    {...register('demoVideoLink')}
                                />
                            </div>

                            {/* Payment Option */}
                            <div className="flex flex-col">
                                <label htmlFor="payment-option" className="label">Payment Option</label>
                                <select
                                    defaultValue=""
                                    className="select w-full"
                                    {...register('paymentOption', { required: true })}
                                >
                                    <option value='' disabled>Choose Payment option</option>
                                    <option value='Cash on Delivery'>Cash on Delivery</option>
                                    <option value='Pay First'>Pay First</option>
                                </select>
                                {errors.paymentOption && <span className="text-red-500">Select payment option</span>}
                            </div>

                            {/* File Upload */}
                            <div className="flex flex-col col-span-1">
                                <label htmlFor="images" className="label">Product Image</label>
                                <input
                                    id='images'
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className="file-input w-full"
                                    onChange={handleImageChange}
                                />
                            </div>
                            {/* Preview */}
                            {
                                imagePreviews.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {imagePreviews.map((src, index) => (
                                            <img
                                                key={index}
                                                src={src}
                                                alt={`Preview ${index}`}
                                                className="w-24 h-24 object-cover border rounded"
                                            />
                                        ))}
                                    </div>
                                )
                            }

                            {/* Show on Homepage */}
                            <div className="flex items-center gap-2 col-span-1 lg:col-span-2">
                                <input id='showHome' type="checkbox" className="checkbox" {...register('showOnHome')} />
                                <label htmlFor="showHome" className="label">Show on Homepage</label>
                            </div>

                            {/* Submit Button */}
                            <input type="submit" value='Save' className="btn btn-neutral mt-4 w-fit" disabled={loading} />
                        </fieldset>
                    </form>
                </div>
            </div>
        </section>
    );
}