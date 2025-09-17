'use client';

import { useState, useRef } from 'react';
import { Plus, History } from 'lucide-react';

export default function JournalingPage() {
  const [tags, setTags] = useState(['work', 'personal', 'ideas']);
  const [newTag, setNewTag] = useState('');
  const [activeTag, setActiveTag] = useState('work');
  const [content, setContent] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [historyVisible, setHistoryVisible] = useState(false);
  const contentRef = useRef(null);

  const addTag = () => {
    const t = newTag.trim().toLowerCase();
    if (!t || tags.includes(t)) return;
    setTags([...tags, t]);
    setNewTag('');
    setActiveTag(t);
    setShowModal(false);
  };

  const save = () => {
    if (!activeTag || !content.trim()) return;
    alert(`Saved for ${activeTag}!`);
    setContent('');
    if (contentRef.current) contentRef.current.innerHTML = '';
  };

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    if (contentRef.current) contentRef.current.focus();
  };

  const handleInput = (e) => {
    setContent(e.currentTarget.innerHTML);
  };

  const toggleHistory = () => {
    if (!historyVisible) {
      const dummy = `<p><b>Past Reflection:</b> Today was productive. I completed my tasks and learned something new.</p>`;
      setContent(dummy);
      if (contentRef.current) contentRef.current.innerHTML = dummy;
      setHistoryVisible(true);
    } else {
      setContent('');
      if (contentRef.current) contentRef.current.innerHTML = '';
      setHistoryVisible(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-3 sm:py-4">
      <div className="max-w-4xl mx-auto px-3 sm:px-4">
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-4 sm:p-6 h-auto min-h-[70vh] md:min-h-[80vh] lg:min-h-[85vh]">
          
          {/* Tags + Actions Row */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {tags.map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTag(t)}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-all
                    ${activeTag === t
                      ? 'bg-gradient-to-r from-pink-100 to-pink-200 text-pink-700 shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="p-1.5 sm:p-2 rounded-full bg-pink-100 hover:bg-pink-200 text-pink-600 transition"
            >
              <Plus size={20} />
            </button>
            <button
              onClick={toggleHistory}
              className="p-1.5 sm:p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
            >
              <History size={20} />
            </button>
          </div>

          {/* Toolbar Row */}
          <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
            <button
              onClick={() => execCommand('bold')}
              className="p-2 border rounded-lg hover:bg-gray-100 font-bold"
            >
              B
            </button>
            <button
              onClick={() => execCommand('italic')}
              className="p-2 border rounded-lg hover:bg-gray-100 italic"
            >
              I
            </button>
            <button
              onClick={() => execCommand('underline')}
              className="p-2 border rounded-lg hover:bg-gray-100 underline"
            >
              U
            </button>
          </div>

          {/* Editor Box */}
          <div className="relative">
            <div
              ref={contentRef}
              contentEditable
              onInput={handleInput}
              className="min-h-[40vh] sm:min-h-[46vh] border border-gray-200 rounded-lg px-3 sm:px-4 py-3 text-gray-800 focus:outline-none focus:ring-2
               focus:ring-pink-400 transition-all prose max-w-none h-[55vh] sm:h-[61vh] overflow-y-auto"
              suppressContentEditableWarning
            />
            {content.length === 0 && (
              <span className="absolute top-3 left-4 text-gray-400 pointer-events-none select-none text-sm sm:text-base">
                Write your thoughts here...
              </span>
            )}
          </div>

          <div className="flex justify-end mt-5 sm:mt-6">
            <button
              onClick={save}
              className="bg-gradient-to-r from-pink-100 to-pink-200 hover:from-pink-200 hover:to-pink-300 text-pink-700 font-medium rounded-lg px-5 sm:px-6 py-2 shadow-sm transition-all duration-200 text-sm w-full sm:w-auto"
            >
              Save
            </button>
          </div>
        </div>

        {/* Add Tag Modal */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 px-3">
            <div className="bg-white rounded-xl shadow-lg p-5 sm:p-6 w-[90%] max-w-sm sm:max-w-md md:w-96">
              <h2 className="text-lg font-semibold mb-4">Add New Tag</h2>
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTag()}
                placeholder="Enter tag name..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
              <div className="flex flex-wrap justify-end gap-2 sm:gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg border hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={addTag}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-pink-100 to-pink-200 hover:from-pink-200 hover:to-pink-300 text-pink-700 font-medium"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
