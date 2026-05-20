'use client';
import { useEffect, useState } from 'react';
import { studentsApi, marksApi, semestersApi, Student, Mark, Semester, CourseModule } from '@/lib/api';

type FormState = { studentId: string; moduleId: string; semesterId: string; score: string; maxScore: string };
const empty: FormState = { studentId: '', moduleId: '', semesterId: '', score: '', maxScore: '100' };

export default function MarksPage() {
  const [marks, setMarks] = useState<Mark[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Mark | null>(null);
  const [form, setForm] = useState<FormState>(empty);
  const [availableModules, setAvailableModules] = useState<CourseModule[]>([]);
  const [error, setError] = useState('');

  const load = () =>
    Promise.all([marksApi.getAll(), studentsApi.getAll(), semestersApi.getAll()])
      .then(([m, s, sem]) => { setMarks(m); setStudents(s); setSemesters(sem); })
      .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const loadModulesForStudent = async (studentId: string) => {
    if (!studentId) { setAvailableModules([]); return; }
    const modules = await studentsApi.getModules(studentId);
    setAvailableModules(modules);
  };

  const handleStudentChange = (studentId: string) => {
    setForm(f => ({ ...f, studentId, moduleId: '' }));
    loadModulesForStudent(studentId);
  };

  const openAdd = () => {
    setEditing(null);
    setForm(empty);
    setAvailableModules([]);
    setError('');
    setShowForm(true);
  };

  const openEdit = (m: Mark) => {
    setEditing(m);
    setForm({ studentId: m.studentId, moduleId: m.moduleId ?? '', semesterId: m.semesterId ?? '', score: String(m.score), maxScore: String(m.maxScore) });
    if (m.studentId) loadModulesForStudent(m.studentId);
    setError('');
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError('');
    try {
      const payload = { studentId: form.studentId, moduleId: form.moduleId, semesterId: form.semesterId, score: Number(form.score), maxScore: Number(form.maxScore) };
      if (editing) await marksApi.update(editing.id, payload);
      else await marksApi.create(payload);
      setShowForm(false); load();
    } catch (err: any) { setError(err.response?.data?.message ?? 'An error occurred'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this mark?')) return;
    await marksApi.delete(id); load();
  };

  if (loading) return <div className="text-center py-12 text-gray-400">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Marks</h1>
        <button onClick={openAdd} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">+ Add Mark</button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h2 className="font-semibold text-lg mb-4">{editing ? 'Edit Mark' : 'Add Mark'}</h2>
            {error && <p className="text-red-600 text-sm mb-3 bg-red-50 p-2 rounded">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student</label>
                <select required value={form.studentId} onChange={e => handleStudentChange(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select a student...</option>
                  {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.studentId})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Module</label>
                <select required value={form.moduleId} onChange={e => setForm(f => ({ ...f, moduleId: e.target.value }))} disabled={!form.studentId} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400">
                  <option value="">{form.studentId ? 'Select a module...' : 'Select a student first'}</option>
                  {availableModules.map(m => <option key={m.id} value={m.id}>{m.name}{m.code ? ` (${m.code})` : ''}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                <select required value={form.semesterId} onChange={e => setForm(f => ({ ...f, semesterId: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select a semester...</option>
                  {semesters.map(s => <option key={s.id} value={s.id}>{s.academicYear?.name ? `${s.academicYear.name} — ` : ''}{s.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Score</label>
                  <input required type="number" min="0" value={form.score} onChange={e => setForm(f => ({ ...f, score: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Score</label>
                  <input required type="number" min="1" value={form.maxScore} onChange={e => setForm(f => ({ ...f, maxScore: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
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
              <th className="px-5 py-3 text-left">Module</th>
              <th className="px-5 py-3 text-left">Semester</th>
              <th className="px-5 py-3 text-left">Score</th>
              <th className="px-5 py-3 text-left">%</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {marks.map(m => (
              <tr key={m.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-5 py-3 font-medium">{m.student?.name}</td>
                <td className="px-5 py-3">{m.module?.name ?? '—'}{m.module?.code ? <span className="ml-1 font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded">{m.module.code}</span> : null}</td>
                <td className="px-5 py-3 text-gray-500 text-xs">{m.semester ? `${m.semester.academicYear?.name ? `${m.semester.academicYear.name} — ` : ''}${m.semester.name}` : '—'}</td>
                <td className="px-5 py-3">{m.score} / {m.maxScore}</td>
                <td className="px-5 py-3">{Math.round((m.score / m.maxScore) * 100)}%</td>
                <td className="px-5 py-3 text-right">
                  <button onClick={() => openEdit(m)} className="text-blue-600 hover:underline text-xs mr-3">Edit</button>
                  <button onClick={() => handleDelete(m.id)} className="text-red-500 hover:underline text-xs">Delete</button>
                </td>
              </tr>
            ))}
            {marks.length === 0 && <tr><td colSpan={6} className="px-5 py-8 text-center text-gray-400">No marks yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
