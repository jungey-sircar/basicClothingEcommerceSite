import { motion } from "motion/react";
import { Link } from "react-router";

export default function Hero() {
    return (
        <section
            className="hero min-h-[70vh]"
            style={{ backgroundImage: "url(https://images.pexels.com/photos/31212936/pexels-photo-31212936.jpeg)",}}
        >
            <div className="hero-overlay"></div>
            <div className="hero-content w-full text-neutral-content py-10">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="w-full text-left"
                >
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-6 text-4xl font-bold"
                    >
                        Smart Garments
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.35 }}
                        className="mb-8 max-w-xl text-lg text-slate-300"
                    >
                        A complete garments order & production tracker designed for buyers,
                        managers, and factory admins to collaborate, progress, and ensure
                        timely delivery — all in one platform.
                    </motion.p>
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mb-6 text-3xl font-extrabold sm:text-4xl md:text-5xl"
                    >
                        Track Orders.
                        <br />
                        Manage Production.
                        <br />
                        <span className="bg-linear-to-r from-indigo-400 to-fuchsia-400 bg-clip-text text-transparent">
                            Deliver With Confidence.
                        </span>
                    </motion.h2>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="flex flex-wrap gap-4"
                    >
                        <Link to='/all-products' className="btn btn-primary">View Products</Link>
                        <Link to='/all-products' className="btn btn-neutral">Book a Product</Link>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}