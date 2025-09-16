'use client';

import { useEffect, useState, useRef } from 'react';

export default function JournalingPage() {
  const [tags, setTags] = useState(['work', 'personal', 'ideas']);
  const [newTag, setNewTag] = useState('');
  const [activeTag, setActiveTag] = useState('work');
  const [content, setContent] = useState('');
  const [userId, setUserId] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    const id =
      typeof window !== 'undefined' ? localStorage.getItem('tara_user_id') : '';
    setUserId(id || '');
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);

  const addTag = () => {
    const t = newTag.trim().toLowerCase();
    if (!t || tags.includes(t)) return;
    setTags([...tags, t]);
    setNewTag('');
    setActiveTag(t);
  };

  const save = async () => {
    if (!activeTag || !content.trim()) return;
    const res = await fetch('/api/journal/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, tag: activeTag, content }),
    });
    if (res.ok) {
      setIsDirty(false);
      setContent('');
      if (contentRef.current) {
        contentRef.current.innerHTML = '';
      }
      alert('Journal entry saved successfully!');
    }
  };

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    if (contentRef.current) {
      contentRef.current.focus();
    }
  };

  const handleInput = (e) => {
    setContent(e.currentTarget.innerHTML);
    setIsDirty(true);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Header */}
        <h1 className="text-4xl font-bold text-gray-900 mb-10 text-center">
          ✨ My Journal
        </h1>

        {/* Tag Section */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 mb-10">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Choose or Add a Topic
          </h2>
          <div className="flex flex-wrap gap-3 mb-4">
            {tags.map((t) => (
              <button
                key={t}
                onClick={() => setActiveTag(t)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 shadow-sm
                  ${
                    activeTag === t
                      ? 'bg-pink-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') addTag();
              }}
              placeholder="Add a new topic..."
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition"
            />
            <button
              onClick={addTag}
              className="bg-pink-100 hover:bg-pink-200 text-pink-700 rounded-lg px-5 py-2 font-medium transition"
            >
              Add
            </button>
          </div>
        </div>

        {/* Text Editor Section */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-800">
              Writing under: <span className="text-pink-600">{activeTag}</span>
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => execCommand('bold')}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-100 transition text-gray-700 font-bold"
              >
                B
              </button>
              <button
                onClick={() => execCommand('italic')}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-100 transition text-gray-700 italic"
              >
                I
              </button>
              <button
                onClick={() => execCommand('underline')}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-100 transition text-gray-700 underline"
              >
                U
              </button>
              <button
                onClick={() => execCommand('insertUnorderedList')}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-100 transition text-gray-700"
              >
                •
              </button>
              <button
                onClick={() => execCommand('insertOrderedList')}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-100 transition text-gray-700"
              >
                1.
              </button>
            </div>
          </div>

          {/* Editable content area */}
          <div className="relative">
            <div
              ref={contentRef}
              contentEditable
              onInput={handleInput}
              className="min-h-[300px] border border-gray-200 rounded-lg px-5 py-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all prose max-w-none"
              suppressContentEditableWarning
            />
            {content.length === 0 && (
              <span className="absolute top-4 left-5 text-gray-400 pointer-events-none select-none">
                Write your thoughts about "{activeTag}" here...
              </span>
            )}
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={save}
              className="bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-lg px-6 py-3 shadow-md transition-all duration-200"
            >
              💾 Save Journal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
