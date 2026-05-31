import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";
import GoogleProvider from "./GoogleProvider";
import toast from "react-hot-toast";
import useAxios from "../../hooks/useAxiosSecure";

export default function Register() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { createUser, updateUserProfile } = useAuth();
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const axiosSecure = useAxios();
    function handleRegister(data) {
        setLoading(true);
        setMessage('');
        if (data.password.length < 6) {
            setMessage('Password must be at least 6 characters');
            return;
        }
        if (!/[A-Z]/.test(data.password)) {
            setMessage('Password needs an uppercase letter');
            return;
        }
        if (!/[a-z]/.test(data.password)) {
            setMessage('Password needs a lowercase letter');
            return;
        }
        // user info to send to DB
        const userData = {
            name: data.name,
            email: data.email,
            photoURL: data.photoURL,
            role: data.role
        };
        createUser(data.email, data.password)
            .then(userCred => {
                updateUserProfile(userCred.user, { displayName: data.name, photoURL: data.photoURL })
                    .then(() => {
                        axiosSecure.post('/api/users', userData)
                            .then(res => {
                                setLoading(false);
                                toast.success('Succefully Created Account');
                                navigate('/');
                            });
                    })
                    .catch(error => {
                        console.log(error);
                    });
            })
            .catch(error => {
                setLoading(false);
                if (error.code === 'auth/email-already-in-use') {
                    setMessage('Already Registerred, please login!');
                }
            });
    }
    return (
        <div className="hero-content flex-col lg:flex-row-reverse">
            <title>Register | Smart Garments</title>
            <div className="text-center lg:text-left">
                <h1 className="text-5xl font-bold">Register now!</h1>
                <p className="py-6 max-w-2xl">
                    Create a account to get access to all products, order, track and get in touch. As a buyer, choose role buyer, and manager is requested to select manager as role
                </p>
            </div>
            <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                <div className="card-body">
                    <form onSubmit={handleSubmit(handleRegister)}>
                        <fieldset className="fieldset">
                            <label htmlFor="name" className="label mt-1">Name</label>
                            <input type="text" id="name" className="input w-full" placeholder="Full Name" {...register('name', { required: true })} />
                            {
                                errors.name && <span className="text-red-500">Name is required</span>
                            }
                            <label htmlFor="email" className="label mt-1">Email</label>
                            <input type="email" id="email" className="input w-full" placeholder="Email" {...register('email', { required: true })} />
                            {
                                errors.email && <span className="text-red-500">Email is required</span>
                            }
                            <label htmlFor="photo-url" className="label mt-1">Photo URL</label>
                            <input type="url" id="photo-url" className="input w-full" placeholder="Photo Link" {...register('photoURL', { required: true })} />
                            {
                                errors.photoURL && <span className="text-red-500">Photo Link is required</span>
                            }
                            <label htmlFor="rule" className="label mt-1">Role</label>
                            <select defaultValue="" className="select w-full" {...register('role', { required: true })}>
                                <option value='' disabled={true}>Select Your role</option>
                                <option value='buyer'>Buyer</option>
                                <option value='manager'>Manager</option>
                            </select>
                            {
                                errors.role && <span className="text-red-500">User role is required</span>
                            }
                            <label htmlFor="password" className="label mt-1">Password</label>
                            <input type="password" id="password" className="input w-full" placeholder="Password" {...register('password', { required: true })} />
                            {
                                errors.password && <span className="text-red-500">Password is required</span>
                            }
                            {message && <p className="text-red-500 mt-2 text-base text-center font-medium">{message}</p>}
                            <input type="submit" value='Register' className="btn btn-neutral mt-4" disabled={loading} />
                        </fieldset>
                    </form>
                    <p className="text-center text-base">OR</p>
                    <GoogleProvider />
                    <p className="mt-1">
                        Already have an account? <Link to='/auth/login' className="underline">Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}