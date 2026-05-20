'use client';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const navLinks = [
  { href: '/', label: 'Dashboard' },
  { href: '/students', label: 'Students' },
  { href: '/marks', label: 'Marks' },
  { href: '/classes', label: 'Classes' },
  { href: '/modules', label: 'Modules' },
  { href: '/academic-years', label: 'Academic Years' },
  { href: '/semesters', label: 'Semesters' },
  { href: '/reports', label: 'Reports' },
];

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => { logout(); router.push('/login'); };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex gap-5 items-center shadow-sm flex-wrap">
      <span className="font-bold text-lg text-blue-700 mr-1">Marks Manager</span>
      {navLinks.map(({ href, label }) => (
        <Link key={href} href={href} className={`text-sm transition-colors ${pathname === href ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-blue-600'}`}>
          {label}
        </Link>
      ))}
      {isAdmin && (
        <Link href="/users" className={`text-sm transition-colors ${pathname === '/users' ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-blue-600'}`}>
          Users
        </Link>
      )}
      {user && (
        <div className="ml-auto flex items-center gap-3">
          <span className="text-xs text-gray-500">
            <span className="font-medium text-gray-700">{user.username}</span>
            <span className="ml-1 bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded text-xs">{user.role}</span>
          </span>
          <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-700 transition-colors">Logout</button>
        </div>
      )}
    </nav>
  );
}
