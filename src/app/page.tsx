"use client";

import React from 'react';
import Link from 'next/link';
import { Mic, ArrowRight, Sparkles, TrendingUp } from 'lucide-react';

/**
 * REVOLUTIONARY WARM LANDING PAGE
 * "Morning Coffee Shop" aesthetic - warm, inviting, human-centered
 * 
 * Features:
 * - Warm cream background with organic blob animations
 * - Floating pill navigation
 * - Conversation-first messaging
 * - Coral orange accents
 * - Brown text (not gray)
 */
export default function LandingPage() {
  const exampleCommands = [
    "Show me my spending by category",
    "Am I overspending anywhere?",
    "What's my budget status?",
    "List my recent transactions",
    "Set dining budget to three hundred dollars",
    "How can I save more money?",
  ];

  return (
    <div className="min-h-screen bg-[#FFF8F0] text-[#2D1B0E] overflow-hidden relative">
      {/* Warm Animated Blob Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Large Blob - Top Right - Orange */}
        <div 
          className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full blur-3xl opacity-30 animate-blob"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.15), rgba(255, 138, 101, 0.15))',
            animationDelay: '0s'
          }}
        />
        
        {/* Medium Blob - Bottom Left - Yellow */}
        <div 
          className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full blur-3xl opacity-25 animate-blob"
          style={{
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(251, 191, 36, 0.15))',
            animationDelay: '2s'
          }}
        />
        
        {/* Small Blob - Center - Green */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-3xl opacity-20 animate-blob"
          style={{
            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.12), rgba(74, 222, 128, 0.12))',
            animationDelay: '4s'
          }}
        />
      </div>

      {/* Navigation - Transparent Floating Pill */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
        <div className="px-8 py-4 backdrop-blur-xl rounded-full shadow-lg border border-[#E8DED2]/20">
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-[#FF6B35] to-[#F55A24] rounded-full flex items-center justify-center shadow-orange">
                <Mic className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-bold text-lg text-[#2D1B0E]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Finance Command
              </span>
            </Link>
            
            {/* Links */}
            <div className="hidden md:flex items-center gap-6">
              <a href="#how-it-works" className="text-sm font-medium text-[#5C4534] hover:text-[#FF6B35] transition-colors">
                How It Works
              </a>
              <a href="#examples" className="text-sm font-medium text-[#5C4534] hover:text-[#FF6B35] transition-colors">
                Examples
              </a>
            </div>
            
            {/* CTA */}
            <Link href="/chat">
              <button className="px-6 py-2.5 bg-gradient-to-r from-[#FF6B35] to-[#F55A24] hover:from-[#F55A24] hover:to-[#FF6B35] text-white font-semibold rounded-full shadow-orange hover:scale-105 transition-all">
                Try Now
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 py-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left: Message */}
            <div className="space-y-8 relative z-10">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FFF4F0] border-2 border-[#FFE8DD] rounded-full">
                <Sparkles className="w-4 h-4 text-[#F55A24]" />
                <span className="text-sm font-semibold text-[#F55A24]">Voice-First Finance</span>
              </div>
              
              {/* Headline */}
              <h1 className="text-5xl md:text-7xl font-bold text-[#2D1B0E] leading-[1.1]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Talk to Your Money,
                <br />
                <span className="relative inline-block mt-2">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] to-[#F55A24]">
                    Not at It
                  </span>
                  {/* Underline SVG */}
                  <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 400 12">
                    <path d="M0,8 Q100,2 200,8 T400,8" stroke="#FF6B35" strokeWidth="4" fill="none" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>
              
              {/* Subheadline */}
              <p className="text-xl md:text-2xl text-[#5C4534] leading-relaxed">
                Your finances finally understand you. Just speak naturally, 
                and watch your money come to life with insights and charts.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/chat">
                  <button className="group px-8 py-5 bg-gradient-to-r from-[#FF6B35] to-[#F55A24] hover:from-[#F55A24] hover:to-[#FF6B35] text-white font-bold rounded-2xl shadow-orange hover:scale-105 transition-all">
                    <span className="flex items-center gap-3">
                      <Mic className="w-6 h-6" />
                      Start Talking
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </button>
                </Link>
              </div>
              
              {/* Hint */}
              <div className="flex items-center gap-3 text-sm text-[#7A6152]">
                <kbd className="px-2 py-1 bg-[#FFF4E6] rounded border border-[#E8DED2] font-mono">Space</kbd>
                <span>Hold anywhere to speak</span>
              </div>
            </div>
            
            {/* Right: Floating Cards Preview */}
            <div className="relative h-[500px] hidden lg:block">
              {/* Card 1 - Spending */}
              <div className="absolute top-0 right-0 w-80 p-6 bg-white rounded-3xl shadow-xl border-2 border-[#E8DED2] transform rotate-3 hover:rotate-0 transition-all animate-float">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-[#2D1B0E]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Your Spending</h3>
                  <div className="w-12 h-12 bg-gradient-to-br from-[#22C55E] to-[#16A34A] rounded-2xl flex items-center justify-center shadow-green">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="h-32 bg-gradient-to-br from-[#F0FDF4] to-[#DCFCE7] rounded-2xl flex items-center justify-center">
                  <div className="flex gap-2 items-end">
                    <div className="w-8 h-16 bg-[#22C55E] rounded-lg"></div>
                    <div className="w-8 h-24 bg-[#FF6B35] rounded-lg"></div>
                    <div className="w-8 h-12 bg-[#3B82F6] rounded-lg"></div>
                  </div>
                </div>
              </div>
              
              {/* Card 2 - Budget */}
              <div className="absolute bottom-20 left-0 w-72 p-5 bg-white rounded-3xl shadow-xl border-2 border-[#E8DED2] transform -rotate-2 hover:rotate-0 transition-all" style={{ animationDelay: '1s' }}>
                <h3 className="font-bold text-[#2D1B0E] mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Budget Status</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#5C4534]">Groceries</span>
                    <span className="text-[#22C55E] font-semibold">On Track</span>
                  </div>
                  <div className="h-2 bg-[#FFF4E6] rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-gradient-to-r from-[#22C55E] to-[#4ADE80] rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative py-24 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#2D1B0E]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] to-[#F55A24]">
                Three Simple Steps
              </span>
            </h2>
            <p className="text-xl text-[#5C4534]">Just talk. We handle the rest.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="group relative p-8 rounded-2xl bg-white border-2 border-[#E8DED2] hover:border-[#FF6B35] transition-all duration-300 hover:-translate-y-2 animate-fade-in-up">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FFF4F0] to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative">
                <div className="w-14 h-14 bg-[#FFF4F0] border-2 border-[#FFE8DD] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Mic className="w-8 h-8 text-[#FF6B35]" />
                </div>
                
                <h3 className="text-2xl font-bold text-[#2D1B0E] mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>1. Speak</h3>
                
                <p className="text-[#5C4534] leading-relaxed">
                  Hold Space or click the mic. Say anything like "Show me my spending" or "Am I over budget?"
                </p>
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="group relative p-8 rounded-2xl bg-white border-2 border-[#E8DED2] hover:border-[#22C55E] transition-all duration-300 hover:-translate-y-2 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-[#F0FDF4] to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative">
                <div className="w-14 h-14 bg-[#F0FDF4] border-2 border-[#DCFCE7] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-8 h-8 text-[#22C55E]" />
                </div>
                
                <h3 className="text-2xl font-bold text-[#2D1B0E] mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>2. AI Understands</h3>
                
                <p className="text-[#5C4534] leading-relaxed">
                  Our AI interprets your natural language and figures out exactly what you need to see.
                </p>
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="group relative p-8 rounded-2xl bg-white border-2 border-[#E8DED2] hover:border-[#3B82F6] transition-all duration-300 hover:-translate-y-2 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-[#EFF6FF] to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative">
                <div className="w-14 h-14 bg-[#EFF6FF] border-2 border-[#DBEAFE] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-8 h-8 text-[#3B82F6]" />
                </div>
                
                <h3 className="text-2xl font-bold text-[#2D1B0E] mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>3. See Insights</h3>
                
                <p className="text-[#5C4534] leading-relaxed">
                  Get beautiful charts, clear answers, and actionable insights—all from one simple question.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Example Commands */}
      <section id="examples" className="relative py-16 px-6 bg-gradient-to-br from-[#FFF8F0] to-[#FFEFD9]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-[#2D1B0E] mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              🎤 Try saying any of these
            </h3>
            <p className="text-[#5C4534] text-lg">Natural language that just works</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {exampleCommands.map((command, i) => (
              <Link href="/chat" key={i}>
                <button
                  className="group flex items-center gap-3 p-4 w-full bg-white hover:bg-[#FFF4F0] rounded-xl border-2 border-[#E8DED2] hover:border-[#FF6B35] transition-all text-left animate-fade-in-up"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="w-2 h-2 bg-[#FF6B35] rounded-full group-hover:animate-pulse flex-shrink-0" />
                  <span className="text-[#5C4534] group-hover:text-[#2D1B0E] transition-colors flex-1">
                    "{command}"
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#9B8477] group-hover:text-[#FF6B35] group-hover:translate-x-1 transition-all flex-shrink-0" />
                </button>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Demo CTA */}
      <section className="relative py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative p-12 rounded-3xl bg-gradient-to-br from-[#FFF4F0] to-[#FFE8DD] border-2 border-[#FF6B35]/20 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B35]/5 to-[#F55A24]/5 rounded-3xl animate-pulse" />
            
            <div className="relative">
              <h3 className="text-4xl md:text-5xl font-bold text-[#2D1B0E] mb-6" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Ready to transform your finances?
              </h3>
              
              <p className="text-xl text-[#5C4534] mb-8 max-w-2xl mx-auto">
                Join the future of financial management. No setup, no learning curve—just talk.
              </p>
              
              <Link href="/chat">
                <button className="group px-10 py-5 bg-gradient-to-r from-[#FF6B35] to-[#F55A24] text-white text-xl font-bold rounded-2xl transition-all hover:scale-105 shadow-orange">
                  <span className="flex items-center gap-3">
                    <Mic className="w-7 h-7" />
                    Start Your First Conversation
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </Link>
              
              <p className="mt-6 text-sm text-[#9B8477]">
                No credit card • No installation • Works instantly
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t-2 border-[#E8DED2] py-12 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-[#FF6B35] to-[#F55A24] rounded-lg flex items-center justify-center">
                <Mic className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-[#2D1B0E]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Finance Command Center</span>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-[#9B8477]">
              <a href="#how-it-works" className="hover:text-[#2D1B0E] transition-colors">How It Works</a>
              <a href="#examples" className="hover:text-[#2D1B0E] transition-colors">Examples</a>
            </div>
            
            <p className="text-sm text-[#9B8477]">
              © 2024 Finance Command Center. Built with Tambo AI.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
