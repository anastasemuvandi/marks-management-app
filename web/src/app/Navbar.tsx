'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex gap-6 items-center shadow-sm">
      <span className="font-bold text-lg text-blue-700">Marks Manager</span>
      <Link href="/" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Dashboard</Link>
      <Link href="/students" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Students</Link>
      <Link href="/marks" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Marks</Link>
      <Link href="/reports" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Reports</Link>
      {isAdmin && (
        <Link href="/users" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Users</Link>
      )}
      {user && (
        <div className="ml-auto flex items-center gap-3">
          <span className="text-xs text-gray-500">
            <span className="font-medium text-gray-700">{user.username}</span>
            <span className="ml-1 bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded text-xs">{user.role}</span>
          </span>
          <button
            onClick={handleLogout}
            className="text-sm text-red-500 hover:text-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
