import React, { useState } from 'react';
import { Leaf, Menu, X, Mic, History, Scan, Home } from 'lucide-react';

export default function Navbar({ activePage, setActivePage }) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'scanner', label: 'Scan Crop', icon: Scan },
    { id: 'voice', label: 'Voice Assistant', icon: Mic },
    { id: 'history', label: 'History', icon: History },
  ];

  const handleNav = (id) => {
    setActivePage(id);
    setIsOpen(false);
  };

  return (
    <nav className="bg-white border-b border-emerald-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Brand */}
          <div 
            onClick={() => handleNav('home')}
            className="flex items-center space-x-2 cursor-pointer group"
          >
            <div className="bg-emerald-600 text-white p-2 rounded-xl group-hover:bg-emerald-700 transition">
              <Leaf className="w-6 h-6" />
            </div>
            <span className="font-bold text-xl text-slate-800 tracking-tight">
              AI Crop <span className="text-emerald-600">Doctor</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg font-medium text-sm transition ${
                    active 
                      ? 'bg-emerald-50 text-emerald-700' 
                      : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Action CTA */}
          <div className="hidden md:flex items-center">
            <button
              onClick={() => handleNav('scanner')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition flex items-center space-x-2"
            >
              <Scan className="w-4 h-4" />
              <span>Scan Now</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-left transition ${
                  active 
                    ? 'bg-emerald-50 text-emerald-700' 
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
          <button
            onClick={() => handleNav('scanner')}
            className="w-full bg-emerald-600 text-white font-semibold py-3 rounded-xl shadow-sm text-center flex items-center justify-center space-x-2 mt-2"
          >
            <Scan className="w-5 h-5" />
            <span>Scan Now</span>
          </button>
        </div>
      )}
    </nav>
  );
}