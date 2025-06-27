import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  CheckCircle,
  LayoutDashboard,
  CalendarCheck2,
  FileText,
  Lock,
  Users,
} from 'lucide-react';
import noteTakingBg from '../assets/notetaking.jpeg';

export default function WhyEMSForge() {
  const { scrollYProgress } = useScroll();
  const parallaxY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  const reasons = [
    {
      title: 'Built by EMS for EMS',
      desc: 'Real-world workflows built by medics who understand the challenges of documentation, QA, and clinical education.',
      icon: <Users className="w-6 h-6 text-blue-400 mb-2" />,
    },
    {
      title: 'All-in-One Tracking Suite',
      desc: 'From skills to evaluations to peer review — EMSForge eliminates the need for multiple apps or spreadsheets.',
      icon: <LayoutDashboard className="w-6 h-6 text-blue-400 mb-2" />,
    },
    {
      title: 'CoAEMSP-Compatible Reports',
      desc: 'Instantly export reports that align with program accreditation standards and state licensure criteria.',
      icon: <FileText className="w-6 h-6 text-blue-400 mb-2" />,
    },
  ];

  const features = [
    { title: 'Skill Logging', icon: <CheckCircle className="w-8 h-8 text-blue-400" /> },
    { title: 'Instructor Feedback', icon: <Users className="w-8 h-8 text-blue-400" /> },
    { title: 'Dashboards', icon: <LayoutDashboard className="w-8 h-8 text-blue-400" /> },
    { title: 'Cert Reports', icon: <FileText className="w-8 h-8 text-blue-400" /> },
    { title: 'Shift Scheduling', icon: <CalendarCheck2 className="w-8 h-8 text-blue-400" /> },
    { title: 'HIPAA Secure', icon: <Lock className="w-8 h-8 text-blue-400" /> },
  ];

  return (
    <section className="relative py-20 px-6 overflow-hidden">
      {/* Background Layer */}
      <motion.div className="absolute inset-0" style={{ y: parallaxY }}>
        <img
          src={noteTakingBg}
          alt="Note Taking Background"
          className="w-full h-full object-cover opacity-50 blur-sm"
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      </motion.div>

      {/* Floating Icons */}
      <div className="absolute inset-0 pointer-events-none">
        {[Users, FileText, Lock, CalendarCheck2].map((Icon, i) => (
          <motion.div
            key={i}
            className="absolute text-blue-500/10"
            style={{ top: `${20 + i * 15}%`, left: `${15 + i * 20}%` }}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4 + i, repeat: Infinity }}
          >
            <Icon className="w-16 h-16" />
          </motion.div>
        ))}
      </div>

      {/* Content Layer */}
      <div className="relative z-10 max-w-6xl mx-auto text-white">
        {/* Section Title */}
        <motion.h2
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-center mb-12 bg-gradient-to-r from-[#2d388a] to-[#00aeef] text-transparent bg-clip-text drop-shadow-2xl"
  initial={{ opacity: 0, y: 40, scale: 0.95 }}
  whileInView={{ opacity: 1, y: 0, scale: 1 }}
  viewport={{ once: true }}
  transition={{ duration: 0.8, ease: 'easeOut' }}
>
          Why EMSForge?
        </motion.h2>

        {/* Core Reasons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {reasons.map((item, i) => (
            <motion.div
              key={i}
              className="bg-white/10 backdrop-blur-md p-6 rounded-xl text-center hover:shadow-xl hover:scale-105 transition-all"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
            >
              <div className="flex justify-center">{item.icon}</div>
              <h3 className="text-lg font-semibold mb-2 bg-gradient-to-r from-[#2d388a] to-[#ff00d4] text-transparent bg-clip-text inline-block">
                {item.title}
              </h3>
              <p className="text-sm text-white/90">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Feature Tiles */}
        <motion.section
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {features.map((feature, i) => (
            <motion.div
              key={i}
              className="bg-white/10 backdrop-blur-md p-6 rounded-xl text-center hover:shadow-xl hover:scale-105 transition-all"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 200, damping: 12 }}
            >
              <div className="flex justify-center">{feature.icon}</div>
              <h3 className="text-lg font-semibold mb-2 bg-gradient-to-r from-[#2d388a] to-[#ff00d4] text-transparent bg-clip-text inline-block">
                {feature.title}
              </h3>
              <p className="text-sm text-white/90">
                Powerful {feature.title.toLowerCase()} designed to exceed national standards.
              </p>
            </motion.div>
          ))}
        </motion.section>
      </div>
    </section>
  );
}
