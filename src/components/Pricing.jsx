import React, { useEffect, useState } from 'react';

export default function Pricing() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPricing = async () => {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
      const EMS_FORGE_PLAN_IDS = [
        'prod_ST6zmOToR8ZErr', // Employer
        'prod_ST6txSKux0KecX', // Enterprise
        'prod_ST6qvbt2kIaist', // Pro
        'prod_ST6qKa60k7g9rM', // Basic
      ];

      try {
        const res = await fetch(`${API_URL}/api/pricing`);
        if (!res.ok) throw new Error('Failed to load pricing');
        const data = await res.json();

        // Filter only EMS Forge plans
        const filtered = data.filter(plan => EMS_FORGE_PLAN_IDS.includes(plan.id));
        setPlans(filtered);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPricing();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg text-gray-600 dark:text-gray-300">
        Loading pricing...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16 px-6 text-gray-800 dark:text-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center mb-10">EMS Forge Pricing</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-6 border border-gray-200 dark:border-gray-700 transition-transform transform hover:scale-105"
            >
              <h2 className="text-2xl font-semibold mb-2">{plan.product}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {plan.description || 'No description available'}
              </p>

              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                ${plan.unit_amount}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {plan.recurring ? `Billed ${plan.recurring}` : 'One-time fee'}
              </p>

              {plan.tiers_mode && (
                <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded text-sm">
                  <p className="font-semibold">Tiered Pricing</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Pricing varies by quantity</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
