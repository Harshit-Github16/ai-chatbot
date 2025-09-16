'use client';

import { useEffect } from 'react';

export default function MoodModal({ isOpen, onSelect }) {
  // Prevent background scroll while modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const moods = [
    { key: 'happy', label: 'Happy', emoji: '😊' },
    { key: 'sad', label: 'Sad', emoji: '😔' },
    { key: 'calm', label: 'Calm', emoji: '😌' },
    { key: 'stressed', label: 'Stressed', emoji: '😫' },
    { key: 'confused', label: 'Confused', emoji: '🤔' },
    { key: 'angry', label: 'Angry', emoji: '😠' },
    { key: 'funny', label: 'Funny', emoji: '😂' },
    { key: 'surprise', label: 'Surprise', emoji: '😮' },
  ];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Mood Check-in</h2>
          <p className="text-gray-600 mt-1">What's your current mood? Choose one to continue.</p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {moods.map((mood) => (
            <button
              key={mood.key}
              onClick={() => onSelect?.(mood)}
              className="flex flex-col items-center justify-center gap-2 bg-white border border-gray-200 hover:border-pink-300 hover:shadow-sm rounded-2xl p-3 transition-all"
            >
              <span className="text-3xl" aria-hidden>
                {mood.emoji}
              </span>
              <span className="text-xs text-gray-700 text-center leading-tight">
                {mood.label}
              </span>
            </button>
          ))}
        </div>

        <p className="text-[11px] text-gray-400 text-center mt-4">
          Your mood matters to me 🌸, pick one to begin.
        </p>
      </div>
    </div>
  );
}