'use client';
import { useEffect, useState } from 'react';
import { studentsApi, marksApi, Student, Mark } from '@/lib/api';

export default function MarksPage() {
  const [marks, setMarks] = useState<Mark[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Mark | null>(null);
  const [form, setForm] = useState({ studentId: '', subject: '', score: '', maxScore: '100' });
  const [error, setError] = useState('');

  const load = () =>
    Promise.all([marksApi.getAll(), studentsApi.getAll()])
      .then(([m, s]) => { setMarks(m); setStudents(s); })
      .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm({ studentId: '', subject: '', score: '', maxScore: '100' }); setError(''); setShowForm(true); };
  const openEdit = (m: Mark) => { setEditing(m); setForm({ studentId: m.studentId, subject: m.subject, score: String(m.score), maxScore: String(m.maxScore) }); setError(''); setShowForm(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const payload = { studentId: form.studentId, subject: form.subject, score: Number(form.score), maxScore: Number(form.maxScore) };
      if (editing) await marksApi.update(editing.id, payload);
      else await marksApi.create(payload);
      setShowForm(false);
      load();
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'An error occurred');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this mark?')) return;
    await marksApi.delete(id);
    load();
  };

  if (loading) return <div className="text-center py-12 text-gray-400">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Marks</h1>
        <button onClick={openAdd} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">+ Add Mark</button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h2 className="font-semibold text-lg mb-4">{editing ? 'Edit Mark' : 'Add Mark'}</h2>
            {error && <p className="text-red-600 text-sm mb-3 bg-red-50 p-2 rounded">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student</label>
                <select required value={form.studentId} onChange={e => setForm(f => ({...f, studentId: e.target.value}))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select a student...</option>
                  {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.studentId})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input required value={form.subject} onChange={e => setForm(f => ({...f, subject: e.target.value}))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Mathematics" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Score</label>
                  <input required type="number" min="0" value={form.score} onChange={e => setForm(f => ({...f, score: e.target.value}))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Score</label>
                  <input required type="number" min="1" value={form.maxScore} onChange={e => setForm(f => ({...f, maxScore: e.target.value}))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700">Save</button>
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-gray-300 py-2 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="px-5 py-3 text-left">Student</th>
              <th className="px-5 py-3 text-left">Subject</th>
              <th className="px-5 py-3 text-left">Score</th>
              <th className="px-5 py-3 text-left">%</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {marks.map(m => (
              <tr key={m.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-5 py-3 font-medium">{m.student?.name}</td>
                <td className="px-5 py-3">{m.subject}</td>
                <td className="px-5 py-3">{m.score} / {m.maxScore}</td>
                <td className="px-5 py-3">{Math.round((m.score / m.maxScore) * 100)}%</td>
                <td className="px-5 py-3 text-right">
                  <button onClick={() => openEdit(m)} className="text-blue-600 hover:underline text-xs mr-3">Edit</button>
                  <button onClick={() => handleDelete(m.id)} className="text-red-500 hover:underline text-xs">Delete</button>
                </td>
              </tr>
            ))}
            {marks.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-8 text-center text-gray-400">No marks yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
