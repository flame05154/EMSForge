// RotationCalendar.jsx
import { useState } from 'react';
import { format, parseISO } from 'date-fns';

const mockRotations = [
  { date: '2025-04-02', location: 'Emergency Dept, Springfield Hospital', time: '7am–3pm' },
  { date: '2025-04-05', location: 'Golden Cross EMS – Ride-along', time: '8am–6pm' },
  { date: '2025-04-09', location: 'DHMC – Cardiac Cath Lab', time: '9am–1pm' }
];

function RotationCalendar() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="bg-gray-800 p-6 mt-8 rounded-xl">
      <h3 className="text-md font-semibold mb-4">📅 Clinical Rotations</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockRotations.map((r, idx) => (
          <button
            key={idx}
            onClick={() => setSelected(r)}
            className="bg-gray-700 text-left p-4 rounded hover:bg-gray-600 transition"
          >
            <p className="font-bold text-blue-400">{format(parseISO(r.date), 'MMMM d, yyyy')}</p>
            <p className="text-sm">{r.location}</p>
            <p className="text-xs text-gray-400">{r.time}</p>
          </button>
        ))}
      </div>

      {selected && (
        <div className="mt-6 p-4 bg-gray-900 rounded-xl border border-gray-700">
          <h4 className="text-sm font-semibold mb-2">Selected Rotation</h4>
          <p><strong>Date:</strong> {format(parseISO(selected.date), 'MMMM d, yyyy')}</p>
          <p><strong>Location:</strong> {selected.location}</p>
          <p><strong>Time:</strong> {selected.time}</p>
          <button onClick={() => setSelected(null)} className="mt-2 text-sm text-blue-400 hover:underline">Close</button>
        </div>
      )}
    </div>
  );
}

export default RotationCalendar;