'use client';

import { useEffect, useState } from 'react';

export default function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const [title, setTitle] = useState('');
  const [progress, setProgress] = useState(0);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const id = typeof window !== 'undefined' ? localStorage.getItem('tara_user_id') : '';
    setUserId(id || '');
    if (id) {
      fetch(`/api/goals/list?userId=${id}`).then(async (r) => {
        if (r.ok) {
          const data = await r.json();
          setGoals(data.goals || []);
        }
      });
    }
  }, []);

  const addGoal = async () => {
    if (!title.trim()) return;
    const payload = { userId, title, progress: Number(progress) };
    const res = await fetch('/api/goals/add', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (res.ok) {
      const data = await res.json();
      setGoals([data.goal, ...goals]);
      setTitle('');
      setProgress(0);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-24 bg-gradient-to-br from-pink-50 via-white to-purple-50 min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Goals</h1>
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 text-[#333]">
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Goal title" className="sm:col-span-3 border rounded-lg px-3 py-2 text-[#333]" />
          <input type="number" value={progress} onChange={(e) => setProgress(e.target.value)} min="0" max="100" className="sm:col-span-1 border rounded-lg px-3 py-2 text-[#333]" />
          <button onClick={addGoal} className="sm:col-span-1 bg-pink-500 hover:bg-pink-600 text-white rounded-lg px-3 py-2">Add</button>
        </div>
      </div>
      <div className="space-y-2">
        {goals.map((g) => (
          <div key={g._id || g.id} className="bg-white rounded-xl border border-gray-200 p-3 flex items-center justify-between text-[#333]">
            <div>
              <p className="font-medium text-gray-800">{g.title}</p>
              <p className="text-sm text-gray-600">Progress: {g.progress || 0}%</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


