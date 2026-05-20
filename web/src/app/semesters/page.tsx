'use client';
import { useEffect, useState } from 'react';
import { semestersApi, academicYearsApi, Semester, AcademicYear } from '@/lib/api';

type FormState = { name: string; number: number; startDate: string; endDate: string; academicYearId: string };
const empty: FormState = { name: '', number: 1, startDate: '', endDate: '', academicYearId: '' };

export default function SemestersPage() {
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [years, setYears] = useState<AcademicYear[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Semester | null>(null);
  const [form, setForm] = useState<FormState>(empty);
  const [error, setError] = useState('');

  const load = () => Promise.all([semestersApi.getAll(), academicYearsApi.getAll()])
    .then(([s, y]) => { setSemesters(s); setYears(y); }).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm({ ...empty, academicYearId: years[0]?.id ?? '' }); setError(''); setShowForm(true); };
  const openEdit = (s: Semester) => { setEditing(s); setForm({ name: s.name, number: s.number, startDate: s.startDate, endDate: s.endDate, academicYearId: s.academicYearId }); setError(''); setShowForm(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError('');
    try {
      if (editing) await semestersApi.update(editing.id, form);
      else await semestersApi.create(form);
      setShowForm(false); load();
    } catch (err: any) { setError(err.response?.data?.message ?? 'An error occurred'); }
  };

  if (loading) return <div className="text-center py-12 text-gray-400">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Semesters</h1>
        <button onClick={openAdd} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">+ Add Semester</button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h2 className="font-semibold text-lg mb-4">{editing ? 'Edit Semester' : 'Add Semester'}</h2>
            {error && <p className="text-red-600 text-sm mb-3 bg-red-50 p-2 rounded">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year</label>
                <select required value={form.academicYearId} onChange={e => setForm(f => ({ ...f, academicYearId: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select academic year</option>
                  {years.map(y => <option key={y.id} value={y.id}>{y.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Semester 1" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Number</label>
                  <select value={form.number} onChange={e => setForm(f => ({ ...f, number: +e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input required type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input required type="date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
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
              <th className="px-5 py-3 text-left">Name</th>
              <th className="px-5 py-3 text-left">Academic Year</th>
              <th className="px-5 py-3 text-left">Number</th>
              <th className="px-5 py-3 text-left">Start</th>
              <th className="px-5 py-3 text-left">End</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {semesters.map(s => (
              <tr key={s.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-5 py-3 font-medium">{s.name}</td>
                <td className="px-5 py-3 text-gray-500">{s.academicYear?.name ?? '—'}</td>
                <td className="px-5 py-3 text-gray-500">{s.number}</td>
                <td className="px-5 py-3 text-gray-500">{s.startDate}</td>
                <td className="px-5 py-3 text-gray-500">{s.endDate}</td>
                <td className="px-5 py-3 text-right">
                  <button onClick={() => openEdit(s)} className="text-blue-600 hover:underline text-xs mr-3">Edit</button>
                  <button onClick={async () => { if (confirm('Delete?')) { await semestersApi.delete(s.id); load(); } }} className="text-red-500 hover:underline text-xs">Delete</button>
                </td>
              </tr>
            ))}
            {semesters.length === 0 && <tr><td colSpan={6} className="px-5 py-8 text-center text-gray-400">No semesters yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
