import { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import ThemeSwitcher from '../components/ThemeSwitcher';
import { jsPDF } from 'jspdf';
import { Download, Filter } from 'lucide-react';

function InstructorReports() {
  const [reviews, setReviews] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeTab, setActiveTab] = useState('Pending');
  const [filters, setFilters] = useState({ skillType: '', student: '', date: '' });

  useEffect(() => {
    axios.get('http://165.140.156.98:5000/api/instructor/queue')
      .then(res => {
        setReviews(res.data);
        setFiltered(res.data);
      });
  }, []);

  const handleFilter = () => {
    let data = [...reviews];
    if (filters.skillType) data = data.filter(r => r.skill === filters.skillType);
    if (filters.student) data = data.filter(r => r.studentName.toLowerCase().includes(filters.student.toLowerCase()));
    if (filters.date) data = data.filter(r => new Date(r.created_at).toDateString().includes(filters.date));
    setFiltered(data);
  };

  const handleApprove = async (id) => {
    await axios.put(`http://165.140.156.98:5000/api/instructor/approve/${id}`);
    setFiltered(prev => prev.filter(r => r.id !== id));
  };

  const handleReject = async (id) => {
    await axios.put(`http://165.140.156.98:5000/api/instructor/reject/${id}`);
    setFiltered(prev => prev.filter(r => r.id !== id));
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    filtered.forEach((r, i) => {
      doc.text(`${i + 1}. ${r.studentName} | ${r.skill} | ${r.status} | Confidence: ${r.confidence}/5`, 10, 10 + (i * 10));
    });
    doc.save('Instructor_Review_Export.pdf');
  };

  const handleExportCSV = () => {
    const csv = [
      ['Student', 'Skill', 'Status', 'Confidence', 'Date'],
      ...filtered.map(r => [r.studentName, r.skill, r.status, r.confidence, new Date(r.created_at).toLocaleDateString()])
    ].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Instructor_Reviews.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex bg-gray-900 text-white min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-400">🧑‍🏫 Instructor Skill Review</h2>
          <ThemeSwitcher />
        </div>

        {/* Filter Controls */}
        <div className="bg-gray-800 p-4 rounded-xl mb-4 flex flex-wrap gap-4 items-center">
          <input type="text" placeholder="Student name" onChange={(e) => setFilters({ ...filters, student: e.target.value })} className="bg-gray-700 text-white px-3 py-2 rounded" />
          <input type="text" placeholder="Skill type" onChange={(e) => setFilters({ ...filters, skillType: e.target.value })} className="bg-gray-700 text-white px-3 py-2 rounded" />
          <input type="text" placeholder="Date (e.g., Mar 30)" onChange={(e) => setFilters({ ...filters, date: e.target.value })} className="bg-gray-700 text-white px-3 py-2 rounded" />
          <button onClick={handleFilter} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded flex items-center gap-2">
            <Filter size={16} /> Filter
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-4">
          {['Pending', 'Approved', 'Rejected'].map(tab => (
            <button
              key={tab}
              className={`px-4 py-2 rounded-full ${activeTab === tab ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Review List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.filter(r => r.status === activeTab).map(r => (
            <div key={r.id} className="bg-gray-800 p-4 rounded-xl">
              <h3 className="text-md font-bold mb-1">{r.studentName}</h3>
              <p className="text-sm text-gray-400 mb-1">Skill: <span className="text-white">{r.skill}</span></p>
              <p className="text-sm text-gray-400 mb-1">Confidence: {r.confidence}/5 | Attempts: {r.attempts}</p>
              <p className="text-sm text-gray-400 mb-2">Notes: {r.notes || '—'}</p>
              <textarea placeholder="Instructor Feedback..." className="w-full bg-gray-700 text-white rounded px-3 py-2 mb-2" />
              <div className="flex justify-end gap-2">
                <button onClick={() => handleReject(r.id)} className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded">❌ Reject</button>
                <button onClick={() => handleApprove(r.id)} className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded">✅ Approve</button>
              </div>
            </div>
          ))}
        </div>

        {/* Export Section */}
        <div className="mt-6 flex gap-4 justify-end">
          <button onClick={handleExportCSV} className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600 flex items-center gap-2">
            <Download size={16} /> CSV
          </button>
          <button onClick={handleExportPDF} className="bg-purple-700 px-4 py-2 rounded hover:bg-purple-800 flex items-center gap-2">
            📄 PDF
          </button>
        </div>
      </div>
    </div>
  );
}

export default InstructorReports;
