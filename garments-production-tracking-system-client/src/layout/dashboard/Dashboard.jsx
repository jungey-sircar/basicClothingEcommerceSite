import { Link, Outlet } from "react-router";
import Sidebar from "./Sidebar";
import { GiHamburgerMenu } from "react-icons/gi";
import useRole from "../../hooks/useRole";
import Loading from "../../components/utils/Loading";
import ScrollToTop from "../../components/utils/ScrollToTop";
import { Toaster } from "react-hot-toast";

export default function Dashboard() {
    const { role, isLoading } = useRole();
    if (isLoading) return <section className="min-h-screen w-full flex justify-center items-center"><Loading /></section>
    return (
        <section className="drawer lg:drawer-open min-h-screen containerr2">
            <ScrollToTop />
            <title>Dashboard | Smart Garments</title>
            <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
            <section className="drawer-content">
                {/* Navbar */}
                <nav className="navbar w-full bg-base-300">
                    <label htmlFor="my-drawer-4" aria-label="open sidebar" className="btn btn-square btn-ghost">
                        {/* Sidebar toggle icon */}
                        <GiHamburgerMenu className="text-2xl" />
                    </label>
                    <div className="px-2 grow">Dashboard</div>
                    <div>
                        <Link to='/' className="btn btn-secondary btn-outline">Exit Dashboard</Link>
                    </div>
                </nav>

                {/* Page content here */}
                <section>
                    <Outlet />
                </section>
            </section>
            <Sidebar role={role} />
            <Toaster
                position="top-center"
                reverseOrder={false}
                toastOptions={{
                    // Define default options
                    className: '',
                    duration: 5000,
                    removeDelay: 1000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                    },
                    // Default options for specific types
                    success: {
                        duration: 3000,
                        iconTheme: {
                            primary: 'green',
                            secondary: 'black',
                        },
                    },
                }}
            />
        </section>
    );
}