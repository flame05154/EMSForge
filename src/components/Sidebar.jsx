import { useState } from 'react';
import { Home, LogOut, FileText, Menu, X, ClipboardList } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, NavLink } from 'react-router-dom';
function Sidebar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <Home size={18} /> },
    { name: 'Log Skill', path: '/log-skill', icon: <FileText size={18} /> },
    { name: 'Reports', path: '/reports', icon: <FileText size={18} /> },
    { name: 'Patient Reports', path: '/patient-reports', icon: <ClipboardList size={18} /> },
  ];

  return (
    <div className="md:w-64 w-full md:relative z-50">
      {/* Mobile Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-900 text-white md:hidden shadow">
        <div className="text-lg font-semibold">🚑 EMSForge</div>
        <button onClick={toggleSidebar} className="focus:outline-none">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <AnimatePresence>
        {(isOpen || window.innerWidth >= 768) && (
          <motion.aside
            key="sidebar"
            initial={{ x: -250 }}
            animate={{ x: 0 }}
            exit={{ x: -250 }}
            transition={{ type: 'spring', stiffness: 200, damping: 30 }}
            className="md:static fixed inset-y-0 left-0 w-64 bg-gray-950 text-white shadow-xl md:translate-x-0 transform z-40"
          >
            <div className="p-5 border-b border-gray-800 text-xl font-bold">EMSForge</div>
            <nav className="flex flex-col gap-2 px-4 py-6">
              {navItems.map(item => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                    location.pathname === item.path ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              ))}

              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.href = '/';
                }}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition-all"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Sidebar;
