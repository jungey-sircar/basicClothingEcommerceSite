import {
    FaIndustry,
    FaClipboardList,
    FaUsersCog,
    FaChartLine,
    FaShieldAlt,
    FaClock
} from "react-icons/fa";

export default function About() {
    return (
        <section className="min-h-screen bg-base-100 py-10 px-4">
            <title>About Us | Smart Garments</title>
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                        About <span className="text-indigo-400">Us</span>
                    </h2>
                    <p className="mx-auto max-w-2xl text-slate-400">
                        A modern garments production and order tracking system designed to ensure transparency, efficiency, and control across every stage.
                    </p>
                </div>

                {/* Mission & Vision */}
                <div className="grid md:grid-cols-2 gap-8 mb-20">
                    <div className="card bg-base-200 shadow-lg">
                        <div className="card-body">
                            <div className="flex items-center gap-3 mb-2">
                                <FaIndustry className="text-3xl text-primary" />
                                <h2 className="card-title text-2xl">Our Mission</h2>
                            </div>
                            <p className="text-base-content/70">
                                To simplify garments production by digitizing order workflows,
                                reducing delays, and providing real-time tracking from order
                                placement to final delivery.
                            </p>
                        </div>
                    </div>

                    <div className="card bg-base-200 shadow-lg">
                        <div className="card-body">
                            <div className="flex items-center gap-3 mb-2">
                                <FaChartLine className="text-3xl text-primary" />
                                <h2 className="card-title text-2xl">Our Vision</h2>
                            </div>
                            <p className="text-base-content/70">
                                To become a trusted digital platform for garments businesses,
                                enabling smarter decisions, faster production, and scalable
                                growth through technology.
                            </p>
                        </div>
                    </div>
                </div>

                {/* What We Do */}
                <div className="mb-20">
                    <h2 className="text-3xl font-bold text-center mb-10">
                        What We Do
                    </h2>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="card bg-base-200 shadow hover:shadow-xl transition">
                            <div className="card-body items-center text-center">
                                <FaClipboardList className="text-4xl text-secondary mb-3" />
                                <h3 className="card-title">Order Management</h3>
                                <p className="text-sm text-base-content/70">
                                    Create, update, and track garment orders with full visibility.
                                </p>
                            </div>
                        </div>

                        <div className="card bg-base-200 shadow hover:shadow-xl transition">
                            <div className="card-body items-center text-center">
                                <FaClock className="text-4xl text-secondary mb-3" />
                                <h3 className="card-title">Production Tracking</h3>
                                <p className="text-sm text-base-content/70">
                                    Track order status through each production stage in real time.
                                </p>
                            </div>
                        </div>

                        <div className="card bg-base-200 shadow hover:shadow-xl transition">
                            <div className="card-body items-center text-center">
                                <FaUsersCog className="text-4xl text-secondary mb-3" />
                                <h3 className="card-title">Role-Based Dashboard</h3>
                                <p className="text-sm text-base-content/70">
                                    Separate dashboards for buyers, managers, and admins.
                                </p>
                            </div>
                        </div>

                        <div className="card bg-base-200 shadow hover:shadow-xl transition">
                            <div className="card-body items-center text-center">
                                <FaShieldAlt className="text-4xl text-secondary mb-3" />
                                <h3 className="card-title">Secure System</h3>
                                <p className="text-sm text-base-content/70">
                                    Secure access control and protected data management.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Why Choose Us */}
                <div className="card bg-base-200 shadow-lg mb-20">
                    <div className="card-body">
                        <h2 className="card-title text-3xl justify-center mb-6">
                            Why Choose Our Platform?
                        </h2>

                        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 text-base-content/80">
                            <p>✔ Real-time order visibility</p>
                            <p>✔ Reduced manual errors</p>
                            <p>✔ Faster production workflow</p>
                            <p>✔ Clear communication between roles</p>
                            <p>✔ Scalable for growing factories</p>
                            <p>✔ Modern and user-friendly UI</p>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center">
                    <h2 className="text-3xl font-bold mb-4">
                        Built for the Garments Industry
                    </h2>
                    <p className="text-base-content/70 max-w-2xl mx-auto">
                        Our system connects buyers, managers, and administrators on a
                        single platform to ensure smooth production and on-time delivery.
                    </p>
                </div>

            </div>
        </section>
    );
}