'use client';

import { useState, useEffect, useCallback } from 'react';
import { Edit3, Heart, MessageCircle, Share, Calendar, Sparkles, RefreshCw, Trash2 } from 'lucide-react';

export default function JournalingPage() {
  const [journalEntries, setJournalEntries] = useState([]);
  const [userId, setUserId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [showTodayPrompt, setShowTodayPrompt] = useState(false);

  // Define loadJournalEntries first
  const loadJournalEntries = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/journal/feed?userId=${encodeURIComponent(userId)}`, {
        cache: 'no-store'
      });
      if (res.ok) {
        const data = await res.json();
        setJournalEntries(data.entries || []);
      }
    } catch (error) {
      console.error('Error loading journal entries:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    const id = typeof window !== 'undefined' ? localStorage.getItem('tara_user_id') : '';
    setUserId(id || '');
  }, []);

  // Load journal entries when userId changes
  useEffect(() => {
    if (userId) {
      loadJournalEntries();
    }
  }, [userId, loadJournalEntries]);

  // Check if today's entry exists and suggest generation
  useEffect(() => {
    if (journalEntries.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayEntry = journalEntries.find(entry => {
        const entryDate = new Date(entry.date);
        entryDate.setHours(0, 0, 0, 0);
        return entryDate.getTime() === today.getTime();
      });

      // If no entry for today, show suggestion
      if (!todayEntry && !isGenerating) {
        setShowTodayPrompt(true);
      } else {
        setShowTodayPrompt(false);
      }
    }
  }, [journalEntries, isGenerating]);

  const generateDailyEntry = async () => {
    if (!userId) {
      alert('User not found. Please set up your profile first.');
      return;
    }

    try {
      setIsGenerating(true);
      const res = await fetch('/api/journal/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });

      const data = await res.json();

      if (!res.ok) {
        if (data?.error?.includes('already exists')) {
          alert('Today\'s journal entry already exists! You can edit it.');
        } else {
          throw new Error(data?.error || 'Failed to generate entry');
        }
        return;
      }

      // Show success message
      if (data?.message) {
        alert(data.message);
      }

      // Reload entries to show the new one
      await loadJournalEntries();

    } catch (e) {
      console.error('Generate error:', e);
      alert(e.message || 'Something went wrong while generating entry');
    } finally {
      setIsGenerating(false);
    }
  };

  const startEditing = (entry) => {
    setEditingEntry(entry._id);
    setEditContent(entry.content);
  };

  const saveEdit = async (entryId) => {
    try {
      const res = await fetch('/api/journal/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entryId,
          userId,
          content: editContent
        })
      });

      if (res.ok) {
        setEditingEntry(null);
        setEditContent('');
        await loadJournalEntries();
      }
    } catch (error) {
      console.error('Error updating entry:', error);
    }
  };

  const cancelEdit = () => {
    setEditingEntry(null);
    setEditContent('');
  };

  const deleteEntry = async (entryId) => {
    if (!confirm('Are you sure you want to delete this journal entry?')) {
      return;
    }

    try {
      const res = await fetch('/api/journal/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entryId, userId })
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message || 'Entry deleted successfully!');
        await loadJournalEntries();
      } else {
        alert(data.error || 'Failed to delete entry');
      }
    } catch (error) {
      console.error('Error deleting entry:', error);
      alert('Something went wrong while deleting');
    }
  };

  const generateDayEndJournal = async () => {
    if (!userId) {
      alert('User not found. Please set up your profile first.');
      return;
    }

    try {
      setIsGenerating(true);
      const res = await fetch('/api/journal/daily-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || 'Failed to generate journal');
      }

      // Show success message
      if (data?.message) {
        alert(data.message);
      }

      // Reload entries to show the new one
      await loadJournalEntries();

    } catch (e) {
      console.error('Generate error:', e);
      alert(e.message || 'Something went wrong while generating journal');
    } finally {
      setIsGenerating(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen py-4">
        <div className="max-w-2xl mx-auto px-4">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-4">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Journal</h1>
            <p className="text-gray-600">Complete day reflections based on all conversations</p>
          </div>
          <button
            onClick={generateDayEndJournal}
            disabled={isGenerating}
            className={`flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 ${isGenerating ? 'opacity-60 cursor-not-allowed' : 'hover:scale-105'
              }`}
          >
            {isGenerating ? (
              <RefreshCw size={18} className="animate-spin" />
            ) : (
              <Sparkles size={18} />
            )}
            {isGenerating ? 'Generating...' : 'Generate Today\'s Journal'}
          </button>
        </div>



        {/* Journal Feed */}
        <div className="space-y-6">
          {journalEntries.length === 0 ? (
            <div className="text-center py-12">
              <Sparkles size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No journal entries yet</h3>
              <p className="text-gray-600 mb-6">Start chatting and your journal will automatically update!</p>

            </div>
          ) : (
            journalEntries.map((entry) => (
              <div key={entry._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
                {/* Entry Header */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center">
                        <Calendar size={20} className="text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Daily Reflection</h3>
                        <p className="text-sm text-gray-500">{formatDate(entry.date)}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => startEditing(entry)}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                        title="Edit entry"
                      >
                        <Edit3 size={16} className="text-gray-500" />
                      </button>
                      <button
                        onClick={() => deleteEntry(entry._id)}
                        className="p-2 rounded-full hover:bg-red-100 transition-colors"
                        title="Delete entry"
                      >
                        <Trash2 size={16} className="text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Entry Content */}
                <div className="p-4">
                  {editingEntry === entry._id ? (
                    <div className="space-y-4">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                        rows={6}
                        placeholder="Edit your journal entry..."
                      />
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={cancelEdit}
                          className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => saveEdit(entry._id)}
                          className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="prose prose-gray max-w-none">
                      <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{entry.content}</p>
                    </div>
                  )}
                </div>

                {/* Entry Actions */}
                {editingEntry !== entry._id && (
                  <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <button className="flex items-center gap-2 text-gray-600 hover:text-pink-600 transition-colors">
                          <Heart size={18} />
                          <span className="text-sm">Like</span>
                        </button>
                        <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                          <MessageCircle size={18} />
                          <span className="text-sm">Reflect</span>
                        </button>
                      </div>
                      <button className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors">
                        <Share size={18} />
                        <span className="text-sm">Share</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}