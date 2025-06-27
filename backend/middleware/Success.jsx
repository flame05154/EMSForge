import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Success() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // verifying | success | error
  const [retryCount, setRetryCount] = useState(0);

  const isValidSessionId = (id) => /^cs_(live|test)_[a-zA-Z0-9]+$/.test(id);

  const fetchSessionData = async (sessionId) => {
    try {
      toast.loading('Verifying your subscription...', { id: 'verify' });
      const res = await axios.get(`/api/checkout/session/${sessionId}`);
      const { token, user } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      toast.success('Subscription verified! Redirecting...', { id: 'verify' });
      setStatus('success');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      console.error('❌ Stripe session verification failed:', err);
      toast.error('Failed to verify payment. Please try again.', { id: 'verify' });
      setStatus('error');
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');

    if (sessionId && isValidSessionId(sessionId)) {
      console.log('🎫 Valid Stripe session_id:', sessionId);
      fetchSessionData(sessionId);
    } else {
      toast.error('Invalid or missing Stripe session ID.');
      setStatus('error');
    }
  }, [retryCount]);

  const handleRetry = () => {
    toast.dismiss();
    setStatus('verifying');
    setRetryCount((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 to-black text-white px-6 text-center">
      {status === 'verifying' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-4"
        >
          <div className="text-4xl font-bold">🔄 Verifying your payment...</div>
          <div className="text-sm opacity-70">Please wait while we set up your account.</div>
        </motion.div>
      )}

      {status === 'success' && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="text-4xl font-bold text-green-400">🎉 Subscription Verified!</div>
          <p className="text-sm opacity-80">You’re being redirected to your dashboard...</p>
        </motion.div>
      )}

      {status === 'error' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md text-center space-y-4"
        >
          <div className="text-3xl font-bold text-red-500">❌ Verification Failed</div>
          <p className="text-sm opacity-80">
            We couldn’t verify your payment. Please check your email or contact support.
          </p>
          <button
            onClick={handleRetry}
            className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition"
          >
            Retry
          </button>
        </motion.div>
      )}
    </div>
  );
}
