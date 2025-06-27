import { useEffect, useState } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title } from 'chart.js';
import { Line, Bar, Pie, Radar } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import { saveAs } from 'file-saver';
import * as Papa from 'papaparse';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title);

function Reports() {
  const [skills, setSkills] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [filter, setFilter] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (user?.id) {
      axios.get(`http://165.140.156.98:5000/api/skills/all/${user.id}`)
        .then(res => setSkills(res.data))
        .catch(() => console.error("Failed to fetch skills"));

      axios.get(`http://165.140.156.98:5000/api/evaluations/${user.id}`)
        .then(res => setEvaluations(res.data))
        .catch(() => console.error("Failed to fetch evaluations"));
    }
  }, [user]);

  const filteredSkills = skills.filter(skill => {
    const matchesType = filter === '' || skill.skill === filter;
    const matchesDate =
      (!dateRange.start || new Date(skill.created_at) >= new Date(dateRange.start)) &&
      (!dateRange.end || new Date(skill.created_at) <= new Date(dateRange.end));
    return matchesType && matchesDate;
  });

  const totalSkills = skills.length;
  const streak = calculateStreak(skills);
  const thisWeekCount = skills.filter(skill => {
    const now = new Date();
    const skillDate = new Date(skill.created_at);
    return (now - skillDate) / (1000 * 60 * 60 * 24) <= 7;
  }).length;

  function calculateStreak(data) {
    const dates = [...new Set(data.map(s => new Date(s.created_at).toDateString()))]
      .sort((a, b) => new Date(b) - new Date(a));

    let streak = 0;
    let current = new Date().toDateString();
    for (const date of dates) {
      if (date === current) {
        streak++;
        current = new Date(new Date(current).setDate(new Date(current).getDate() - 1)).toDateString();
      } else break;
    }
    return streak;
  }

  const chartColors = ['#f43f5e', '#3b82f6', '#10b981', '#f59e0b', '#6366f1'];

  const skillTypeTotals = skills.reduce((acc, cur) => {
    acc[cur.skill] = (acc[cur.skill] || 0) + 1;
    return acc;
  }, {});

  const pieData = {
    labels: Object.keys(skillTypeTotals),
    datasets: [{
      data: Object.values(skillTypeTotals),
      backgroundColor: chartColors
    }]
  };

  const lineData = {
    labels: skills.map(s => new Date(s.created_at).toLocaleDateString()),
    datasets: [{
      label: 'Skills Logged',
      data: skills.map((_, i) => i + 1),
      fill: true,
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59,130,246,0.2)'
    }]
  };

  const exportCSV = () => {
    const csv = Papa.unparse(filteredSkills);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `skills_report_${new Date().toISOString()}.csv`);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    filteredSkills.forEach((s, i) => {
      doc.text(`${i + 1}. ${s.skill} | ${s.age} | ${s.gender} | ${s.status} | Confidence: ${s.confidence}`, 10, 10 + i * 10);
    });
    doc.save(`Skill_Report_${user?.name || "student"}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold text-blue-500 mb-4">📈 EMSForge Skill Reports</h1>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="bg-gray-800 text-white p-2 rounded">
          <option value="">All Skills</option>
          {[...new Set(skills.map(s => s.skill))].map((s, i) => (
            <option key={i} value={s}>{s}</option>
          ))}
        </select>
        <input type="date" className="bg-gray-800 p-2 rounded" onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))} />
        <input type="date" className="bg-gray-800 p-2 rounded" onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))} />
        <button onClick={exportCSV} className="bg-green-600 px-4 py-2 rounded hover:bg-green-700">Export CSV</button>
        <button onClick={exportPDF} className="bg-purple-600 px-4 py-2 rounded hover:bg-purple-700">Export PDF</button>
      </div>

      {/* Summary Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
        <div className="bg-gray-800 p-4 rounded-xl">
          <p className="text-gray-400">Total Skills Logged</p>
          <h3 className="text-2xl font-bold">{totalSkills}</h3>
        </div>
        <div className="bg-gray-800 p-4 rounded-xl">
          <p className="text-gray-400">Skills This Week</p>
          <h3 className="text-2xl font-bold">{thisWeekCount}</h3>
        </div>
        <div className="bg-gray-800 p-4 rounded-xl">
          <p className="text-gray-400">Streak (days)</p>
          <h3 className="text-2xl font-bold">🔥 {streak}</h3>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-800 p-4 rounded-xl">
          <h3 className="text-md font-semibold mb-3">Skill Distribution</h3>
          <Pie data={pieData} />
        </div>
        <div className="bg-gray-800 p-4 rounded-xl">
          <h3 className="text-md font-semibold mb-3">Skill Logging Over Time</h3>
          <Line data={lineData} />
        </div>
      </div>

      {/* Skill Table */}
      <div className="bg-gray-800 p-4 rounded-xl overflow-x-auto">
        <h3 className="text-md font-semibold mb-3">📋 Interactive Skill Log</h3>
        <table className="min-w-full text-sm">
          <thead className="text-left text-gray-400 border-b border-gray-600">
            <tr>
              <th className="py-2">Date</th>
              <th>Skill</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Confidence</th>
              <th>Attempts</th>
              <th>Status</th>
              <th>Disposition</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {filteredSkills.map((s, i) => (
              <tr key={i} className="border-b border-gray-700 hover:bg-gray-700">
                <td className="py-2">{new Date(s.created_at).toLocaleDateString()}</td>
                <td>{s.skill}</td>
                <td>{s.age}</td>
                <td>{s.gender}</td>
                <td>{s.confidence}</td>
                <td>{s.attempts}</td>
                <td>{s.status}</td>
                <td>{s.disposition}</td>
                <td className="max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">{s.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Evaluation Feedback (Basic Display) */}
      <div className="mt-8 bg-gray-800 p-4 rounded-xl">
        <h3 className="text-md font-semibold mb-3">🧠 Evaluations & Instructor Feedback</h3>
        {evaluations.length === 0 ? (
          <p className="text-gray-400">No evaluations submitted yet.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {evaluations.map((e, i) => (
              <li key={i} className="border-b border-gray-700 pb-2">
                <p><strong>{e.skill}</strong> – {e.result}</p>
                <p className="text-gray-400">{e.comment}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Reports;
