// components/MobilePreview.jsx
import React from 'react';
import { motion } from 'framer-motion';
import phone from '../assets/mobile-mockup.png';

export default function MobilePreview() {
  return (
    <section className="bg-white dark:bg-black py-20 px-6 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
        <motion.div
          className="flex-1"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Track Anywhere, Anytime</h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">
            EMSForge works flawlessly across devices — optimized for smartphones, tablets, laptops, and desktops.
            Log skills on the go, receive real-time feedback, and sync data instantly.
          </p>
          <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
            <li>100% mobile-friendly UX</li>
            <li>PWA installable (like an app)</li>
            <li>Offline-ready logging (coming soon)</li>
          </ul>
        </motion.div>

        <motion.div
          className="flex-1 text-center"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <img
            src={phone}
            alt="EMSForge on mobile"
            className="w-full max-w-xs mx-auto rounded-xl shadow-lg border border-gray-300 dark:border-gray-700"
            loading="lazy"
          />
        </motion.div>
      </div>
    </section>
  );
}
