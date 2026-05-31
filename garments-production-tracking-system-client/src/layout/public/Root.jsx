import { Outlet } from "react-router";
import Header from "../shared/Header";
import Footer from "../shared/Footer";
import { Toaster } from "react-hot-toast";
import ScrollToTop from "../../components/utils/ScrollToTop";

export default function Root() {
    return (
        <>
            <ScrollToTop />
            <Header />
            <main className="containerr">
                <Outlet />
            </main>
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
            <Footer />
        </>
    );
}