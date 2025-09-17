import { useState } from 'react';
import { X, User, Heart, Users, GraduationCap, Smile, UsersRound, Sparkles } from 'lucide-react';

export default function AddFriendModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    image: '/profile.jpg',
    description: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const roleOptions = [
    { value: 'mentor', label: 'Mentor', icon: GraduationCap, description: 'Wise guide for life advice' },
    { value: 'siblings', label: 'Siblings', icon: UsersRound, description: 'Caring and supportive sibling' },
    { value: 'good_friend', label: 'Good Friend', icon: Users, description: 'Loyal and understanding friend' },
    { value: 'boyfriend', label: 'Boyfriend', icon: Smile, description: 'Caring romantic partner' },
    { value: 'girlfriend', label: 'Girlfriend', icon: Heart, description: 'Caring romantic partner' },
    { value: 'other', label: 'Other', icon: Sparkles, description: 'Custom connection, define in your words' }
  ];

  const imageOptions = [
    '/profile.jpg',
    '/profile1.jpg',
    '/profile2.jpg',
    '/profile3.jpg',
    '/profile4.jpg'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.role) return;

    setIsLoading(true);
    try {
      await onSubmit(formData);
      onClose();
      setFormData({ name: '', role: '', image: '/profile.jpg', description: '' });
    } catch (error) {
      console.error('Error adding friend:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0  flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl transform transition-all duration-300 scale-100 overflow-y-auto max-h-[80vh]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Add a New Friend</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-[#333]" />
          </button>
        </div>

        <p className="text-gray-600 mb-6">
          Create a new character to chat with. Each character has their own personality and conversation style.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-2" />
              What should we call them?
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter character name"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-pink-300 focus:ring-2 focus:ring-pink-100 focus:outline-none text-gray-800"
              required
            />
          </div>

          {/* Character image selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Choose a profile image
            </label>
            <div className="grid grid-cols-5 gap-3">
              {imageOptions.map((img) => (
                <button
                  type="button"
                  key={img}
                  onClick={() => setFormData((d) => ({ ...d, image: img }))}
                  className={`relative rounded-xl overflow-hidden border-2 p-0 ${
                    formData.image === img ? 'border-pink-400 ring-2 ring-pink-100' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt="profile option" className="w-full h-24 object-cover" />
                  {formData.image === img && (
                    <div className="absolute inset-0 bg-pink-500/10" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              What role should they play?
            </label>
            <div className="grid grid-cols-2 gap-3">
              {roleOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <label
                    key={option.value}
                    className={`relative flex items-center p-3 border-2 rounded-xl cursor-pointer transition-all ${
                      formData.role === option.value
                        ? 'border-pink-300 bg-pink-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={option.value}
                      checked={formData.role === option.value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className="flex items-center space-x-2 w-full">
                      <Icon className="w-4 h-4 text-pink-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-800 text-sm">{option.label}</div>
                        <div className="text-xs text-gray-500 truncate">{option.description}</div>
                      </div>
                    </div>
                    {formData.role === option.value && (
                      <div className="absolute top-2 right-2">
                        <div className="w-3 h-3 bg-pink-500 rounded-full flex items-center justify-center">
                          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                        </div>
                      </div>
                    )}
                  </label>
                );
              })}
            </div>
          </div>

          {formData.role === 'other' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Describe this relationship (optional)
              </label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="e.g., Coach, colleague, cousin..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-pink-300 focus:ring-2 focus:ring-pink-100 focus:outline-none text-gray-800"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !formData.name || !formData.role}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            {isLoading ? 'Adding Friend...' : 'Add Friend'}
          </button>
        </form>
      </div>
    </div>
  );
}
