'use client';
import { useEffect, useState } from 'react';
import { marksApi, GradeSummary, reportsApi } from '@/lib/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function ReportsPage() {
  const [summary, setSummary] = useState<GradeSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    marksApi.getSummary().then(setSummary).finally(() => setLoading(false));
  }, []);

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Marks Report', 14, 16);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 23);

    autoTable(doc, {
      startY: 28,
      head: [['#', 'Student Name', 'Student ID', 'Group', 'Total Score', 'Max', '%', 'Grade']],
      body: summary.map((r, i) => [
        i + 1,
        r.student.name,
        r.student.studentId,
        r.student.group || '—',
        r.totalScore,
        r.totalMax,
        `${r.percentage}%`,
        r.grade,
      ]),
      headStyles: { fillColor: [37, 99, 235] },
      alternateRowStyles: { fillColor: [248, 250, 252] },
    });

    doc.save('marks-report.pdf');
  };

  if (loading) return <div className="text-center py-12 text-gray-400">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Reports</h1>
        <div className="flex gap-2">
          <button onClick={downloadPDF} className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700">Download PDF</button>
          <button onClick={reportsApi.downloadExcel} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700">Download Excel</button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="px-5 py-3 text-left">#</th>
              <th className="px-5 py-3 text-left">Student</th>
              <th className="px-5 py-3 text-left">ID</th>
              <th className="px-5 py-3 text-left">Group</th>
              <th className="px-5 py-3 text-left">Score</th>
              <th className="px-5 py-3 text-left">%</th>
              <th className="px-5 py-3 text-left">Grade</th>
              <th className="px-5 py-3 text-left">Subjects</th>
            </tr>
          </thead>
          <tbody>
            {summary.map((r, i) => (
              <tr key={r.student.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-5 py-3 text-gray-400">{i + 1}</td>
                <td className="px-5 py-3 font-medium">{r.student.name}</td>
                <td className="px-5 py-3 text-gray-500">{r.student.studentId}</td>
                <td className="px-5 py-3 text-gray-500">{r.student.group || '—'}</td>
                <td className="px-5 py-3">{r.totalScore} / {r.totalMax}</td>
                <td className="px-5 py-3">{r.percentage}%</td>
                <td className="px-5 py-3">
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${gradeColor(r.grade)}`}>{r.grade}</span>
                </td>
                <td className="px-5 py-3 text-gray-500">{r.subjectCount}</td>
              </tr>
            ))}
            {summary.length === 0 && (
              <tr><td colSpan={8} className="px-5 py-8 text-center text-gray-400">No data to report yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function gradeColor(grade: string) {
  const map: Record<string, string> = {
    'A+': 'bg-green-100 text-green-800',
    'A': 'bg-green-50 text-green-700',
    'B': 'bg-blue-50 text-blue-700',
    'C': 'bg-yellow-50 text-yellow-700',
    'D': 'bg-orange-50 text-orange-700',
    'F': 'bg-red-50 text-red-700',
  };
  return map[grade] ?? 'bg-gray-100 text-gray-700';
}
