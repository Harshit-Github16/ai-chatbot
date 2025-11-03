'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
    const router = useRouter();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handleGetStarted = () => {
        router.push('/login');
    };

    const handleLearnMore = () => {
        document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-gradient-therapeutic">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-subtle">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-sm">EI</span>
                            </div>
                            <span className="ml-3 text-xl font-semibold text-primary-700">Emotional Insights</span>
                        </div>
                        <div className="hidden md:flex items-center space-x-8">
                            <a href="#features" className="text-text-secondary hover:text-primary-600 transition-smooth">Features</a>
                            <a href="#about" className="text-text-secondary hover:text-primary-600 transition-smooth">About</a>
                            <a href="#contact" className="text-text-secondary hover:text-primary-600 transition-smooth">Contact</a>
                            <button
                                onClick={handleGetStarted}
                                className="bg-primary-500 text-white px-6 py-2 rounded-full hover:bg-primary-600 transition-smooth"
                            >
                                Get Started
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-20 left-10 text-4xl opacity-20 animate-pulse text-white">✨</div>
                    <div className="absolute top-40 right-20 text-3xl opacity-15 animate-pulse text-white" style={{ animationDelay: '1s' }}>💫</div>
                    <div className="absolute bottom-40 left-20 text-5xl opacity-10 animate-pulse text-white" style={{ animationDelay: '2s' }}>🌟</div>
                    <div className="absolute bottom-20 right-10 text-3xl opacity-20 animate-pulse text-white" style={{ animationDelay: '0.5s' }}>💖</div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                            Understand Your <span className="text-accent-200">Emotions</span>,<br />
                            Transform Your Life
                        </h1>
                        <p className="text-xl text-white/90 mb-8 leading-relaxed max-w-3xl mx-auto">
                            Turn your daily emotions into powerful insights with AI-powered journaling.
                            Discover patterns, identify triggers, and accelerate your personal growth journey.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={handleGetStarted}
                                className="bg-white text-primary-700 px-8 py-4 rounded-full font-semibold text-lg hover:bg-primary-50 transition-smooth shadow-lg"
                            >
                                Start Your Journey
                            </button>
                            <button
                                onClick={handleLearnMore}
                                className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/10 transition-smooth"
                            >
                                Learn More
                            </button>
                        </div>
                        <div className="mt-8 flex items-center justify-center space-x-6 text-white/80">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                </svg>
                                Free to start
                            </div>
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                </svg>
                                AI-powered insights
                            </div>
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                </svg>
                                Privacy focused
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-text-primary mb-6">
                            Transform Your Emotional Awareness
                        </h2>
                        <p className="text-xl text-text-secondary max-w-3xl mx-auto">
                            Our AI-powered platform turns your daily conversations into meaningful insights for personal growth.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-surface rounded-2xl p-8 shadow-glassmorphism border border-subtle">
                            <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center mb-6">
                                <span className="text-3xl">🧠</span>
                            </div>
                            <h3 className="text-xl font-semibold text-text-primary mb-4">AI-Powered Analysis</h3>
                            <p className="text-text-secondary">
                                Advanced AI analyzes your daily conversations to identify emotional patterns, triggers, and growth opportunities.
                            </p>
                        </div>

                        <div className="bg-surface rounded-2xl p-8 shadow-glassmorphism border border-subtle">
                            <div className="w-16 h-16 bg-secondary-100 rounded-xl flex items-center justify-center mb-6">
                                <span className="text-3xl">📊</span>
                            </div>
                            <h3 className="text-xl font-semibold text-text-primary mb-4">Beautiful Insights</h3>
                            <p className="text-text-secondary">
                                Visualize your emotional journey with stunning charts and personalized insights that make growth tangible.
                            </p>
                        </div>

                        <div className="bg-surface rounded-2xl p-8 shadow-glassmorphism border border-subtle">
                            <div className="w-16 h-16 bg-accent-100 rounded-xl flex items-center justify-center mb-6">
                                <span className="text-3xl">🌱</span>
                            </div>
                            <h3 className="text-xl font-semibold text-text-primary mb-4">Personal Growth</h3>
                            <p className="text-text-secondary">
                                Get personalized recommendations and track your progress as you develop emotional intelligence.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 bg-gradient-to-br from-primary-50 to-secondary-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-text-primary mb-6">How It Works</h2>
                        <p className="text-xl text-text-secondary max-w-3xl mx-auto">
                            Simple steps to unlock your emotional intelligence
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="text-white text-2xl font-bold">1</span>
                            </div>
                            <h3 className="text-xl font-semibold text-text-primary mb-4">Chat Daily</h3>
                            <p className="text-text-secondary">
                                Have natural conversations about your day, feelings, and experiences through our chat interface.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-20 h-20 bg-secondary-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="text-white text-2xl font-bold">2</span>
                            </div>
                            <h3 className="text-xl font-semibold text-text-primary mb-4">AI Analysis</h3>
                            <p className="text-text-secondary">
                                Our AI processes your conversations to identify patterns, emotions, and meaningful insights.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-20 h-20 bg-accent-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="text-white text-2xl font-bold">3</span>
                            </div>
                            <h3 className="text-xl font-semibold text-text-primary mb-4">Grow & Reflect</h3>
                            <p className="text-text-secondary">
                                Review your personalized journal entries and insights to accelerate your personal growth.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-therapeutic">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl font-bold text-white mb-6">
                        Ready to Transform Your Emotional Journey?
                    </h2>
                    <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                        Join thousands who've discovered the power of AI-driven emotional insights.
                    </p>
                    <button
                        onClick={handleGetStarted}
                        className="bg-white text-primary-700 px-8 py-4 rounded-full font-semibold text-lg hover:bg-primary-50 transition-smooth shadow-xl"
                    >
                        Start Your Free Journey
                    </button>
                    <p className="text-white/70 mt-4 text-sm">
                        No credit card required • Free to start • Privacy protected
                    </p>
                </div>
            </section>

            {/* Footer */}
            <footer id="contact" className="bg-text-primary text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div>
                            <div className="flex items-center mb-4">
                                <div className="w-8 h-8 bg-primary-400 rounded-full flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">EI</span>
                                </div>
                                <span className="ml-3 text-xl font-semibold">Emotional Insights</span>
                            </div>
                            <p className="text-white/70 mb-4">
                                Transform your emotional awareness with AI-powered insights and beautiful journaling.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                            <ul className="space-y-2 text-white/70">
                                <li><a href="#features" className="hover:text-white transition-smooth">Features</a></li>
                                <li><a href="#about" className="hover:text-white transition-smooth">About</a></li>
                                <li><a href="/privacy" className="hover:text-white transition-smooth">Privacy Policy</a></li>
                                <li><a href="/terms" className="hover:text-white transition-smooth">Terms of Service</a></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-4">Get Started</h3>
                            <p className="text-white/70 mb-4">
                                Ready to begin your emotional growth journey?
                            </p>
                            <button
                                onClick={handleGetStarted}
                                className="bg-primary-500 text-white px-6 py-2 rounded-full hover:bg-primary-600 transition-smooth"
                            >
                                Start Now
                            </button>
                        </div>
                    </div>

                    <div className="border-t border-white/20 mt-12 pt-8 text-center text-white/70">
                        <p>&copy; 2024 Emotional Insights. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}