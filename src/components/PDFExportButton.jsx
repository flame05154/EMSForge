// PDFExportButton.jsx
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

function PDFExportButton({ targetId = 'dashboard-export' }) {
  const handleExport = async () => {
    const input = document.getElementById(targetId);
    if (!input) return alert('🧾 Export section not found!');

    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('EMSForge-Skill-Summary.pdf');
  };

  return (
    <button
      onClick={handleExport}
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm shadow"
    >
      📄 Export PDF Summary
    </button>
  );
}

export default PDFExportButton;
