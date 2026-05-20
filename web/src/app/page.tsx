'use client';
import { useEffect, useState } from 'react';
import { studentsApi, marksApi, GradeSummary } from '@/lib/api';

export default function Dashboard() {
  const [summary, setSummary] = useState<GradeSummary[]>([]);
  const [studentCount, setStudentCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([marksApi.getSummary(), studentsApi.getAll()])
      .then(([s, students]) => {
        setSummary(s);
        setStudentCount(students.length);
      })
      .finally(() => setLoading(false));
  }, []);

  const avgPercentage = summary.length
    ? Math.round(summary.reduce((s, r) => s + r.percentage, 0) / summary.length)
    : 0;

  const gradeDistribution = summary.reduce((acc, r) => {
    acc[r.grade] = (acc[r.grade] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (loading) return <div className="text-center py-12 text-gray-400">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Total Students" value={studentCount} color="blue" />
        <StatCard label="Average Score" value={`${avgPercentage}%`} color="green" />
        <StatCard label="Graded Students" value={summary.length} color="purple" />
      </div>

      {Object.keys(gradeDistribution).length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-700 mb-4">Grade Distribution</h2>
          <div className="flex gap-3 flex-wrap">
            {['A+', 'A', 'B', 'C', 'D', 'F'].map(g => (
              <div key={g} className={`px-4 py-2 rounded-md text-sm font-medium ${gradeColor(g)}`}>
                {g}: {gradeDistribution[g] || 0}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100">
          <h2 className="font-semibold text-gray-700">Top Students</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="px-5 py-2 text-left">#</th>
              <th className="px-5 py-2 text-left">Student</th>
              <th className="px-5 py-2 text-left">ID</th>
              <th className="px-5 py-2 text-left">Score</th>
              <th className="px-5 py-2 text-left">Grade</th>
            </tr>
          </thead>
          <tbody>
            {summary.slice(0, 10).map((r, i) => (
              <tr key={r.student.id} className="border-t border-gray-50 hover:bg-gray-50">
                <td className="px-5 py-2 text-gray-400">{i + 1}</td>
                <td className="px-5 py-2 font-medium">{r.student.name}</td>
                <td className="px-5 py-2 text-gray-500">{r.student.studentId}</td>
                <td className="px-5 py-2">{r.percentage}%</td>
                <td className="px-5 py-2"><span className={`px-2 py-0.5 rounded text-xs font-bold ${gradeColor(r.grade)}`}>{r.grade}</span></td>
              </tr>
            ))}
            {summary.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-8 text-center text-gray-400">No data yet. Add students and marks to get started.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string | number; color: string }) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-700 border-blue-100',
    green: 'bg-green-50 text-green-700 border-green-100',
    purple: 'bg-purple-50 text-purple-700 border-purple-100',
  };
  return (
    <div className={`rounded-lg border p-5 ${colors[color]}`}>
      <p className="text-sm opacity-70">{label}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
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
