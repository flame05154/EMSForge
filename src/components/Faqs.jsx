import React from 'react';
import { motion } from 'framer-motion';

export default function Faqs() {
  const faqList = [
    {
      q: "How much is it?",
      a: "Checkout our pricing on this page for more information."
    },
    {
      q: "Can I use EMSForge on my phone?",
      a: "Absolutely. EMSForge is fully responsive and optimized for mobile browsers."
    },
    {
      q: "Is my data secure?",
      a: "Yes. We use HIPAA-compliant encryption, access control, and audit logs."
    },
    {
      q: "Can my program customize EMSForge?",
      a: "Yes. With Premium and Enterprise tiers, you can customize features, branding, and reports."
    },
    {
      q: "Do instructors get access too?",
      a: "Yes! Instructor dashboards are included for free with each program setup."
    },
    {
      q: "Can we import data from other platforms?",
      a: "Currently not at this time, however it is in development.  Stay tuned!"
    }
  ];

  return (
    <motion.section
      className="relative bg-cover bg-center bg-no-repeat py-20 px-6 mb-20"
      style={{ backgroundImage: `url(/assets/background.jpeg)` }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="bg-black/70 backdrop-blur-sm p-8 rounded-xl max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10 text-white">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {faqList.map((faq, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-md hover:shadow-xl transition">
              <h4 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2">{faq.q}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
