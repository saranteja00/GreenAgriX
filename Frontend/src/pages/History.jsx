import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { History as HistoryIcon, Scan, Calendar, ArrowRight } from 'lucide-react';

export default function History({ historyItems = [], onSelectHistory, setActivePage }) {
  const { isTamil } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">
          {isTamil ? 'சமீபத்திய பயிர் பரிசோதனை வரலாறு' : 'Recent Crop Diagnoses'}
        </h1>
        <p className="text-slate-600 text-sm mt-1">
          {isTamil 
            ? 'முந்தைய பயிர் நோய் அறிக்கைகள் மற்றும் தீர்வு வழிகாட்டல்களை பார்வையிடவும்.'
            : 'Review historical disease diagnosis reports and recommendations.'}
        </p>
      </div>

      {historyItems.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <HistoryIcon className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-slate-800 text-lg">
              {isTamil ? 'பரிசோதனைகள் எதுவும் இதுவரை இல்லை' : 'No Diagnoses Yet'}
            </h3>
            <p className="text-slate-500 text-xs max-w-sm mx-auto">
              {isTamil 
                ? 'உங்கள் பயிரை ஸ்கேன் செய்த பிறகு அதன் ஆய்வு முடிவுகள் இங்கே சேமிக்கப்படும்.'
                : 'Your recent crop analyses will appear here once submitted.'}
            </p>
          </div>
          <button
            onClick={() => setActivePage ? setActivePage('scanner') : (window.location.hash = '#/dashboard/scanner')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-2xl text-sm transition inline-flex items-center space-x-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 cursor-pointer"
          >
            <Scan className="w-4 h-4" />
            <span>{isTamil ? 'உங்கள் முதல் பயிரை ஸ்கேன் செய்யவும்' : 'Scan Your First Crop'}</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {historyItems.map((item) => {
            const isHealthy = item.status === 'healthy';
            return (
              <div 
                key={item.id}
                className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-emerald-300 transition shadow-sm hover:shadow-md flex space-x-4 items-center"
              >
                <img 
                  src={item.thumbnail} 
                  alt={item.crop} 
                  className="w-20 h-20 rounded-xl object-cover shrink-0 bg-slate-100"
                />

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-base truncate">{item.crop}</span>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase ${
                      isHealthy ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {isHealthy ? (isTamil ? 'ஆரோக்கியமானது' : 'Healthy') : (isTamil ? 'பாதிக்கப்பட்டது' : item.status)}
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-slate-700 truncate">{item.disease}</p>

                  <div className="flex items-center space-x-3 text-xs text-slate-500 pt-1">
                    <span>{item.confidence}% {isTamil ? 'துல்லியம்' : 'confidence'}</span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{item.date}</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}