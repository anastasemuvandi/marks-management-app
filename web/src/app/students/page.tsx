'use client';
import { useEffect, useState } from 'react';
import { studentsApi, classesApi, Student, Class } from '@/lib/api';

type FormState = { name: string; studentId: string; classId: string };
const empty: FormState = { name: '', studentId: '', classId: '' };

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Student | null>(null);
  const [form, setForm] = useState<FormState>(empty);
  const [error, setError] = useState('');

  const load = () => Promise.all([studentsApi.getAll(), classesApi.getAll()])
    .then(([s, c]) => { setStudents(s); setClasses(c); }).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm(empty); setError(''); setShowForm(true); };
  const openEdit = (s: Student) => { setEditing(s); setForm({ name: s.name, studentId: s.studentId, classId: s.classId ?? '' }); setError(''); setShowForm(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError('');
    try {
      const payload = { ...form, classId: form.classId || undefined };
      if (editing) await studentsApi.update(editing.id, payload);
      else await studentsApi.create(payload);
      setShowForm(false); load();
    } catch (err: any) { setError(err.response?.data?.message ?? 'An error occurred'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this student and all their marks?')) return;
    await studentsApi.delete(id); load();
  };

  if (loading) return <div className="text-center py-12 text-gray-400">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Students</h1>
        <button onClick={openAdd} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">+ Add Student</button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h2 className="font-semibold text-lg mb-4">{editing ? 'Edit Student' : 'Add Student'}</h2>
            {error && <p className="text-red-600 text-sm mb-3 bg-red-50 p-2 rounded">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
                <input required value={form.studentId} onChange={e => setForm(f => ({ ...f, studentId: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class <span className="text-gray-400 font-normal">(optional)</span></label>
                <select value={form.classId} onChange={e => setForm(f => ({ ...f, classId: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">No class assigned</option>
                  {classes.map(c => <option key={c.id} value={c.id}>{c.name}{c.level ? ` — ${c.level}` : ''}</option>)}
                </select>
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
              <th className="px-5 py-3 text-left">Name</th>
              <th className="px-5 py-3 text-left">Student ID</th>
              <th className="px-5 py-3 text-left">Class</th>
              <th className="px-5 py-3 text-left">Modules</th>
              <th className="px-5 py-3 text-left">Marks</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map(s => (
              <tr key={s.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-5 py-3 font-medium">{s.name}</td>
                <td className="px-5 py-3 text-gray-500">{s.studentId}</td>
                <td className="px-5 py-3 text-gray-500">{s.class?.name ?? '—'}</td>
                <td className="px-5 py-3 text-gray-500">{s.modules?.length ?? 0}</td>
                <td className="px-5 py-3 text-gray-500">{s.marks?.length ?? 0}</td>
                <td className="px-5 py-3 text-right">
                  <button onClick={() => openEdit(s)} className="text-blue-600 hover:underline text-xs mr-3">Edit</button>
                  <button onClick={() => handleDelete(s.id)} className="text-red-500 hover:underline text-xs">Delete</button>
                </td>
              </tr>
            ))}
            {students.length === 0 && <tr><td colSpan={6} className="px-5 py-8 text-center text-gray-400">No students yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
