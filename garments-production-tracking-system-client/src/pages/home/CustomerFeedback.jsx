import { motion } from "motion/react"
import { FaQuoteLeft, FaStar } from "react-icons/fa";
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
// import required modules
import { Autoplay, EffectCoverflow, Pagination } from 'swiper/modules';

const feedbacks = [
    {
        id: 1,
        name: "Ayesha Rahman",
        role: "Wholesale Buyer",
        rating: 5,
        comment: "This platform made bulk garment ordering extremely easy. The tracking system is transparent and reliable.",
    },
    {
        id: 2,
        name: "Tanvir Ahmed",
        role: "Factory Manager",
        rating: 4,
        comment: "Managing production stages and approvals is now smooth and well-organized. Saves us a lot of time.",
    },
    {
        id: 3,
        name: "Nusrat Jahan",
        role: "Retail Buyer",
        rating: 5,
        comment: "I love how I can track every step of my order. The UI is clean and very easy to use.",
    },
    {
        id: 4,
        name: "Nayem Ahmed",
        role: "Software Engineer",
        rating: 5,
        comment: "This platform made bulk garment ordering extremely easy. The tracking system is transparent and reliable.",
    },
    {
        id: 5,
        name: "Hajifa Jui",
        role: "Teacher",
        rating: 4,
        comment: "I love how I can track every step of my order. The UI is clean and very easy to use.",
    },
];

export default function CustomerFeedback() {
    return (
        <section className="py-2">
            <div className="mx-auto max-w-6xl px-6">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-10 text-center"
                >
                    <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                        Customer <span className="text-indigo-400">Feedback</span>
                    </h2>
                    <p className="mx-auto max-w-2xl text-slate-400">
                        Hear what buyers and managers say about using our garments order &
                        production tracking system.
                    </p>
                </motion.div>
                <Swiper
                    effect={'coverflow'}
                    grabCursor={true}
                    centeredSlides={true}
                    slidesPerView={1}
                    breakpoints={{
                        640: { slidesPerView: 1 },
                        768: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                    }}
                    loop={true}
                    coverflowEffect={{
                        rotate: 50,
                        stretch: 0,
                        depth: 100,
                        modifier: 1,
                        slideShadows: true,
                    }}
                    pagination={true}
                    autoplay={{
                        delay: 2500,
                        disableOnInteraction: false,
                    }}
                    modules={[Autoplay, EffectCoverflow, Pagination]}
                    className="mySwiper"
                >
                    {
                        feedbacks.map(feedback => <SwiperSlide key={feedback.id}>
                            <div className="rounded-2xl bg-slate-900 p-8 text-center text-white shadow-lg">
                                <FaQuoteLeft className="mx-auto mb-4 text-2xl text-indigo-400" />
                                <p className="mb-6 text-slate-300">
                                    “{feedback.comment}”
                                </p>
                                <div className="mb-3 flex justify-center gap-1 text-yellow-400">
                                    {[...Array(feedback.rating)].map((_, i) => (
                                        <FaStar key={i} />
                                    ))}
                                </div>
                                <h4 className="font-semibold">{feedback.name}</h4>
                                <p className="text-sm text-slate-400">{feedback.role}</p>
                            </div>
                        </SwiperSlide>)
                    }
                </Swiper>
            </div>
        </section>
    );
}