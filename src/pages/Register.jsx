import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName]   = useState('');
  const [email, setEmail]         = useState('');
  const [productId, setProductId] = useState('');
  const [products, setProducts]   = useState([]);
  const [loading, setLoading]     = useState(false);

  const API_BASE = import.meta.env.VITE_API_URL || 'https://emsforge.com/api';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_BASE}/pricing`);
        setProducts(res.data);
      } catch (err) {
        console.error('Error fetching products', err);
      }
    };
    fetchProducts();
  }, [API_BASE]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productId) return alert('Please select a plan');

    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/checkout/create-session`, {
        firstName,
        lastName,
        email,
        productId,
      });

      if (res.data?.url) {
        window.location.href = res.data.url;
      } else {
        alert('Failed to create Stripe session');
      }
    } catch (err) {
      console.error(err);
      alert('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-12 px-6">
      <h2 className="text-3xl font-bold text-center mb-6">Create Your EMSForge Account</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="w-full px-4 py-2 border rounded"
          required
        />

        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="w-full px-4 py-2 border rounded"
          required
        />

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded"
          required
        />

        <select
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          className="w-full px-4 py-2 border rounded"
          required
        >
          <option value="">Select Your Plan</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name} – {product.price} {product.currency.toUpperCase()} / {product.interval}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
          disabled={loading}
        >
          {loading ? 'Redirecting…' : 'Register & Checkout'}
        </button>
      </form>
    </div>
  );
}
