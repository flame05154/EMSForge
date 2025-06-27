import React from 'react';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';

function StudentSkillRowModal({ isOpen, onClose, skill }) {
  if (!skill) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
      <div className="bg-gray-900 text-white rounded-lg p-6 w-full max-w-2xl z-50 shadow-lg border border-gray-700 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X size={24} />
        </button>

        <Dialog.Title className="text-xl font-bold mb-4">🔍 Skill Detail</Dialog.Title>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
          <div>
            <p><span className="font-semibold text-white">Date:</span> {new Date(skill.created_at).toLocaleString()}</p>
            <p><span className="font-semibold text-white">Skill:</span> {skill.skill}</p>
            <p><span className="font-semibold text-white">Status:</span> {skill.status}</p>
            <p><span className="font-semibold text-white">Attempts:</span> {skill.attempts}</p>
            <p><span className="font-semibold text-white">Confidence:</span> {skill.confidence}/5</p>
          </div>
          <div>
            <p><span className="font-semibold text-white">Age:</span> {skill.age}</p>
            <p><span className="font-semibold text-white">Gender:</span> {skill.gender}</p>
            <p><span className="font-semibold text-white">Disposition:</span> {skill.disposition}</p>
            <p><span className="font-semibold text-white">Chief Complaint:</span> {skill.chiefComplaint}</p>
          </div>
        </div>

        {skill.notes && (
          <div className="mt-4">
            <h4 className="text-md font-semibold text-white mb-1">📝 Notes</h4>
            <p className="text-gray-300 bg-gray-800 p-3 rounded-lg">{skill.notes}</p>
          </div>
        )}

        {skill.instructorFeedback && (
          <div className="mt-4">
            <h4 className="text-md font-semibold text-white mb-1">👩‍🏫 Instructor Feedback</h4>
            <p className="text-gray-300 bg-gray-800 p-3 rounded-lg">{skill.instructorFeedback}</p>
          </div>
        )}

        {skill.attachment && (
          <div className="mt-4">
            <h4 className="text-md font-semibold text-white mb-1">📎 Attachment</h4>
            <a
              href={skill.attachment}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              View Uploaded File
            </a>
          </div>
        )}
      </div>
    </Dialog>
  );
}

export default StudentSkillRowModal;
