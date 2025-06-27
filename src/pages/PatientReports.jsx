import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { jsPDF } from 'jspdf';
import SignatureCanvas from 'react-signature-canvas';

function PatientReports() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [format, setFormat] = useState('narrative');
  const [editText, setEditText] = useState('');
  const [activeTab, setActiveTab] = useState('Drafts');
  const [signature, setSignature] = useState('');
  const [reviewerComment, setReviewerComment] = useState('');
  const [locked, setLocked] = useState(false);
  const autosaveTimer = useRef(null);
  const sigPad = useRef(null);

  useEffect(() => {
    if (user?.id) {
      axios.get(`http://165.140.156.98:5000/api/reports/${user.id}`)
        .then((res) => setReports(res.data))
        .catch(() => console.error('❌ Failed to fetch reports'));
    }
  }, [user]);

  const handleSelect = (report) => {
    setSelectedReport(report);
    setFormat('narrative');
    setEditText(generateReportText(report, 'narrative'));
    setSignature(report.signature || '');
    setReviewerComment(report.reviewerComment || '');
    setLocked(report.locked || false);
  };

  const handleFormatChange = (e) => {
    setFormat(e.target.value);
    if (selectedReport) setEditText(generateReportText(selectedReport, e.target.value));
  };

  const handleSave = async () => {
    if (selectedReport && !locked) {
      try {
        const sigData = sigPad.current ? sigPad.current.getTrimmedCanvas().toDataURL('image/png') : signature;
        await axios.put(`http://165.140.156.98:5000/api/reports/update/${selectedReport.id}`, {
          format,
          content: editText,
          status: activeTab,
          signature: sigData,
          reviewerComment,
          locked,
          version: (selectedReport.version || 1) + 1
        });
        alert('✅ Report saved successfully!');
      } catch (error) {
        alert('❌ Error saving report.');
      }
    }
  };

  const handlePDFExport = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text(editText, 10, 10, { maxWidth: 190 });
    if (signature) {
      doc.addImage(signature, 'PNG', 10, doc.internal.pageSize.height - 40, 50, 15);
    }
    doc.save(`Patient_Report_${selectedReport?.id}.pdf`);
  };

  const handleLock = async () => {
    setLocked(true);
    await handleSave();
    alert('🔒 Report locked and submitted.');
  };

  useEffect(() => {
    if (selectedReport && !locked) {
      clearTimeout(autosaveTimer.current);
      autosaveTimer.current = setTimeout(() => handleSave(), 5000);
    }
    return () => clearTimeout(autosaveTimer.current);
  }, [editText, signature, reviewerComment]);

  const generateReportText = (report, format) => {
    const { chiefComplaint, age, gender, skill, status, confidence, notes, disposition, attempts } = report;
    if (format === 'structured') {
      return `Chief Complaint: ${chiefComplaint}\nAge: ${age}\nGender: ${gender}\nSkill: ${skill}\nStatus: ${status}\nAttempts: ${attempts}\nConfidence: ${confidence}/5\nDisposition: ${disposition}\nNotes: ${notes}`;
    } else {
      return `Patient is a ${age}-year-old ${gender} presenting with ${chiefComplaint}. ${skill} was performed (${status}) with ${attempts} attempt(s). Disposition was ${disposition}. Confidence rated ${confidence}/5. Notes: ${notes}`;
    }
  };

  const filteredReports = reports.filter(r => r.status === activeTab);

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6">
      <h2 className="text-2xl font-bold text-blue-400 mb-6">📋 Patient Care Reports</h2>

      <div className="flex gap-4 mb-4">
        {['Drafts', 'Submitted'].map(tab => (
          <button
            key={tab}
            className={`px-4 py-2 rounded-full ${activeTab === tab ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-4 rounded-xl">
          <h3 className="text-md font-semibold mb-2">Logged Skills</h3>
          <ul className="space-y-2 max-h-[500px] overflow-y-auto">
            {filteredReports.length > 0 ? filteredReports.map((r, i) => (
              <li
                key={i}
                className={`p-2 rounded cursor-pointer ${selectedReport?.id === r.id ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                onClick={() => handleSelect(r)}
              >
                {r.skill} - {new Date(r.created_at).toLocaleDateString()}
              </li>
            )) : <li className="text-gray-400">No reports found.</li>}
          </ul>
        </div>

        <div className="md:col-span-2 bg-gray-800 p-6 rounded-xl">
          {selectedReport ? (
            <>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">📝 Finalize Report</h3>
                <select
                  value={format}
                  onChange={handleFormatChange}
                  className="bg-gray-700 border border-gray-600 rounded px-3 py-1"
                >
                  <option value="narrative">Narrative</option>
                  <option value="structured">Structured</option>
                </select>
              </div>
              <textarea
                className="w-full bg-gray-700 text-white p-4 rounded h-64 resize-none border border-gray-600"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                disabled={locked}
              />
              <div className="mt-4">
                <label className="block mb-1 text-sm">Draw Signature</label>
                <SignatureCanvas
                  penColor="white"
                  canvasProps={{ width: 400, height: 100, className: 'bg-gray-700 rounded border border-gray-600' }}
                  ref={sigPad}
                />
              </div>
              <div className="mt-4">
                <label className="block mb-1 text-sm">Reviewer Feedback (Instructor/Preceptor)</label>
                <textarea
                  className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600"
                  rows="3"
                  value={reviewerComment}
                  onChange={(e) => setReviewerComment(e.target.value)}
                  disabled={locked}
                />
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button onClick={handlePDFExport} className="bg-purple-600 px-4 py-2 rounded hover:bg-purple-700">
                  📄 Export to PDF
                </button>
                {!locked && (
                  <>
                    <button onClick={handleSave} className="bg-green-600 px-4 py-2 rounded hover:bg-green-700">
                      💾 Save Draft
                    </button>
                    <button onClick={handleLock} className="bg-red-600 px-4 py-2 rounded hover:bg-red-700">
                      🔒 Submit Final
                    </button>
                  </>
                )}
              </div>
            </>
          ) : (
            <p className="text-gray-400">Select a skill on the left to generate a report.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default PatientReports;
