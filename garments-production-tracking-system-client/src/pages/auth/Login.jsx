import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";
import GoogleProvider from "./GoogleProvider";
import toast from "react-hot-toast";

export default function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { loginUser } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    function handleRegister(data) {
        setError('');
        if (data.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        loginUser(data.email, data.password)
          .then(userCred => {
            toast.success('Succesfully logged in');
            navigate('/dashboard');
          })
          .catch(error => {
            if(error.code === 'auth/invalid-credential'){
                setError('Invalid email/password');
            }
          })
    }
    return (
        <div className="hero-content flex-col lg:flex-row-reverse">
            <title>Login | Smart Garments</title>
            <div className="text-center lg:text-left">
                <h1 className="text-5xl font-bold">Login now!</h1>
                <p className="py-6 max-w-2xl">
                    Welcome Back! Login to get access to your personalized dashboard, track order and update your order, delete and see or manage all the orders, payment history
                </p>
            </div>
            <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                <div className="card-body">
                    <form onSubmit={handleSubmit(handleRegister)}>
                        <fieldset className="fieldset">
                            <label htmlFor="email" className="label mt-1">Email</label>
                            <input type="email" id="email" className="input w-full" placeholder="Email" {...register('email', { required: true })} />
                            {
                                errors.email && <span className="text-red-500">Email is required</span>
                            }
                            <label htmlFor="password" className="label mt-1">Password</label>
                            <input type="password" id="password" className="input w-full" placeholder="Password" {...register('password', { required: true })} />
                            {
                                errors.password && <span className="text-red-500">Password is required</span>
                            }
                            {error && <p className="text-red-500 mt-2 text-base text-center font-medium">{error}</p>}
                            <input type="submit" value='Login' className="btn btn-neutral mt-4" />
                        </fieldset>
                    </form>
                    <p className="text-center text-base">OR</p>
                    <GoogleProvider />
                    <p className="mt-1">
                        Don't have an account? <Link to='/auth/register' className="underline">Register</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}