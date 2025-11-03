'use client';

export default function Navigation() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <svg className="w-8 h-8 text-primary-500" viewBox="0 0 32 32" fill="currentColor">
              <path d="M16 2C8.268 2 2 8.268 2 16s6.268 14 14 14 14-6.268 14-14S23.732 2 16 2zm0 4c1.105 0 2 .895 2 2s-.895 2-2 2-2-.895-2-2 .895-2 2-2zm-6 8c1.105 0 2 .895 2 2s-.895 2-2 2-2-.895-2-2 .895-2 2-2zm12 0c1.105 0 2 .895 2 2s-.895 2-2 2-2-.895-2-2 .895-2 2-2zm-6 8c1.105 0 2 .895 2 2s-.895 2-2 2-2-.895-2-2 .895-2 2-2z"/>
            </svg>
            <span className="ml-2 text-xl font-semibold text-primary-700">Emotional Insights</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-text-secondary hover:text-primary-600 transition-smooth">Features</a>
            <a href="#dashboard" className="text-text-secondary hover:text-primary-600 transition-smooth">Dashboard</a>
            <a href="#testimonials" className="text-text-secondary hover:text-primary-600 transition-smooth">Reviews</a>
            <a href="#pricing" className="text-text-secondary hover:text-primary-600 transition-smooth">Pricing</a>
            <button className="bg-primary-500 text-white px-6 py-2 rounded-full hover:bg-primary-600 transition-smooth">Start Free Trial</button>
          </div>
          <button className="md:hidden p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}

