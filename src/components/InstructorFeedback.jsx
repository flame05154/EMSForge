// InstructorFeedback.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';

function InstructorFeedback({ userId }) {
  const [feedback, setFeedback] = useState([]);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    if (!userId) return;
    axios
      .get(`http://165.140.156.98:5000/api/evaluations/${userId}`)
      .then((res) => setFeedback(res.data))
      .catch((err) => console.error('❌ Feedback fetch failed:', err));
  }, [userId]);

  return (
    <div className="bg-gray-800 p-6 mt-8 rounded-xl">
      <h3 className="text-md font-semibold mb-4">👩‍🏫 Instructor & Preceptor Feedback</h3>
      {feedback.length === 0 ? (
        <p className="text-gray-400 text-sm">No feedback available yet.</p>
      ) : (
        <ul className="divide-y divide-gray-700">
          {feedback.map((item, idx) => (
            <li
              key={idx}
              className="py-3 cursor-pointer hover:bg-gray-700 px-2 rounded"
              onClick={() => setExpanded(expanded === idx ? null : idx)}
            >
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-200">
                  {item.type} — <span className="italic text-gray-400">{new Date(item.created_at).toLocaleDateString()}</span>
                </span>
                <span className="text-green-400 text-xs">{item.result}</span>
              </div>
              {expanded === idx && (
                <div className="mt-2 text-sm text-gray-300">
                  <p className="mb-1"><strong>Instructor:</strong> {item.instructor || 'N/A'}</p>
                  <p>{item.comments || 'No detailed comments provided.'}</p>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default InstructorFeedback;