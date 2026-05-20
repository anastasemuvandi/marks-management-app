'use client';
import { useEffect, useState } from 'react';
import { modulesApi, CourseModule } from '@/lib/api';

type FormState = { name: string; code: string; description: string };
const empty: FormState = { name: '', code: '', description: '' };

export default function ModulesPage() {
  const [items, setItems] = useState<CourseModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<CourseModule | null>(null);
  const [form, setForm] = useState<FormState>(empty);
  const [error, setError] = useState('');

  const load = () => modulesApi.getAll().then(setItems).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm(empty); setError(''); setShowForm(true); };
  const openEdit = (m: CourseModule) => { setEditing(m); setForm({ name: m.name, code: m.code ?? '', description: m.description ?? '' }); setError(''); setShowForm(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError('');
    try {
      if (editing) await modulesApi.update(editing.id, form);
      else await modulesApi.create(form);
      setShowForm(false); load();
    } catch (err: any) { setError(err.response?.data?.message ?? 'An error occurred'); }
  };

  if (loading) return <div className="text-center py-12 text-gray-400">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Modules</h1>
        <button onClick={openAdd} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">+ Add Module</button>
      </div>
      <p className="text-sm text-gray-500">New modules are automatically assigned to all existing students. New students are automatically enrolled in all modules.</p>

      {showForm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h2 className="font-semibold text-lg mb-4">{editing ? 'Edit Module' : 'Add Module'}</h2>
            {error && <p className="text-red-600 text-sm mb-3 bg-red-50 p-2 rounded">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Module Name</label>
                <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Mathematics" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Code <span className="text-gray-400 font-normal">(optional)</span></label>
                <input value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} placeholder="e.g. MATH101" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description <span className="text-gray-400 font-normal">(optional)</span></label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
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
              <th className="px-5 py-3 text-left">Code</th>
              <th className="px-5 py-3 text-left">Description</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(m => (
              <tr key={m.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-5 py-3 font-medium">{m.name}</td>
                <td className="px-5 py-3"><span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">{m.code || '—'}</span></td>
                <td className="px-5 py-3 text-gray-500 text-xs">{m.description || '—'}</td>
                <td className="px-5 py-3 text-right">
                  <button onClick={() => openEdit(m)} className="text-blue-600 hover:underline text-xs mr-3">Edit</button>
                  <button onClick={async () => { if (confirm('Delete this module?')) { await modulesApi.delete(m.id); load(); } }} className="text-red-500 hover:underline text-xs">Delete</button>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={4} className="px-5 py-8 text-center text-gray-400">No modules yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
