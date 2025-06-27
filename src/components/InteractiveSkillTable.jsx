// InteractiveSkillTable.jsx
import { useState } from 'react';

function InteractiveSkillTable({ skills }) {
  const [search, setSearch] = useState('');
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const skillsPerPage = 5;

  const filteredSkills = skills.filter(s =>
    s.patientName.toLowerCase().includes(search.toLowerCase()) ||
    s.skill.toLowerCase().includes(search.toLowerCase()) ||
    s.notes.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLastSkill = currentPage * skillsPerPage;
  const indexOfFirstSkill = indexOfLastSkill - skillsPerPage;
  const currentSkills = filteredSkills.slice(indexOfFirstSkill, indexOfLastSkill);

  const handleNext = () => {
    if (currentPage < Math.ceil(filteredSkills.length / skillsPerPage)) setCurrentPage(p => p + 1);
  };
  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(p => p - 1);
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-md font-semibold">📋 Skills Log</h3>
        <input
          type="text"
          placeholder="Search..."
          className="bg-gray-700 text-white text-sm px-3 py-1 rounded"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto text-sm">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-3 py-2 text-left text-gray-300">Patient</th>
              <th className="px-3 py-2 text-left text-gray-300">Skill</th>
              <th className="px-3 py-2 text-left text-gray-300">Date</th>
              <th className="px-3 py-2 text-left text-gray-300">Details</th>
            </tr>
          </thead>
          <tbody>
            {currentSkills.map((s, index) => (
              <tr key={index} className="hover:bg-gray-700">
                <td className="px-3 py-2">{s.patientName}</td>
                <td className="px-3 py-2">{s.skill}</td>
                <td className="px-3 py-2">{new Date(s.created_at).toLocaleDateString()}</td>
                <td className="px-3 py-2">
                  <button
                    onClick={() => setSelectedSkill(s)}
                    className="text-blue-400 hover:underline"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end gap-2 mt-3">
        <button onClick={handlePrev} disabled={currentPage === 1} className="px-3 py-1 bg-gray-700 rounded text-sm">Prev</button>
        <button onClick={handleNext} disabled={indexOfLastSkill >= filteredSkills.length} className="px-3 py-1 bg-gray-700 rounded text-sm">Next</button>
      </div>

      {/* Modal */}
      {selectedSkill && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-6 rounded-xl max-w-md w-full text-sm text-white relative">
            <button onClick={() => setSelectedSkill(null)} className="absolute top-2 right-3 text-gray-400 text-lg">✕</button>
            <h3 className="text-lg font-bold mb-3">Skill Details</h3>
            <p><strong>Patient:</strong> {selectedSkill.patientName}</p>
            <p><strong>Age:</strong> {selectedSkill.age}</p>
            <p><strong>Gender:</strong> {selectedSkill.gender}</p>
            <p><strong>Skill:</strong> {selectedSkill.skill}</p>
            <p><strong>Date:</strong> {new Date(selectedSkill.created_at).toLocaleString()}</p>
            <p><strong>Notes:</strong> {selectedSkill.notes}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default InteractiveSkillTable;
