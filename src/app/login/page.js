'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Heart, Sparkles, Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react';

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const router = useRouter();
    const { login } = useAuth();

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            const userData = {
                id: Date.now().toString(),
                name: formData.name || formData.email.split('@')[0],
                email: formData.email,
                photo: ''
            };

            login(userData);
            router.push('/chat');
            setIsLoading(false);
        }, 1500);
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setFormData({ name: '', email: '', password: '' });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-300 to-purple-400 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-300 to-purple-400 rounded-full opacity-20 animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-br from-purple-300 to-pink-400 rounded-full opacity-10 animate-spin" style={{ animationDuration: '20s' }}></div>
            </div>

            <div className="relative w-full max-w-md">
                {/* Logo Section */}
                <div className="text-center mb-8 animate-fade-in">
                    <div className="inline-flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center animate-bounce">
                            <Heart size={24} className="text-white" />
                        </div>
                        <span className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                            Tara
                        </span>
                    </div>
                    <p className="text-gray-600 animate-slide-up">
                        Your AI Best Friend Awaits
                    </p>
                </div>

                {/* Login/Signup Card */}
                <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20 animate-scale-in">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                            {isLogin ? 'Welcome Back!' : 'Join Tara'}
                        </h2>
                        <p className="text-gray-600">
                            {isLogin ? 'Sign in to continue your journey' : 'Create your account to get started'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name Field (Only for Signup) */}
                        {!isLogin && (
                            <div className="animate-slide-down">
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Full Name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition-all duration-200 bg-white/50"
                                        required={!isLogin}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Email Field */}
                        <div className="animate-slide-up">
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email Address"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition-all duration-200 bg-white/50"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="animate-slide-up delay-100">
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="w-full pl-12 pr-12 py-3 rounded-xl border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition-all duration-200 bg-white/50"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2 animate-slide-up delay-200 ${isLoading ? 'opacity-60 cursor-not-allowed' : ''
                                }`}
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    {isLogin ? 'Signing In...' : 'Creating Account...'}
                                </>
                            ) : (
                                <>
                                    <Sparkles size={20} />
                                    {isLogin ? 'Sign In' : 'Create Account'}
                                    <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Toggle Login/Signup */}
                    <div className="text-center mt-6 animate-fade-in delay-300">
                        <p className="text-gray-600">
                            {isLogin ? "Don't have an account?" : "Already have an account?"}
                            <button
                                onClick={toggleMode}
                                className="ml-2 text-purple-600 font-semibold hover:text-purple-700 transition-colors"
                            >
                                {isLogin ? 'Sign Up' : 'Sign In'}
                            </button>
                        </p>
                    </div>

                    {/* Demo Login */}
                    <div className="text-center mt-4 animate-fade-in delay-400">
                        <button
                            onClick={() => {
                                setFormData({
                                    name: 'Demo User',
                                    email: 'demo@tara.ai',
                                    password: 'demo123'
                                });
                                setTimeout(() => {
                                    const userData = {
                                        id: 'demo_user',
                                        name: 'Demo User',
                                        email: 'demo@tara.ai',
                                        photo: ''
                                    };
                                    login(userData);
                                    router.push('/chat');
                                }, 500);
                            }}
                            className="text-sm text-gray-500 hover:text-purple-600 transition-colors underline"
                        >
                            Try Demo Account
                        </button>
                    </div>
                </div>

                {/* Features Preview */}
                <div className="mt-8 text-center animate-fade-in delay-500">
                    <div className="flex justify-center gap-6 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span>AI Conversations</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-200"></div>
                            <span>Auto Journal</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-400"></div>
                            <span>Mood Tracking</span>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-up {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes slide-down {
          from { 
            opacity: 0; 
            transform: translateY(-20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes scale-in {
          from { 
            opacity: 0; 
            transform: scale(0.9); 
          }
          to { 
            opacity: 1; 
            transform: scale(1); 
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
        
        .animate-slide-up {
          animation: slide-up 0.6s ease-out forwards;
        }
        
        .animate-slide-down {
          animation: slide-down 0.6s ease-out forwards;
        }
        
        .animate-scale-in {
          animation: scale-in 0.6s ease-out forwards;
        }
        
        .delay-100 {
          animation-delay: 0.1s;
        }
        
        .delay-200 {
          animation-delay: 0.2s;
        }
        
        .delay-300 {
          animation-delay: 0.3s;
        }
        
        .delay-400 {
          animation-delay: 0.4s;
        }
        
        .delay-500 {
          animation-delay: 0.5s;
        }
      `}</style>
        </div>
    );
}