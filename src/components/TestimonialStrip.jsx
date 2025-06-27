import React from 'react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    name: 'Megan T., Paramedic Instructor',
    quote: 'EMSForge has made tracking student progress seamless. The dashboards are intuitive and my students love the visual feedback.'
  },
  {
    name: 'Jason R., AEMT Student',
    quote: 'Logging my skills and seeing my milestones helps me stay motivated. I don’t know how I did it before this.'
  },
  {
    name: 'Lt. Bryan M., Clinical Coordinator',
    quote: 'Being able to review evaluations, rotations, and export reports in seconds has changed how I manage my program.'
  },
  {
    name: 'Sara K., EMT Program Director',
    quote: 'EMSForge has elevated our program’s professionalism. Reporting and compliance are now stress-free.'
  },
  {
    name: 'Derek L., Field Preceptor',
    quote: 'I can provide real-time feedback on student calls without chasing down paper logs. Huge time saver.'
  },
  {
    name: 'Emily C., Paramedic Student',
    quote: 'The skill streak tracker keeps me focused and competitive with my classmates. It’s brilliant.'
  },
  {
    name: 'Chief Don H., EMS Chief',
    quote: 'Finally, a system that actually fits EMS. Clean interface, fast reports, and phenomenal support.'
  },
  {
    name: 'Angela P., Program Accreditation Lead',
    quote: 'Our last site visit was smooth thanks to EMSForge. Everything the evaluators needed was a click away.'
  }
];

export default function TestimonialStrip() {
  return (
    <section className="bg-blue-50 dark:bg-blue-900 py-16 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          className="text-3xl font-bold text-blue-700 dark:text-blue-200 text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          What EMS Professionals Are Saying
        </motion.h2>

        {/* Scrolling marquee container */}
        <div className="relative">
          <motion.div
            className="flex gap-6 animate-slide"
            initial={{ x: 0 }}
            animate={{ x: ['0%', '-50%'] }}
            transition={{
              duration: 30,
              ease: 'linear',
              repeat: Infinity
            }}
          >
            {[...testimonials, ...testimonials].map((t, i) => (
              <div
                key={i}
                className="min-w-[300px] max-w-xs bg-white dark:bg-gray-800 p-5 rounded-lg shadow border border-gray-200 dark:border-gray-700"
              >
                <p className="text-gray-700 dark:text-gray-300 italic mb-3">“{t.quote}”</p>
                <h4 className="text-sm font-semibold text-blue-600 dark:text-blue-300">{t.name}</h4>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
