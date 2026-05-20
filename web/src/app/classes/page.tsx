'use client';
import { useEffect, useState } from 'react';
import { classesApi, Class } from '@/lib/api';

type FormState = { name: string; level: string };
const empty: FormState = { name: '', level: '' };

export default function ClassesPage() {
  const [items, setItems] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Class | null>(null);
  const [form, setForm] = useState<FormState>(empty);
  const [error, setError] = useState('');

  const load = () => classesApi.getAll().then(setItems).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm(empty); setError(''); setShowForm(true); };
  const openEdit = (c: Class) => { setEditing(c); setForm({ name: c.name, level: c.level ?? '' }); setError(''); setShowForm(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError('');
    try {
      if (editing) await classesApi.update(editing.id, form);
      else await classesApi.create(form);
      setShowForm(false); load();
    } catch (err: any) { setError(err.response?.data?.message ?? 'An error occurred'); }
  };

  if (loading) return <div className="text-center py-12 text-gray-400">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Classes</h1>
        <button onClick={openAdd} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">+ Add Class</button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h2 className="font-semibold text-lg mb-4">{editing ? 'Edit Class' : 'Add Class'}</h2>
            {error && <p className="text-red-600 text-sm mb-3 bg-red-50 p-2 rounded">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class Name</label>
                <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. 10A" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Level <span className="text-gray-400 font-normal">(optional)</span></label>
                <input value={form.level} onChange={e => setForm(f => ({ ...f, level: e.target.value }))} placeholder="e.g. Year 10" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
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
              <th className="px-5 py-3 text-left">Level</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(c => (
              <tr key={c.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-5 py-3 font-medium">{c.name}</td>
                <td className="px-5 py-3 text-gray-500">{c.level || '—'}</td>
                <td className="px-5 py-3 text-right">
                  <button onClick={() => openEdit(c)} className="text-blue-600 hover:underline text-xs mr-3">Edit</button>
                  <button onClick={async () => { if (confirm('Delete this class?')) { await classesApi.delete(c.id); load(); } }} className="text-red-500 hover:underline text-xs">Delete</button>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={3} className="px-5 py-8 text-center text-gray-400">No classes yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
