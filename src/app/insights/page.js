'use client';

import { useEffect, useState } from 'react';

export default function InsightsPage() {
  const [moods, setMoods] = useState([]);
  const [goals, setGoals] = useState([]);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const id = typeof window !== 'undefined' ? localStorage.getItem('tara_user_id') : '';
    setUserId(id || '');
    if (id) {
      fetch(`/api/mood/list?userId=${id}`).then(async (r) => {
        if (r.ok) {
          const data = await r.json();
          setMoods(data.moods || []);
        }
      });
      fetch(`/api/goals/list?userId=${id}`).then(async (r) => {
        if (r.ok) {
          const data = await r.json();
          setGoals(data.goals || []);
        }
      });
    }
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 pb-24 bg-gradient-to-br from-pink-50 via-white to-purple-50 min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Insights</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-[#333]">
          <h2 className="font-medium text-gray-800 mb-2">Mood history</h2>
          <div className="space-y-2 max-h-80 overflow-auto">
            {moods.map((m) => (
              <div key={m._id || Math.random()} className="flex items-center justify-between text-sm text-gray-800">
                <span>{m.emoji || '🙂'} {m.label || m.key}</span>
                <span className="text-gray-500">{new Date(m.createdAt).toLocaleString()}</span>
              </div>
            ))}
            {moods.length === 0 && <p className="text-gray-500 text-sm">No mood entries yet.</p>}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-[#333]">
          <h2 className="font-medium text-gray-800 mb-2">Goals snapshot</h2>
          <div className="space-y-2 max-h-80 overflow-auto">
            {goals.map((g) => (
              <div key={g._id || Math.random()} className="flex items-center justify-between text-sm text-gray-800">
                <span>{g.title}</span>
                <span className="text-gray-500">{g.progress || 0}%</span>
              </div>
            ))}
            {goals.length === 0 && <p className="text-gray-500 text-sm">No goals yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}


