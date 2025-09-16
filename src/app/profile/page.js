'use client';

import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const id = typeof window !== 'undefined' ? localStorage.getItem('tara_user_id') : '';
    setUserId(id || '');
    if (id) {
      fetch(`/api/user/profile?userId=${id}`).then(async (r) => {
        if (r.ok) {
          const data = await r.json();
          setUser(data.userProfile || null);
        }
      });
    }
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-24 bg-gradient-to-br from-pink-50 via-white to-purple-50 min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Profile</h1>
      <div className="bg-white rounded-xl border border-gray-200 p-4 text-[#333]">
        <p className="text-sm text-gray-600">User ID:</p>
        <p className="text-gray-800 break-all">{userId || '-'}</p>
        <div className="grid grid-cols-2 gap-4 mt-4 text-gray-800">
          <div>
            <p className="text-sm text-gray-600">Name</p>
            <p>{user?.name || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Age</p>
            <p>{user?.age || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Gender</p>
            <p>{user?.gender || '-'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}


