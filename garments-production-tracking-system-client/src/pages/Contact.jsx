import toast from "react-hot-toast";
import {
    FaEnvelope,
    FaPhoneAlt,
    FaMapMarkerAlt,
    FaPaperPlane
} from "react-icons/fa";

export default function ContactUs() {
    const handleSubmit = (e) => {
        e.preventDefault();
        toast.success('feature is coming soon...');
        e.target.reset();
    }
    return (
        <section className="min-h-screen bg-base-100 py-10 px-4">
            <title>Contact Us | Smart Garments</title>
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                        Contact <span className="text-indigo-400">Us</span>
                    </h2>
                    <p className="mx-auto max-w-md text-slate-400">
                        Have questions about orders, production, or our platform? Reach out to us — we're here to help.
                    </p>
                </div>

                {/* Content */}
                <div className="grid md:grid-cols-2 gap-10">

                    {/* Contact Info */}
                    <div className="space-y-6">
                        <div className="card bg-base-200 shadow-lg">
                            <div className="card-body">
                                <div className="flex items-center gap-4">
                                    <FaEnvelope className="text-3xl text-primary" />
                                    <div>
                                        <h3 className="text-xl font-semibold">Email</h3>
                                        <p className="text-base-content/70">
                                            support@garments-system.com
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card bg-base-200 shadow-lg">
                            <div className="card-body">
                                <div className="flex items-center gap-4">
                                    <FaPhoneAlt className="text-3xl text-primary" />
                                    <div>
                                        <h3 className="text-xl font-semibold">Phone</h3>
                                        <p className="text-base-content/70">
                                            +880 0123456789
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card bg-base-200 shadow-lg">
                            <div className="card-body">
                                <div className="flex items-center gap-4">
                                    <FaMapMarkerAlt className="text-3xl text-primary" />
                                    <div>
                                        <h3 className="text-xl font-semibold">Office Address</h3>
                                        <p className="text-base-content/70">
                                            Industrial Area, Sylhet, Bangladesh
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="card bg-base-200 shadow-lg">
                        <div className="card-body">
                            <h2 className="card-title text-2xl mb-4">
                                Send Us a Message
                            </h2>

                            <form className="space-y-4" onSubmit={handleSubmit}>
                                <div>
                                    <label className="label">
                                        <span className="label-text">Full Name</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Your name"
                                        className="input input-bordered w-full"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="label">
                                        <span className="label-text">Email Address</span>
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="your@email.com"
                                        className="input input-bordered w-full"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="label">
                                        <span className="label-text">Message</span>
                                    </label>
                                    <textarea
                                        className="textarea textarea-bordered w-full"
                                        placeholder="Write your message here..."
                                        rows={5}
                                        required
                                    ></textarea>
                                </div>

                                <button className="btn btn-primary w-full">
                                    <FaPaperPlane />
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </div>

                </div>

            </div>
        </section>
    );
}