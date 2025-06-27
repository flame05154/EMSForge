// PeerEvaluation.jsx
import { useState } from 'react';

const peerOptions = [
  'Airway Management',
  'IV Insertion',
  'CPR Performance',
  'Scene Communication',
  'Patient Assessment',
];

function PeerEvaluation({ onSubmit }) {
  const [formData, setFormData] = useState({ peerName: '', feedback: {}, comments: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleFeedbackChange = (skill, rating) => {
    setFormData(prev => ({
      ...prev,
      feedback: { ...prev.feedback, [skill]: rating }
    }));
  };

  const handleSubmit = () => {
    if (!formData.peerName || Object.keys(formData.feedback).length === 0) {
      return alert('Please complete the form.');
    }
    if (onSubmit) onSubmit(formData);
    setSubmitted(true);
    console.log('✅ Peer Evaluation Submitted:', formData);
  };

  return (
    <div className="bg-gray-800 p-6 mt-8 rounded-xl">
      <h3 className="text-md font-semibold mb-4">🧪 Peer Evaluation</h3>

      <div className="mb-4">
        <label className="block text-sm mb-1 text-gray-300">Peer's Name:</label>
        <input
          type="text"
          value={formData.peerName}
          onChange={e => setFormData({ ...formData, peerName: e.target.value })}
          className="w-full px-3 py-1 bg-gray-700 rounded text-white text-sm"
          placeholder="John Smith"
        />
      </div>

      {peerOptions.map((skill, idx) => (
        <div key={idx} className="flex items-center justify-between mb-3">
          <label className="text-sm text-gray-300 w-1/2">{skill}</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(rating => (
              <button
                type="button"
                key={rating}
                onClick={() => handleFeedbackChange(skill, rating)}
                className={`px-3 py-1 text-sm rounded border ${formData.feedback[skill] === rating ? 'bg-green-500 border-green-500 text-white' : 'border-gray-600 text-gray-300'}`}
              >
                {rating}
              </button>
            ))}
          </div>
        </div>
      ))}

      <div className="mb-4">
        <label className="block text-sm mb-1 text-gray-300">Comments:</label>
        <textarea
          rows="3"
          value={formData.comments}
          onChange={e => setFormData({ ...formData, comments: e.target.value })}
          className="w-full px-3 py-2 bg-gray-700 rounded text-white text-sm"
        ></textarea>
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={submitted}
        className="bg-green-600 hover:bg-green-700 px-4 py-2 text-sm rounded"
      >
        {submitted ? '✓ Submitted' : 'Submit Evaluation'}
      </button>
    </div>
  );
}

export default PeerEvaluation;
