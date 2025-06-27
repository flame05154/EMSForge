import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import WhyEMSForge from '../components/WhyEMSForge';
import TestimonialStrip from '../components/TestimonialStrip';
import MobilePreview from '../components/MobilePreview';
import Pricing from '../components/Pricing';
import Comparison from '../components/Comparison';
import Faqs from '../components/Faqs';

export default function HomePage() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [loadVideo, setLoadVideo] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const timer = setTimeout(() => setLoadVideo(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-white text-black dark:bg-black dark:text-white font-sans transition-colors duration-500">
      <Helmet>
        <title>EMSForge | Clinical Skill Tracking for EMS Professionals</title>
        <meta name="description" content="EMSForge is the most powerful EMS skill tracking platform, built to outperform legacy tools." />
        <meta name="keywords" content="EMS, EMT, paramedic, skill tracker, healthcare education" />
      </Helmet>

      <div className="relative z-20">
        <div className="absolute top-4 right-4">
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="text-2xl" aria-label="Toggle Theme">
            {theme === 'dark' ? '🌙' : '☀️'}
          </button>
        </div>

        {/* Hero Section with Video Background */}
        <section className="relative overflow-hidden">
          {loadVideo && (
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-40 z-0"
            >
              <source src="/assets/EKGMovie.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}

          <div className="absolute inset-0 bg-black/60 z-0 backdrop-blur-sm" />

          <motion.main
            className="relative z-10 text-center py-20 px-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text animate-pulse drop-shadow-lg">EMSForge</span>
              <div className="text-xl font-light text-gray-400">Next-Gen EMS Education & Clinical Tracking</div>
            </h1>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto mt-6">
              Built by EMS, for EMS. Track skills, manage rotations, collect feedback, and generate reports — all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl shadow-xl text-lg">🚀 Get Started</Link>
              <Link to="/login" className="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-black dark:text-white px-8 py-3 rounded-xl shadow text-lg">🔐 Login</Link>
            </div>
          </motion.main>
        </section>

        <MobilePreview />
        <WhyEMSForge />

        {/* Feature Comparison Section */}
        <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
          <Comparison />
        </motion.section>

        {/* Pricing Section */}
        <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
          <Pricing />
        </motion.section>

        {/* FAQs */}
        <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
          <Faqs />
        </motion.section>

        {/* Testimonials */}
        <TestimonialStrip />

        {/* Footer */}
        <motion.footer className="bg-black/90 py-6 text-center text-gray-400 text-sm" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <p>&copy; {new Date().getFullYear()} EMSForge. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-2 text-xs">
            <Link to="/terms" className="px-4 py-1 rounded border border-blue-500 text-blue-400 hover:bg-blue-600 hover:text-white transition">Terms</Link>
            <Link to="/privacy" className="px-4 py-1 rounded border border-blue-500 text-blue-400 hover:bg-blue-600 hover:text-white transition">Privacy</Link>
            <Link to="/contact" className="px-4 py-1 rounded border border-blue-500 text-blue-400 hover:bg-blue-600 hover:text-white transition">Contact</Link>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}
