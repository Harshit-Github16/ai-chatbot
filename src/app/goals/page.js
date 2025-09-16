'use client';

import { useEffect, useState } from 'react';

export default function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const [title, setTitle] = useState('');
  const [progress, setProgress] = useState(0);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const id =
      typeof window !== 'undefined' ? localStorage.getItem('tara_user_id') : '';
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
    const res = await fetch('/api/goals/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const data = await res.json();
      setGoals([data.goal, ...goals]);
      setTitle('');
      setProgress(0);
    }
  };

  return (
    <div className="bg-gradient-to-br from-pink-50 via-white to-purple-50 min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Page Heading */}
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          🎯 My Goals
        </h1>

        {/* Add Goal Section */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Add a New Goal
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Goal title"
              className="sm:col-span-3 border rounded-lg px-4 py-2 text-gray-700 focus:ring-2 focus:ring-pink-500 focus:outline-none"
            />
            <input
              type="number"
              value={progress}
              onChange={(e) => setProgress(e.target.value)}
              min="0"
              max="100"
              placeholder="%"
              className="sm:col-span-1 border rounded-lg px-4 py-2 text-gray-700 focus:ring-2 focus:ring-pink-500 focus:outline-none"
            />
            <button
              onClick={addGoal}
              className="sm:col-span-1 bg-pink-600 hover:bg-pink-700 text-white font-medium rounded-lg px-4 py-2 transition"
            >
              Add
            </button>
          </div>
        </div>

        {/* Goals List */}
        <div className="space-y-4">
          {goals.map((g) => (
            <div
              key={g._id || g.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition"
            >
              <div className="flex justify-between items-center mb-3">
                <p className="font-semibold text-lg text-gray-900">
                  {g.title}
                </p>
                <span className="text-sm font-medium text-gray-600">
                  {g.progress || 0}%
                </span>
              </div>
              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="h-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-300"
                  style={{ width: `${g.progress || 0}%` }}
                ></div>
              </div>
            </div>
          ))}

          {goals.length === 0 && (
            <p className="text-center text-gray-500 mt-10">
              No goals yet. Add your first goal above 🚀
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
