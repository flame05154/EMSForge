import React from 'react';
import { motion } from 'framer-motion';

export default function Comparison() {
  const competitors = [
    { name: 'Competitor A', data: ['✔', '✔', '—', '✔', '—', '—'] },
    { name: 'Competitor B', data: ['✔', '—', '—', '✔', '—', '✔'] },
    { name: 'Traditional Tools', data: ['—', '—', '—', '—', '—', '—'] }
  ];

  const features = [
    'Skill Logging',
    'Instructor Feedback',
    'Scheduling',
    'PDF Reports',
    'HIPAA Secure',
    'Mobile UI'
  ];

  return (
    <motion.section
      className="max-w-6xl mx-auto px-6 mb-20"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <h2 className="text-3xl font-bold text-center mb-4">Competitor Breakdown</h2>
      <div className="overflow-auto">
        <table className="w-full text-sm border-collapse border">
          <thead className="bg-gray-200 dark:bg-gray-700">
            <tr>
              <th className="p-3 text-left">Feature</th>
              {competitors.map((comp, i) => (
                <th key={i} className="p-3 text-center">{comp.name}</th>
              ))}
              <th className="p-3 text-center text-blue-600 dark:text-blue-400 font-bold">EMSForge</th>
            </tr>
          </thead>
          <tbody>
            {features.map((feature, idx) => (
              <tr key={idx} className="border-t dark:border-gray-700">
                <td className="p-3 font-medium">{feature}</td>
                {competitors.map((comp, i) => (
                  <td key={i} className="p-3 text-center">{comp.data[idx]}</td>
                ))}
                <td className="p-3 text-center text-green-500 font-bold">✔</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.section>
  );
}
