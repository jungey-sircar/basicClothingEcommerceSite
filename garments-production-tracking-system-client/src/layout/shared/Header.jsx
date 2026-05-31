import { Link, NavLink } from "react-router";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";
import ThemeToggler from "../../components/utils/ThemeToggler";

export default function Header() {
    const { currentUser, loading, logoutUser } = useAuth();
    const navLinks = <>
        <li> <NavLink className='text-base' to='/'>Home</NavLink> </li>
        <li> <NavLink className='text-base' to='/all-products'>All Products</NavLink> </li>
        <li> <NavLink className='text-base' to='/about'>About us</NavLink> </li>
        <li> <NavLink className='text-base' to='/contact'>Contact</NavLink> </li>
        {
            !currentUser ? <>
                <li> <NavLink className='text-base' to='/auth/register'>Register</NavLink> </li>
            </> : <li> <NavLink className='text-base' to='/dashboard'>Dashboard</NavLink> </li>
        }
    </>;
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
    return (
        <header className="bg-base-100 shadow-sm sticky top-0 z-10">
            <nav className="navbar containerr">
                <div className="navbar-start">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                        </div>
                        <ul
                            tabIndex="-1"
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                            {
                                navLinks
                            }
                        </ul>
                    </div>
                    <Link to='/' className="btn btn-ghost text-xl">Smart<span className="text-indigo-400">Garments</span></Link>
                </div>
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1">
                        {
                            navLinks
                        }
                    </ul>
                </div>
                <div className="navbar-end gap-3">
                    {
                        loading ? <span className="loading loading-dots loading-xl mr-5"></span> : currentUser ?
                            <>
                                <div className="dropdown dropdown-end">
                                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                                        <div className="w-10 rounded-full">
                                            <img src={currentUser.photoURL} alt={`image of ${currentUser.displayName}`} />
                                        </div>
                                    </div>
                                    <ul
                                        tabIndex="-1"
                                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                                        <li>
                                            <a className="justify-between text-base">Profile</a>
                                        </li>
                                        <li> <Link to='/dashboard' className="text-base">Dashboard</Link> </li>
                                        <li>
                                            <button className='text-base' onClick={handleLogout}>Logout</button>
                                        </li>
                                    </ul>
                                </div>
                            </> : <Link to='/auth/login' className="btn btn-primary text-base">Login</Link>
                    }
                    <ThemeToggler />
                </div>
            </nav>
        </header>
    );
}