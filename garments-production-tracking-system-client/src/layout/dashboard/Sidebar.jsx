import { Link } from "react-router";
import { RiDashboardFill } from "react-icons/ri";
import { FaUsers } from "react-icons/fa";
import { GiClothes } from "react-icons/gi";
import useAuth from "../../hooks/useAuth";
import { IoCart } from "react-icons/io5";
import { FaMagnifyingGlassLocation } from "react-icons/fa6";
import { RiFolderAddFill } from "react-icons/ri";
import { BsSendExclamationFill } from "react-icons/bs";
import { BsSendCheckFill } from "react-icons/bs";
import { AiFillProduct } from "react-icons/ai";
import { FaUser } from "react-icons/fa6";

export default function Sidebar({role}) {
    const { currentUser } = useAuth();
    const navLinks = [
        { id: 1, text: 'Dashboard', link: '/dashboard/home', icon: RiDashboardFill },
        { id: 2, text: 'My Orders', link: '/dashboard/my-orders', icon: IoCart },
        { id: 3, text: 'Track Order', link: '/dashboard/track-orders', icon: FaMagnifyingGlassLocation },
        { id: 4, text: 'Add Product', link: '/dashboard/add-product', icon: RiFolderAddFill },
        { id: 5, text: 'Manage Products', link: '/dashboard/manage-products', icon: GiClothes },
        { id: 6, text: 'Pending Orders', link: '/dashboard/pending-orders', icon: BsSendExclamationFill },
        { id: 7, text: 'Approve Orders', link: '/dashboard/approved-orders', icon: BsSendCheckFill },
        { id: 8, text: 'Manage Users', link: '/dashboard/manage-users', icon: FaUsers },
        { id: 9, text: 'All Products', link: '/dashboard/all-products', icon: GiClothes },
        { id: 10, text: 'All Orders', link: '/dashboard/all-orders', icon: AiFillProduct },
        { id: 11, text: 'My Profile', link: '/dashboard/my-profile', icon: FaUser }
    ];

    // filtered links
    const rolePermissions = {
        admin: ['Dashboard', 'Manage Users', 'All Products', 'All Orders', 'My Profile'],
        manager: ['Dashboard', 'Add Product', 'Manage Products', 'Pending Orders', 'Approve Orders', 'My Profile'],
        buyer: ['Dashboard', 'My Orders', 'Track Order', 'My Profile']
    };
    // Function to filter the links based on the role
    const filteredLinks = navLinks.filter(link => rolePermissions[role]?.includes(link.text));

    return (
        <div className="drawer-side is-drawer-close:overflow-visible">
            <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
            <div className="flex min-h-full flex-col items-start bg-base-200 is-drawer-open:w-64">
                <ul className="menu w-full grow">
                    <li className="is-drawer-close:tooltip is-drawer-close:tooltip-right text-base mb-4">
                        <div className="avatar justify-center cursor-default hover:bg-transparent">
                            <div className="w-6 is-drawer-open:w-20 rounded">
                                <img src={currentUser.photoURL} alt={currentUser.displayName} />
                            </div>
                        </div>
                        <div className="is-drawer-close:hidden flex flex-col gap-0 cursor-default hover:bg-transparent">
                            <h2 className="text-2xl">{currentUser.displayName}</h2>
                            <p>{role}</p>
                        </div>
                    </li>
                    {
                        filteredLinks.map(link => <li key={link.id}>
                            <Link to={link.link} className="is-drawer-close:tooltip is-drawer-close:tooltip-right text-base" data-tip={link.text}>
                                <link.icon className="text-xl md:text-2xl" />
                                <span className="is-drawer-close:hidden"> {link.text} </span>
                            </Link>
                        </li>)
                    }
                </ul>
            </div>
        </div>
    );
}