import { FaSquareXTwitter } from "react-icons/fa6";
import { FaGithub } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { MdOutlineMail } from "react-icons/md";
import { MdOutlineLocationOn } from "react-icons/md";
import { Link } from "react-router";

export default function Footer() {
    return (
        <footer className="bg-base-200">
            <section className="footer sm:footer-horizontal text-base-content p-10 containerr">
                <aside>
                    <h3 className="text-5xl">SM</h3>
                    <p className="text-base">
                        Smart Garments
                        <br />
                        Providing reliable garments management since 2025
                    </p>
                </aside>
                <nav>
                    <h6 className="footer-title mb-0 md:mb-2">Quick Links</h6>
                    <Link to='/' className="link link-hover">Home</Link>
                    <Link to='/all-products' className="link link-hover">All Products</Link>
                    <Link to='/about' className="link link-hover">About Us</Link>
                    <Link to='/contact' className="link link-hover">Contact</Link>
                </nav>
                <nav>
                    <h6 className="footer-title">Navigation</h6>
                    <Link to='/auth/login' className="link link-hover">Login</Link>
                    <Link to='/auth/register' className="link link-hover">Register</Link>
                </nav>
                <nav>
                    <h6 className="footer-title mb-0 md:mb-2">Contact</h6>
                    <p className="flex items-center gap-2"> <MdOutlineLocationOn className="text-xl" /> Sylhet, Bangladesh </p>
                    <a href="mailto:nayemahmedz@proton.me" className="link link-hover flex items-center gap-2"> <MdOutlineMail className="text-xl" /> nayemahmedz@proton.me</a>
                    <div className="flex gap-3 mt-3 mb-4 md:mb-0">
                        <a className="link link-hover text-2xl"> <FaFacebook /> </a>
                        <a className="link link-hover text-2xl"> <FaSquareXTwitter /> </a>
                        <a className="link link-hover text-2xl" href='https://github.com/nayem-ahmedz/garments-production-tracking-system-client' target='_blank' rel='noopener noreferrer'> <FaGithub /> </a>
                    </div>
                </nav>
            </section>
        </footer>
    );
}