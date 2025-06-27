import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function LogSkill() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [form, setForm] = useState({
    chiefComplaint: '',
    age: '',
    gender: '',
    skill: '',
    otherSkill: '',
    attempts: '',
    status: '',
    disposition: '',
    notes: '',
    confidence: '3',
    user_id: user?.id || '',
  });
  const [attachment, setAttachment] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setAttachment(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requiredFields = ['chiefComplaint', 'age', 'gender', 'skill', 'status', 'confidence', 'attempts', 'disposition'];
    for (const field of requiredFields) {
      if (!form[field] || (form.skill === 'Other' && !form.otherSkill)) {
        setError('All fields are required.');
        return;
      }
    }

    const formData = new FormData();
    Object.keys(form).forEach((key) => formData.append(key, form[key]));
    if (attachment) formData.append('attachment', attachment);

    try {
      await axios.post('http://165.140.156.98:5000/api/skills/log', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setError('Failed to submit skill log. Please try again.');
    }
  };

  const handleReportExport = () => {
    // This would ideally redirect or trigger report editor from dashboard
    alert('📄 EMS Student Report generation will be available from Dashboard Patient Reports tab.');
  };

  const skillOptions = [
    'Activated Charcoal (administration)',
    'AED (Automated External Defibrillator) use',
    'Airway suctioning (basic)',
    'Airway suctioning (advanced/ET tube)',
    'ALS scene leadership & medical decision-making',
    'Amiodarone (IV administration)',
    'Analgesics (e.g., Morphine, Fentanyl, Ketorolac)',
    'Anticonvulsants (e.g., Diazepam, Lorazepam)',
    'Antiemetics (Ondansetron)',
    'Anti-hypertensives (e.g., Labetalol)',
    'Antiarrhythmics (e.g., Lidocaine, Adenosine)',
    'Arterial line monitoring',
    'Aspirin (administration)',
    'Assist with patient’s own meds (e.g., EpiPen, inhaler)',
    'Bag-Valve-Mask ventilation',
    'Balloon pump (IABP) monitoring',
    'Bleeding control (direct pressure, tourniquet)',
    'Blood glucose monitoring',
    'Broselow tape pediatric dosing',
    'Burn management (minor)',
    'Capnography (waveform EtCO₂)',
    'Capnography (colorimetric)',
    'Cardiac monitoring (4-lead)',
    'Cardiac monitoring (12-lead ECG)',
    'Central line monitoring (no placement)',
    'Chest decompression (needle thoracostomy)',
    'Childbirth assistance',
    'Circulation assessment (pulse, perfusion, BP)',
    'Combitube/iGel/King Airway insertion',
    'CPAP administration',
    'Cricothyrotomy (surgical or needle)',
    'Defibrillation (manual)',
    'Defibrillation (AED)',
    'Dexmedetomidine infusion (monitoring)',
    'Dextrose (D10/D50)',
    'Diphenhydramine (Benadryl)',
    'Dopamine/norepinephrine drips',
    'ECG interpretation (12-lead)',
    'Epi 1:1,000 (IM)',
    'Epi 1:10,000 (IV)',
    'Epinephrine Auto-Injector',
    'ETCO₂ interpretation',
    'External jugular IV',
    'External pacing (TCP)',
    'Fluid bolus (IV/IO)',
    'Glucagon',
    'Hemostatic dressing',
    'High-flow oxygen (NRB, NC)',
    'Ipratropium (with albuterol, nebulized)',
    'IO (Intraosseous) access',
    'IV access (peripheral)',
    'IV infusion pump management',
    'Ketamine (analgesia, sedation, RSI)',
    'Labetalol',
    'Lidocaine (IV)',
    'Magnesium sulfate',
    'Manual airway maneuvers',
    'Manual defibrillator/cardioversion',
    'Mechanical ventilator operation',
    'Midazolam (Versed)',
    'Naloxone (IN/IM/IV)',
    'Nebulized medications',
    'Nitroglycerin (SL)',
    'Nitrous oxide (pain control, where allowed)',
    'Normal saline/Lactated Ringers infusion',
    'OB complications management (shoulder dystocia, breech)',
    'Oral glucose',
    'OPA/NPA placement',
    'Oxygen tank operation & delivery',
    'Pain assessment & management',
    'Paralytics (Rocuronium, Succinylcholine, Pancuronium)',
    'Patient assessment (full head-to-toe)',
    'Pediatric IO access',
    'Pelvic binder application',
    'PEEP valve use',
    'Pharmacologic sedation (procedural/transport)',
    'Pocket mask (barrier) ventilation',
    'Pressure infuser use',
    'Propofol infusion monitoring',
    'RSI (Rapid Sequence Intubation)',
    'Saline lock setup',
    'Scene triage & ICS awareness',
    'Shoulder reduction (dislocation)',
    'Spinal motion restriction',
    'Splinting (soft/hard, traction)',
    'Surgical airway (cricothyrotomy)',
    'Syringe driver monitoring',
    'Transcutaneous pacing',
    'Transvenous pacemaker monitoring',
    'Trauma dressing & bandaging',
    'Traction splint application',
    'VAD/ECMO patient care during transport',
    'Ventilator setting titration',
    'Vital signs monitoring (BP, HR, RR, SpO₂)',
    'Other',
  ];

  return (
    <div className="flex bg-gray-900 text-white min-h-screen">
      <div className="flex-1 p-6 max-w-4xl mx-auto">
        <motion.div className="bg-gray-800 p-8 rounded-2xl shadow-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="text-2xl font-bold text-blue-400 text-center mb-6">🚑 Log New EMS Skill</h2>

          {error && <p className="text-red-400 text-center mb-4">{error}</p>}
          {success && <motion.div className="bg-green-500 text-white rounded px-4 py-2 text-center mb-4" initial={{ scale: 0.9 }} animate={{ scale: 1.1 }}>✅ Skill successfully logged!</motion.div>}

          <form onSubmit={handleSubmit} className="space-y-5 text-sm">
            <div>
              <label className="block mb-1">Patient Chief Complaint</label>
              <input type="text" name="chiefComplaint" value={form.chiefComplaint} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2" required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">Age</label>
                <input type="number" name="age" value={form.age} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2" required />
              </div>
              <div>
                <label className="block mb-1">Gender</label>
                <select name="gender" value={form.gender} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2" required>
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block mb-1">Name of Skill</label>
              <select name="skill" value={form.skill} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2" required>
                <option value="">Select</option>
                {skillOptions.map((skill, idx) => (
                  <option key={idx} value={skill}>{skill}</option>
                ))}
              </select>
            </div>

            {form.skill === 'Other' && (
              <div>
                <label className="block mb-1">Other Skill Description</label>
                <input type="text" name="otherSkill" value={form.otherSkill} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2" required />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">Status</label>
                <select name="status" value={form.status} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2" required>
                  <option value="">Select</option>
                  <option value="Success">Success</option>
                  <option value="Attempted">Attempted</option>
                  <option value="Failed">Failed</option>
                </select>
              </div>
              <div>
                <label className="block mb-1"># of Attempts</label>
                <input type="number" name="attempts" value={form.attempts} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2" required />
              </div>
            </div>

            <div>
              <label className="block mb-1">Patient Disposition</label>
              <input type="text" name="disposition" value={form.disposition} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2" required />
            </div>

            <div>
              <label className="block mb-1">Confidence Rating (1–5)</label>
              <select name="confidence" value={form.confidence} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2" required>
                {[1, 2, 3, 4, 5].map((num) => <option key={num} value={num}>{num}</option>)}
              </select>
            </div>

            <div>
              <label className="block mb-1">Notes</label>
              <textarea name="notes" value={form.notes} onChange={handleChange} rows="3" className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2" />
            </div>

            <div>
              <label className="block mb-1">Attachment</label>
              <input type="file" onChange={handleFileChange} className="w-full text-sm text-gray-300 bg-gray-700 border border-gray-600 rounded-md px-4 py-2" />
            </div>

            <div className="flex flex-wrap justify-between gap-4 pt-6">
              <button type="button" onClick={() => navigate('/dashboard')} className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-500">Cancel</button>
              <button type="button" onClick={handleReportExport} className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded">Generate Report</button>
              <button type="submit" className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">Save Skill</button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default LogSkill;
