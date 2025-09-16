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
    const id = typeof window !== 'undefined' ? localStorage.getItem('tara_user_id') : '';
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
      body: JSON.stringify({ userId, tag: activeTag, content })
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
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Journaling</h1>
        
        {/* Tag Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((t) => (
              <button 
                key={t} 
                onClick={() => setActiveTag(t)} 
                className={`px-4 py-2 rounded-full font-medium transition-all duration-200 
                  ${activeTag === t ? 'bg-pink-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`
                }
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
              onKeyDown={(e) => { if (e.key === 'Enter') addTag(); }}
              placeholder="Add a new tag..." 
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition" 
            />
            <button 
              onClick={addTag} 
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg px-4 py-2 font-medium transition"
            >
              Add
            </button>
          </div>
        </div>

        {/* Text Editor Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-wrap gap-2 mb-4">
            <button onClick={() => execCommand('bold')} className="p-2 border border-gray-200 rounded-lg hover:bg-gray-100 transition text-gray-700 font-bold">B</button>
            <button onClick={() => execCommand('italic')} className="p-2 border border-gray-200 rounded-lg hover:bg-gray-100 transition text-gray-700 italic">I</button>
            <button onClick={() => execCommand('underline')} className="p-2 border border-gray-200 rounded-lg hover:bg-gray-100 transition text-gray-700 underline">U</button>
            <button onClick={() => execCommand('insertUnorderedList')} className="p-2 border border-gray-200 rounded-lg hover:bg-gray-100 transition text-gray-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
            </button>
            <button onClick={() => execCommand('insertOrderedList')} className="p-2 border border-gray-200 rounded-lg hover:bg-gray-100 transition text-gray-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h11.5a1.5 1.5 0 010 3H3zM3 4h18M3 16h18"></path></svg>
            </button>
          </div>
          
          <div className="relative">
            <div
              ref={contentRef}
              contentEditable
              onInput={handleInput}
              className="min-h-96 border border-gray-200 rounded-lg px-5 py-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
              suppressContentEditableWarning
            />
            {content.length === 0 && (
              <span className="absolute top-4 left-5 text-gray-400 pointer-events-none select-none">
                Write your thoughts here...
              </span>
            )}
          </div>

          <div className="flex justify-end mt-6">
            <button 
              onClick={save} 
              className="bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-lg px-6 py-3 shadow-md transition-all duration-200"
            >
              Save Journal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}