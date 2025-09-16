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
  },
  "featureList": [
    "Real-time collaboration",
    "Intuitive drawing tools",
    "Multi-device support",
    "Lightning fast performance"
  ]
};

export default function Home() {
  return (
    <ProtectedRoute requireAuth={false}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        {/* Artistic Background */}
        <div className="absolute inset-0">
          {/* Dynamic Grid */}
          <div className="absolute inset-0 opacity-[0.05]">
            <div className="h-full w-full" style={{
              backgroundImage: `
                linear-gradient(rgba(139, 92, 246, 0.4) 1px, transparent 1px),
                linear-gradient(90deg, rgba(139, 92, 246, 0.4) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }} />
          </div>

          {/* Floating Creative Elements */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Large artistic shapes */}
            <div className="absolute top-20 left-[5%] w-40 h-32 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-[2rem] transform rotate-12 animate-pulse">
              <div className="p-8 flex items-center justify-center">
                <svg className="w-16 h-16 text-blue-400/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
            </div>
            
            <div className="absolute top-32 right-[8%] w-36 h-36 bg-gradient-to-r from-pink-500/10 to-orange-500/10 rounded-full animate-bounce delay-300">
              <div className="p-10 flex items-center justify-center">
                <svg className="w-16 h-16 text-pink-400/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>

            <div className="absolute bottom-32 left-[12%] w-44 h-28 bg-gradient-to-r from-green-500/10 to-teal-500/10 rounded-[2rem] transform -rotate-12 animate-pulse delay-500">
              <div className="p-6 flex items-center justify-center">
                <svg className="w-16 h-16 text-green-400/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>

            {/* Connecting artistic lines */}
            <svg className="absolute top-[25%] left-[25%] w-64 h-48" viewBox="0 0 256 192">
              <path
                d="M30 96 Q96 30 162 96 T224 96"
                stroke="rgba(139, 92, 246, 0.15)"
                strokeWidth="2"
                fill="none"
                strokeDasharray="8,8"
                className="animate-pulse"
              />
            </svg>
            <svg className="absolute bottom-[20%] right-[20%] w-48 h-32" viewBox="0 0 192 128">
              <path
                d="M20 64 C40 20, 80 108, 120 64 S180 20, 172 64"
                stroke="rgba(236, 72, 153, 0.15)"
                strokeWidth="2"
                fill="none"
                strokeDasharray="6,6"
                className="animate-pulse delay-700"
              />
            </svg>
          </div>
        </div>
      
      <AnimatedNavigation>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center transform rotate-12 shadow-2xl">
                <span className="text-white font-bold text-xl transform -rotate-12">G</span>
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Glyph Board
              </span>
                <p className="text-sm text-gray-400">Creative Collaboration Platform</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-blue-400 transition-colors duration-200 font-medium">
                Features
              </a>
              <a href="#about" className="text-gray-300 hover:text-purple-400 transition-colors duration-200 font-medium">
                About
              </a>
              <a href="/signup" className="px-6 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-500/30 text-blue-200 hover:from-blue-500/30 hover:to-purple-500/30 hover:border-blue-400/50 hover:text-blue-100 rounded-xl hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-medium inline-block">
                Start Creating
              </a>
            </div>
          </div>
        </div>
      </AnimatedNavigation>

      
      <main className="relative z-10">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-6 pt-20 pb-16">
          <div className="text-center">
            <AnimatedHeroContent>
              <div className="relative">
                {/* Floating artistic elements around title */}
                <div className="absolute -top-8 -left-16 w-8 h-8 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-full animate-bounce delay-1000" />
                <div className="absolute -top-4 -right-12 w-6 h-6 bg-gradient-to-r from-pink-500/30 to-orange-500/30 rounded-full animate-pulse delay-1200" />
                
                <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
                  <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent block">
                  Create.
                </span>
                  <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent block">
                  Collaborate.
                </span>
                  <span className="bg-gradient-to-r from-pink-400 via-orange-400 to-red-400 bg-clip-text text-transparent block">
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
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

                <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                  Experience the full power of our drawing tools instantly. Perfect for quick sketches, 
                  brainstorming, or testing out ideas without any commitment.
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
                    <span>No registration needed</span>
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

              {/* Full Experience Path */}
              <div className="group relative bg-gradient-to-br from-blue-900/40 to-teal-900/30 backdrop-blur-xl border border-blue-500/30 rounded-3xl p-8 hover:border-blue-400/50 transition-all duration-500">
                <div className="absolute -top-2 -right-6 w-10 h-10 bg-gradient-to-r from-blue-500/20 to-teal-500/20 rounded-2xl rotate-45 animate-pulse delay-200" />
                
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-teal-600 rounded-3xl flex items-center justify-center group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 shadow-2xl">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-2">Full Collaboration</h3>
                    <p className="text-blue-200 font-medium">Unlock everything!</p>
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
        </section>
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
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
              <div className="absolute -top-4 -right-6 w-8 h-8 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full animate-bounce delay-300" />
              
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Start Creating?
              </h2>
              <p className="text-xl text-gray-300 mb-10 leading-relaxed">
                Join thousands of creators, educators, and innovators who are already 
                bringing their ideas to life on Glyph Board.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <a
                  href="/signup"
                  className="px-10 py-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-500/40 text-blue-100 hover:from-blue-500/30 hover:to-purple-500/30 hover:border-blue-400/60 hover:text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 group"
                >
                  <span className="flex items-center space-x-2">
                    <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    <span>Start Creating Free</span>
                  </span>
                </a>
                <a
                  href="/signin"
                  className="px-10 py-4 bg-gradient-to-r from-slate-700/30 to-slate-600/30 backdrop-blur-sm border border-slate-500/30 text-slate-200 hover:from-slate-600/40 hover:to-slate-500/40 hover:border-slate-400/50 hover:text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group"
                >
                  <span className="flex items-center space-x-2">
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    <span>Sign In</span>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </section>

        <footer className="relative z-10 py-12 bg-slate-900/50 backdrop-blur-xl border-t border-purple-500/20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center transform rotate-12">
                  <span className="text-white font-bold transform -rotate-12">G</span>
                </div>
                <div>
                  <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Glyph Board
                  </span>
                  <p className="text-sm text-gray-400">Where creativity comes alive</p>
                </div>
              </div>
              
              <div className="text-center md:text-right">
                <p className="text-gray-400 mb-2">
                  &copy; 2024 Glyph Board. Made with 
                  <span className="text-pink-400 mx-1">❤️</span> 
                  for creators and collaborators.
                </p>
                <p className="text-sm text-gray-500">
                  Empowering creativity through collaborative technology
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </ProtectedRoute>
  );
}
