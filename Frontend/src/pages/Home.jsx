import React from 'react';
import { Scan, Mic, ShieldCheck, HeartHandshake, History, ChevronRight } from 'lucide-react';
import { CROPS } from '../data/cropData';

export default function Home({ setActivePage, setSelectedCrop }) {
  const handleSelectCrop = (cropId) => {
    setSelectedCrop(cropId);
    setActivePage('scanner');
  };

  return (
    <div className="space-y-16 pb-8">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-emerald-50/70 via-emerald-50/30 to-white py-12 md:py-20 border-b border-emerald-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold tracking-wide">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                <span>AI-POWERED FARMING ASSISTANT</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
                Your AI-Powered <span className="text-emerald-600">Crop Health</span> Assistant
              </h1>
              <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Detect crop diseases from leaf images and get simple, actionable treatment guidance — powered by smart agricultural vision.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-3 pt-2">
                <button
                  onClick={() => setActivePage('scanner')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition flex items-center justify-center space-x-2"
                >
                  <Scan className="w-5 h-5" />
                  <span>Scan Your Crop</span>
                </button>
                <button
                  onClick={() => setActivePage('voice')}
                  className="bg-white hover:bg-slate-50 text-slate-800 font-semibold px-6 py-3.5 rounded-xl border border-slate-200 shadow-sm transition flex items-center justify-center space-x-2"
                >
                  <Mic className="w-5 h-5 text-emerald-600" />
                  <span>Talk to AI Assistant</span>
                </button>
              </div>
            </div>

            {/* AI Scanning Concept Visual Placeholder */}
            <div className="relative mx-auto lg:max-w-none w-full max-w-md">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900">
                <img 
                  src="https://images.unsplash.com/photo-1592417817098-8f3d6eb1475a?auto=format&fit=crop&w=800&q=80" 
                  alt="Crop Leaf Analysis" 
                  className="w-full h-80 sm:h-96 object-cover opacity-85"
                />
                
                {/* Visual HUD Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                
                {/* Animated Scanning Bar */}
                <div className="absolute top-0 inset-x-0 h-1 bg-emerald-400 shadow-[0_0_15px_#10b981] animate-pulse"></div>

                {/* Target Box */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-dashed border-emerald-400 rounded-xl flex items-center justify-center">
                  <div className="w-3 h-3 bg-emerald-400 rounded-full animate-ping"></div>
                </div>

                {/* Badge Overlay */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-lg border border-emerald-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-emerald-700 block uppercase tracking-wider">Analysis Status</span>
                    <span className="font-bold text-slate-900 text-sm">Tomato Leaf • 94% Match</span>
                  </div>
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-lg">
                    Early Blight
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Trust / Value Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl font-bold text-slate-900">Designed for Practical Farming</h2>
          <p className="text-slate-600 text-sm mt-1">Simple tools designed to protect yield and simplify disease treatment.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center mb-4">
              <Scan className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">AI-Powered Detection</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Analyze crop leaf images to spot fungal and bacterial symptoms early.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center mb-4">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Simple Guidance</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Understand symptoms and recommended actions in clear, farmer-friendly terms.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center mb-4">
              <Mic className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Voice Assistance</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Ask questions naturally using voice support in English or Tamil.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center mb-4">
              <History className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Crop Health History</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Keep a record of previous scans to track disease spread and recovery.
            </p>
          </div>
        </div>
      </section>

      {/* Supported Crops Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-emerald-900 rounded-3xl p-8 md:p-12 text-white">
          <div className="max-w-2xl mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">Supported Crops</h2>
            <p className="text-emerald-200 text-sm">
              Select a crop below to start rapid diagnosis or browse supported disease conditions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CROPS.map((c) => (
              <div 
                key={c.id} 
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15 hover:bg-white/15 transition flex flex-col justify-between"
              >
                <div>
                  <div className="text-4xl mb-4">{c.icon}</div>
                  <h3 className="text-xl font-bold mb-1">{c.name}</h3>
                  <span className="inline-block text-xs font-semibold bg-emerald-800 text-emerald-200 px-2.5 py-1 rounded-md mb-3">
                    {c.conditionsCount} Conditions Supported
                  </span>
                  <p className="text-xs text-emerald-100/80 mb-6">{c.description}</p>
                </div>

                <button
                  onClick={() => handleSelectCrop(c.id)}
                  className="w-full bg-white text-emerald-900 hover:bg-emerald-50 font-semibold py-2.5 rounded-xl transition text-sm flex items-center justify-center space-x-1"
                >
                  <span>Select {c.name}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}