import { motion } from "motion/react";
import { FaShoppingBag, FaClipboardList, FaIndustry, FaTruck } from "react-icons/fa";

export default function Proccedures() {
    const steps = [
        {
            id: 1,
            title: "Browse Products",
            description: "Explore available garments with detailed specifications, pricing, and minimum order quantity.",
            icon: FaShoppingBag,
        },
        {
            id: 2,
            title: "Place Order",
            description: "Submit your order request with quantity, delivery address, and payment preference.",
            icon: FaClipboardList,
        },
        {
            id: 3,
            title: "Production Process",
            description: "Managers handle cutting, sewing, finishing, and quality checks in real time.",
            icon: FaIndustry,
        },
        {
            id: 4,
            title: "Track & Receive",
            description: "Track your order status step-by-step until it is shipped and delivered.",
            icon: FaTruck,
        },
    ];
    return (
        <section className="py-16">
            <div className="mx-auto max-w-7xl px-6">
                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-16 text-center"
                >
                    <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                        How It <span className="text-indigo-400">Works</span>
                    </h2>
                    <p className="mx-auto max-w-2xl text-slate-400">
                        A simple and transparent workflow that connects buyers, managers, and
                        production teams from order to delivery.
                    </p>
                </motion.div>
                {/* Steps grid */}
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        return (
                            <motion.div
                                key={step.id}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.12 }}
                                whileHover={{ y: -6 }}
                                className="group relative rounded-2xl border border-white/10 bg-base-200 p-6 text-center"
                            >
                                {/* Step number */}
                                <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-indigo-100 px-4 py-1 text-sm font-semibold text-neutral">
                                    Step {step.id}
                                </span>
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400"
                                >
                                    <Icon size={26} />
                                </motion.div>
                                <h3 className="mb-3 text-lg font-semibold">
                                    {step.title}
                                </h3>
                                <p className="text-sm">{step.description}</p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}