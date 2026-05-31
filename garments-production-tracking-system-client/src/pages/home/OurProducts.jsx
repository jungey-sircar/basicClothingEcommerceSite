import { motion } from "motion/react";
import Card from "../../components/products/Card";
import useAxios from "../../hooks/useAxios";
import { useQuery } from "@tanstack/react-query";

export default function OurProducts() {
    const axios = useAxios();
    // data fetch using tanstack query
    const { data: products = [], isLoading } = useQuery({
        queryKey: ['products', 'featured-products'],
        queryFn: async () => {
            const response = await axios.get('/api/products?featured=true&limit=8');
            return response.data.products;
        }
    });
    return (
        <section className="p-4 py-10">
            {/* Section header */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mb-8 text-center"
            >
                <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                    Our <span className="text-indigo-400">Produts</span>
                </h2>
                <p className="mx-auto max-w-2xl text-slate-400">
                    A simple and transparent workflow that connects buyers, managers, and
                    production teams from order to delivery.
                </p>
            </motion.div>
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 min-h-[400px]">
                {
                    isLoading ? <span className="loading loading-spinner loading-lg col-span-full mx-auto mt-10"></span> : products.length > 0 ? products.map(product => <Card key={product._id} product={product} />) : <p className="col-span-full mx-auto mt-10 text-xl md:text-2xl text-red-500">Opps! Products is not available right now</p>
                }
            </section>
        </section>
    );
}