// SkillAttachmentModal.jsx
import { useState } from 'react';

function SkillAttachmentModal({ skill, onClose }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return alert('📎 Please select a file first');
    // TODO: Send selectedFile to backend
    console.log('📤 Uploading file:', selectedFile);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-800 p-6 rounded-xl max-w-md w-full text-white text-sm relative">
        <button onClick={onClose} className="absolute top-2 right-3 text-gray-400 text-lg">✕</button>
        <h3 className="text-lg font-bold mb-4">📎 Attach File to Skill</h3>
        <p className="mb-2 text-gray-300">Skill: <strong>{skill.skill}</strong></p>
        <input
          type="file"
          onChange={handleFileChange}
          className="text-white text-sm mb-3"
        />

        {previewUrl && (
          <div className="mb-3">
            <p className="text-xs text-gray-400 mb-1">Preview:</p>
            <img src={previewUrl} alt="Preview" className="w-full rounded" />
          </div>
        )}

        <button
          onClick={handleUpload}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm"
        >
          Upload
        </button>
      </div>
    </div>
  );
}

export default SkillAttachmentModal;
