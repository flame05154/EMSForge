// SelfAssessment.jsx
import { useState } from 'react';

const skillCategories = [
  'Airway Management',
  'IV Access',
  'CPR/ACLS',
  'Medication Administration',
  'Patient Assessment – Adult',
  'Patient Assessment – Pediatric'
];

function SelfAssessment() {
  const [responses, setResponses] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (skill, value) => {
    setResponses(prev => ({ ...prev, [skill]: value }));
  };

  const handleSubmit = () => {
    console.log('🧠 Self-Assessment Submitted:', responses);
    setSubmitted(true);
    // TODO: POST to backend for tracking trends
  };

  return (
    <div className="bg-gray-800 p-6 mt-8 rounded-xl">
      <h3 className="text-md font-semibold mb-4">🧠 Self-Assessment</h3>
      <p className="text-sm text-gray-400 mb-4">Rate your confidence in each area (1 = Not confident, 5 = Very confident)</p>

      <form className="space-y-4">
        {skillCategories.map((skill, idx) => (
          <div key={idx} className="flex items-center justify-between">
            <label className="text-sm text-gray-300 w-64">{skill}</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(val => (
                <button
                  type="button"
                  key={val}
                  onClick={() => handleChange(skill, val)}
                  className={`px-3 py-1 rounded text-sm border ${responses[skill] === val ? 'bg-blue-500 border-blue-500 text-white' : 'border-gray-600 text-gray-300'}`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="pt-4">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitted}
            className="bg-green-600 px-4 py-2 text-sm rounded hover:bg-green-700 transition"
          >
            {submitted ? '✓ Submitted' : 'Submit Assessment'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default SelfAssessment;
