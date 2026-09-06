import React from 'react';

const faqs = [
    {
        question: "Do you deliver pizza in Newark, DE?",
        answer: "Yes, Raggio Gourmet Pizza offers fast and reliable delivery throughout Newark, Delaware. We deliver to residential neighborhoods, local businesses, and directly to the University of Delaware (UD) campus. You can easily order online or call us at (302) 369-0553."
    },
    {
        question: "What are your most popular menu items?",
        answer: "Our customers highly rate our Artisanal Pepperoni Pizza, the classic Meat Lovers Sicilian, and our signature Philly Cheesesteak Pizza. Beyond pizza, we are a local favorite for fresh, made-to-order cheesesteaks, jumbo wings, and complete pasta dinners."
    },
    {
        question: "Do you cater events or large parties in Newark?",
        answer: "Yes, we provide catering for events of all sizes. We can accommodate large bulk orders for UD tailgates, corporate lunches, office meetings, and family gatherings with our XL pizzas, wing platters, and hot sandwiches."
    },
    {
        question: "How do I order online from Raggio Gourmet Pizza?",
        answer: "You can place an order directly through our website for instant pickup or delivery. Please note that our secure online checkout is processed through our sister-system, Philly Style Express, so you are in the right place when you click to order!"
    },
    {
        question: "What are your current pizza specials?",
        answer: "We offer daily combo deals, including large one-topping pizzas paired with wings, family combo meals, and instant discount coupons on orders over $40. Check our Deals & Specials tab to add today's active offers directly to your cart."
    }
];

export default function FAQ() {
    // Generate Google Schema JSON-LD for Rich Snippets
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map((faq) => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer,
            },
        })),
    };

    return (
        <section className="py-16 md:py-24 bg-ink border-t border-panel-border" aria-labelledby="faq-heading">
            {/* Injecting the Schema JSON into the DOM for Search Engines */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />

            <div className="max-w-4xl mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 id="faq-heading" className="text-3xl md:text-4xl font-extrabold text-cream mb-4">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-cream/70 text-lg">
                        Everything you need to know about ordering, delivery, and catering in Newark.
                    </p>
                </div>

                <div className="space-y-6">
                    {faqs.map((faq, index) => (
                        <div key={index} className="bg-black/40 border border-white/5 rounded-xl p-6 hover:border-gold/30 transition-colors">
                            <h3 className="text-xl font-bold text-gold-bright mb-3">
                                {faq.question}
                            </h3>
                            <p className="text-cream/90 leading-relaxed">
                                {faq.answer}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}