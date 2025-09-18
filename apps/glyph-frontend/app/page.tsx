"use client";

import AnimatedBackground from '../components/AnimatedBackground';
import { AnimatedNavigation, AnimatedHeroContent, AnimatedSubtitle, AnimatedCTAButtons } from '../components/AnimatedElements';
import ProtectedRoute from '../components/ProtectedRoute';
import { useAuth } from '../lib/auth-context';
import { Button } from '../components/ui/Button';

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Glyph Board",
  "description": "Collaborative digital whiteboard for teams and individuals. Create, collaborate, and communicate with intuitive drawing tools.",
  "url": "https://glyphboard.com",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
};

export default function HomePage() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <ProtectedRoute requireAuth={false}>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        
        <AnimatedBackground />
        
        {/* Navigation */}
        <AnimatedNavigation>
          <nav className="relative z-20 w-full px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center transform rotate-12">
                  <span className="text-white font-bold transform -rotate-12">G</span>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Glyph Board
                </span>
              </div>
              
              <div className="flex items-center space-x-4">
                {user ? (
                  <>
                    <Button variant="ghost" onClick={() => window.location.href = '/dashboard'}>
                      Dashboard
                    </Button>
                    <Button variant="elegant" onClick={handleLogout}>
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" onClick={() => window.location.href = '/signin'}>
                      Sign In
                    </Button>
                    <Button variant="artistic" onClick={() => window.location.href = '/signup'}>
                      Get Started
                    </Button>
                  </>
                )}
              </div>
            </div>
          </nav>
        </AnimatedNavigation>

        {/* Hero Section */}
        <main className="relative z-10 pt-8 pb-20">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <AnimatedHeroContent>
              <div className="relative">
                {/* Decorative elements */}
                <div className="absolute -top-8 -left-12 w-24 h-24 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-xl animate-pulse" />
                <div className="absolute -top-4 -right-8 w-16 h-16 bg-gradient-to-r from-pink-500/10 to-orange-500/10 rounded-full blur-lg animate-pulse delay-1000" />
                
                <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
                  <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Create.
                  </span>
                  <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                    Collaborate.
                  </span>
                  <span className="block bg-gradient-to-r from-pink-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
                    Inspire.
                  </span>
                </h1>
              </div>
            </AnimatedHeroContent>

            <AnimatedSubtitle>
              <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-16">
                The ultimate digital canvas where 
                <span className="text-blue-300 font-semibold"> artistic vision</span> meets 
                <span className="text-purple-300 font-semibold"> collaborative power</span>. 
                Perfect for designers, educators, and creative teams.
              </p>
            </AnimatedSubtitle>

            {/* Main Action Cards - Aligned with buttons */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Instant Canvas Card */}
              <div className="group relative bg-gradient-to-br from-purple-900/40 to-pink-900/30 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-8 hover:border-purple-400/50 transition-all duration-500">
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl rotate-12 animate-pulse" />
                
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-2xl">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-2">Instant Canvas</h3>
                    <p className="text-purple-200 font-medium">Try without signing up</p>
                  </div>
                </div>

                <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                  Experience our full drawing toolkit instantly. Perfect for quick sketches, 
                  brainstorming, or exploring what Glyph Board can do.
                </p>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center space-x-3 text-sm text-purple-200">
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>All drawing tools available</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-purple-200">
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Start creating in seconds</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-400">
                    <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <span>Work is not saved</span>
                  </div>
                </div>

                <a
                  href="/demo"
                  className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-purple-500/30 to-pink-500/30 backdrop-blur-sm border border-purple-500/40 text-purple-100 hover:from-purple-500/40 hover:to-pink-500/40 hover:border-purple-400/60 hover:text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 group"
                >
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Try Instant Canvas</span>
                </a>
              </div>

              {/* Full Experience Card */}
              <div className="group relative bg-gradient-to-br from-blue-900/40 to-teal-900/30 backdrop-blur-xl border border-blue-500/30 rounded-3xl p-8 hover:border-blue-400/50 transition-all duration-500">
                <div className="absolute -top-2 -right-6 w-10 h-10 bg-gradient-to-r from-blue-500/20 to-teal-500/20 rounded-2xl rotate-45 animate-pulse delay-200" />
                
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-teal-600 rounded-3xl flex items-center justify-center group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 shadow-2xl">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 715.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-2">Full Collaboration</h3>
                    <p className="text-blue-200 font-medium">Unlock everything</p>
                  </div>
                </div>

                <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                  Create an account to access real-time collaboration, cloud saving, 
                  team workspaces, and advanced sharing features.
                </p>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center space-x-3 text-sm text-blue-200">
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Real-time multi-user collaboration</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-blue-200">
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Cloud save & sync across devices</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-blue-200">
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Share boards with teams</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-blue-200">
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Advanced learning sessions</span>
                  </div>
                </div>

                <a
                  href="/signup"
                  className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-blue-500/30 to-teal-500/30 backdrop-blur-sm border border-blue-500/40 text-blue-100 hover:from-blue-500/40 hover:to-teal-500/40 hover:border-blue-400/60 hover:text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 group"
                >
                  <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  <span>Start Creating Account</span>
                </a>
              </div>
            </div>
          </div>
        </main>

      <section id="features" className="relative z-10 py-24 bg-gradient-to-r from-slate-800/30 to-purple-800/30 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-8">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Unleash Your Creativity
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Powerful tools designed for artists, educators, and creative minds. 
              Where imagination meets technology in perfect harmony.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                ),
                gradient: "from-blue-600 to-purple-600",
                title: "Intuitive Drawing Tools",
                description: "Professional-grade drawing experience with brushes, shapes, and precision tools. Express your ideas with fluid, responsive strokes.",
                features: ["Vector & raster tools", "Pressure sensitivity", "Custom brushes", "Shape libraries"]
              },
              {
                icon: (
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 715.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                ),
                gradient: "from-green-600 to-teal-600",
                title: "Real-time Collaboration",
                description: "Work together seamlessly with live cursors, instant updates, and synchronized drawing. Perfect for team brainstorming and remote workshops.",
                features: ["Live multi-user editing", "Voice & video integration", "Shared workspaces", "Real-time sync"]
              },
              {
                icon: (
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                ),
                gradient: "from-pink-600 to-orange-600",
                title: "Knowledge Sessions",
                description: "Transform your boards into interactive learning experiences. Perfect for tutorials, workshops, and educational content creation.",
                features: ["Interactive presentations", "Screen recording", "Session templates", "Learning analytics"]
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative bg-gradient-to-br from-slate-800/50 to-purple-800/30 backdrop-blur-xl border border-purple-500/20 rounded-3xl p-8 hover:border-purple-400/40 transition-all duration-500 transform hover:-translate-y-2"
              >
                {/* Floating elements */}
                <div className="absolute -top-3 -right-3 w-6 h-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full animate-pulse delay-300" />
                
                <div className={`w-20 h-20 bg-gradient-to-r ${feature.gradient} rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-2xl`}>
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-blue-200 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-300 leading-relaxed mb-6">
                  {feature.description}
                </p>
                
                <div className="space-y-2">
                  {feature.features.map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-3 text-sm text-gray-400">
                      <div className={`w-1.5 h-1.5 bg-gradient-to-r ${feature.gradient} rounded-full animate-pulse`} style={{animationDelay: `${idx * 100}ms`}} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="relative z-10 py-20 bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="relative">
            {/* Floating elements */}
            <div className="absolute -top-6 -left-8 w-12 h-12 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl rotate-12 animate-pulse" />
            <div className="absolute -bottom-4 -right-6 w-8 h-8 bg-gradient-to-r from-pink-500/20 to-orange-500/20 rounded-xl rotate-45 animate-pulse delay-500" />
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Ready to Create Something Amazing?
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
              Join thousands of creators, educators, and teams who have already transformed 
              their ideas into visual masterpieces. Your journey starts here.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a
                href="/demo"
                className="group flex items-center justify-center space-x-3 px-8 py-4 bg-gradient-to-r from-purple-600/80 to-pink-600/80 backdrop-blur-sm border border-purple-500/50 text-white hover:from-purple-600 hover:to-pink-600 hover:border-purple-400 font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <svg className="w-6 h-6 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Try Instant Canvas</span>
              </a>
              
              <a
                href="/signup"
                className="group flex items-center justify-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-600/80 to-teal-600/80 backdrop-blur-sm border border-blue-500/50 text-white hover:from-blue-600 hover:to-teal-600 hover:border-blue-400 font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                <span>Start Creating Account</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative z-10 py-12 bg-slate-900/50 backdrop-blur-xl border-t border-purple-500/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Glyph Board</h3>
                <p className="text-sm text-gray-400">Where creativity meets collaboration</p>
              </div>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-gray-400 text-sm">
                © 2024 Glyph Board. Empowering creative minds worldwide.
              </p>
              <div className="flex items-center justify-center md:justify-end space-x-6 mt-2">
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">Privacy</a>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">Terms</a>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">Support</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  </ProtectedRoute>
  );
}