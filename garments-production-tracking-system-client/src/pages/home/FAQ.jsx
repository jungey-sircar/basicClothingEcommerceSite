import { FaQuestionCircle } from "react-icons/fa";

export default function FAQ() {
    return (
        <section className="bg-base-200 px-4 py-12 md:py-16 my-6 md:my-12 mx-4">
            <div className="containerr mx-auto">

                {/* Header */}
                <div className="text-center mb-10">
                    <div className="flex justify-center md:items-center gap-2">
                        <FaQuestionCircle className="text-primary text-4xl md:text-3xl" />
                        <h2 className="text-3xl font-bold md:text-4xl">
                            Frequently Asked <span className="text-indigo-400">Questions</span>
                        </h2>
                    </div>
                    <p className="text-gray-500 mt-2">
                        Everything you need to know about ordering, production, and delivery
                    </p>
                </div>

                {/* Accordion */}
                <div className="max-w-3xl mx-auto space-y-3">

                    <div className="collapse collapse-arrow bg-base-100 border border-base-300">
                        <input type="radio" name="faq-accordion" defaultChecked />
                        <div className="collapse-title font-semibold">
                            What is the minimum order quantity (MOQ)?
                        </div>
                        <div className="collapse-content text-sm text-gray-600">
                            MOQ varies by product type and fabric. You can find the minimum
                            order quantity mentioned clearly on each product details page.
                        </div>
                    </div>

                    <div className="collapse collapse-arrow bg-base-100 border border-base-300">
                        <input type="radio" name="faq-accordion" />
                        <div className="collapse-title font-semibold">
                            How does the order approval process work?
                        </div>
                        <div className="collapse-content text-sm text-gray-600">
                            After placing a bulk order, it is reviewed by our production
                            managers and admins for feasibility, pricing, and scheduling.
                        </div>
                    </div>

                    <div className="collapse collapse-arrow bg-base-100 border border-base-300">
                        <input type="radio" name="faq-accordion" />
                        <div className="collapse-title font-semibold">
                            Can I track my order status?
                        </div>
                        <div className="collapse-content text-sm text-gray-600">
                            Yes. You can track your order from your dashboard. Status updates
                            include pending, approved, in production, shipped, and delivered.
                        </div>
                    </div>

                    <div className="collapse collapse-arrow bg-base-100 border border-base-300">
                        <input type="radio" name="faq-accordion" />
                        <div className="collapse-title font-semibold">
                            Can I cancel my order after placing it?
                        </div>
                        <div className="collapse-content text-sm text-gray-600">
                            Orders can only be canceled while they are in the
                            <strong> pending</strong> state. Once production starts,
                            cancellation is not possible.
                        </div>
                    </div>

                    <div className="collapse collapse-arrow bg-base-100 border border-base-300">
                        <input type="radio" name="faq-accordion" />
                        <div className="collapse-title font-semibold">
                            Do you perform quality checks before delivery?
                        </div>
                        <div className="collapse-content text-sm text-gray-600">
                            Absolutely. Every order goes through a strict quality control (QC)
                            process before shipment to ensure it meets approved standards.
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}