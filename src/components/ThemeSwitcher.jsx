// ThemeSwitcher.jsx
import { useEffect, useState } from 'react';

function ThemeSwitcher() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));

  return (
    <button
      onClick={toggleTheme}
      className="bg-gray-700 text-white text-xs px-3 py-1 rounded hover:bg-gray-600 transition"
    >
      Toggle {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
    </button>
  );
}

export default ThemeSwitcher;
