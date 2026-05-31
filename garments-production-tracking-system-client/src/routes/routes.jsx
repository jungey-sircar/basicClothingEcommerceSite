import { createBrowserRouter } from "react-router";
import { lazy } from "react";
import Root from "../layout/public/Root";
import PrivateRoute from "./PrivateRoutes";
import AuthLayout from "../pages/auth/AuthLayout";
import AdminRoute from "./AdminRoutes";
import ManagerRoute from "./ManagerRoutes";
import BuyerRoutes from "./BuyerRoutes";
const Home = lazy(() => import('../pages/home/Home'));
const NoPage = lazy(() => import('../pages/NoPage'));
const Login = lazy(() => import('../pages/auth/Login'));
const Register = lazy(() => import('../pages/auth/Register'));
// dashboard
const Dashboard = lazy(() => import('../layout/dashboard/Dashboard'));
const DashboardHome = lazy(() => import('../pages/dashboard/DashboardHome'));

// admin pages
const ManageUsers = lazy(() => import('../pages/dashboard/admin/ManageUsers'));
const AdminAllProducts = lazy(() => import('../pages/dashboard/admin/AllProducts'));
const UpdateProduct = lazy(() => import('../pages/dashboard/admin/UpdateProduct'));
const AllOrders = lazy(() => import('../pages/dashboard/admin/AllOrders'));

// manager pages
const AddProduct = lazy(() => import('../pages/dashboard/managers/AddProduct'));
const ManageProducts = lazy(() => import('../pages/dashboard/managers/ManageProducts'));
const ManagerUpdateProduct = lazy(() => import('../pages/dashboard/managers/UpdateProduct'));
const ApprovedOrders = lazy(() => import('../pages/dashboard/managers/ApprovedOrders'));
const PendingOrders = lazy(() => import('../pages/dashboard/managers/PendingOrders'));

// buyer / customer pages
const AllProducts = lazy(() => import('../pages/products/AllProducts'));
const ProductDetails = lazy(() => import('../pages/products/ProductDetails'));
const Booking = lazy(() => import('../pages/products/Booking'));
const MyOrders = lazy(() => import('../pages/dashboard/buyer/MyOrders'));
const TrackOrders = lazy(() => import('../pages/dashboard/buyer/TrackOrders'));
const MyProfile = lazy(() => import('../pages/dashboard/MyProfile'));
const About = lazy(() => import('../pages/About'));
const Contact = lazy(() => import('../pages/Contact'));
const Orders = lazy(() => import('../pages/dashboard/Orders'));

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Root />,
        children: [
            { index: true, element: <Home /> },
            {
                path: '/auth',
                element: <AuthLayout />,
                children: [
                    { index: true, element: <Login /> },
                    { path: 'login', element: <Login /> },
                    { path: 'register', element: <Register /> }
                ]
            },
            { path: '/all-products', element: <AllProducts /> },
            { path: '/all-products/:id', element: <ProductDetails /> },
            { path: '/booking/:id', element: <PrivateRoute> <BuyerRoutes> <Booking /> </BuyerRoutes> </PrivateRoute>},
            { path: '/about', element: <About /> },
            { path: '/contact', element: <Contact /> },
            { path: '*', element: <NoPage /> }
        ]
    },
    {
        path: '/dashboard',
        element: <PrivateRoute> <Dashboard /> </PrivateRoute>,
        children: [
            { index: true, element: <DashboardHome /> },
            { path: 'home', element: <DashboardHome /> },
            { path: 'manage-users', element: <AdminRoute><ManageUsers /></AdminRoute> },
            { path: 'all-products', element: <AdminRoute> <AdminAllProducts /> </AdminRoute> },
            { path: 'all-products/update/:id', element: <AdminRoute> <UpdateProduct /> </AdminRoute> },
            { path: 'all-orders', element: <AdminRoute> <AllOrders /> </AdminRoute> },
            { path: 'all-orders/:id', element: <AdminRoute> <Orders /> </AdminRoute> },
            { path: 'add-product', element: <ManagerRoute> <AddProduct /> </ManagerRoute> },
            { path: 'manage-products', element: <ManagerRoute> <ManageProducts /> </ManagerRoute> },
            { path: 'manage-products/update/:id', element: <ManagerRoute> <ManagerUpdateProduct /> </ManagerRoute> },
            { path: 'approved-orders', element: <ManagerRoute> <ApprovedOrders /> </ManagerRoute> },
            { path: 'pending-orders', element: <ManagerRoute> <PendingOrders /> </ManagerRoute> },
            { path: 'my-orders', element: <BuyerRoutes> <MyOrders /> </BuyerRoutes> },
            { path: 'track-orders', element: <BuyerRoutes> <TrackOrders /> </BuyerRoutes> },
            { path: 'my-profile', element: <MyProfile />},
            { path: '*', element: <NoPage /> }
        ]
    },
]);