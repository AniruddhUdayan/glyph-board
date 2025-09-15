import AnimatedBackground from '../components/AnimatedBackground';
import { AnimatedNavigation, AnimatedHeroContent, AnimatedSubtitle, AnimatedCTAButtons } from '../components/AnimatedElements';

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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
        <AnimatedBackground />

      
      <AnimatedNavigation>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center transform rotate-12 shadow-lg">
                <span className="text-white font-bold text-lg transform -rotate-12">G</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Glyph Board
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium">
                Features
              </a>
              <a href="#about" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium">
                About
              </a>
              <a href="/signup" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-medium inline-block">
                Get Started
              </a>
            </div>
          </div>
        </div>
      </AnimatedNavigation>

      
      <main className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 pt-20 pb-32">
          <div className="text-center">
            <AnimatedHeroContent>
              <h1 className="text-6xl md:text-7xl font-bold mb-8">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight block">
                  Create.
                </span>
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent leading-tight block">
                  Collaborate.
                </span>
                <span className="bg-gradient-to-r from-pink-600 via-orange-600 to-red-600 bg-clip-text text-transparent leading-tight block">
                  Communicate.
                </span>
              </h1>
            </AnimatedHeroContent>

            <AnimatedSubtitle>
              The intuitive digital whiteboard that brings your ideas to life. 
              Perfect for brainstorming, planning, and real-time collaboration.
            </AnimatedSubtitle>

            <AnimatedCTAButtons />
          </div>
        </div>
      </main>

      
      <section id="features" className="relative z-10 py-24 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Everything you need
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features that make collaboration seamless and creativity limitless.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🎨",
                title: "Intuitive Drawing",
                description: "Express your ideas with smooth, responsive drawing tools and shapes."
              },
              {
                icon: "👥",
                title: "Real-time Collaboration",
                description: "Work together in real-time with live cursors and instant updates."
              },
              {
                icon: "🚀",
                title: "Lightning Fast",
                description: "Optimized performance for smooth experience across all devices."
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="group p-8 rounded-2xl bg-white border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

        <footer className="relative z-10 py-12 text-center text-gray-500">
          <div className="max-w-7xl mx-auto px-6">
            <p>&copy; 2024 Glyph Board. Made with ❤️ for creators and collaborators.</p>
          </div>
        </footer>
      </div>
    </>
  );
}
