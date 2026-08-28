import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Leaf, ShieldAlert } from 'lucide-react';

export default function Footer({ setActivePage }) {
  const { isTamil } = useLanguage();

  const handleNav = (target) => {
    if (typeof setActivePage === 'function') {
      setActivePage(target);
    } else {
      window.location.hash = target === 'home' ? '#/dashboard' : `#/dashboard/${target}`;
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 mt-16 rounded-t-3xl border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-slate-800">
          
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-emerald-500 text-slate-900 p-1.5 rounded-xl">
                <Leaf className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg text-white">GreenAgriX</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              {isTamil
                ? 'விவசாயிகளுக்கான நவீன AI வழிகாட்டி. உடனடி நோய் கண்டறிதல், பாசன ஆலோசனை, வானிலை மற்றும் நேரலை சந்தை நிலவரங்கள்.'
                : 'AI-powered crop health and farm intelligence for smarter farming. Early disease detection, accessible treatment guides, and voice-assisted advisory.'}
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">
              {isTamil ? 'விரைவு வழிசெலுத்தல்' : 'Quick Navigation'}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => handleNav('home')} className="hover:text-emerald-400 transition cursor-pointer">
                  {isTamil ? 'முகப்பு' : 'Home'}
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('scanner')} className="hover:text-emerald-400 transition cursor-pointer">
                  {isTamil ? 'பயிர் ஸ்கேனர்' : 'Scan Crop'}
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('voice')} className="hover:text-emerald-400 transition cursor-pointer">
                  {isTamil ? 'குரல் AI உதவியாளர்' : 'Voice Assistant'}
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('history')} className="hover:text-emerald-400 transition cursor-pointer">
                  {isTamil ? 'பரிசோதனை வரலாறு' : 'Diagnosis History'}
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">
              {isTamil ? 'முக்கிய அறிவிப்பு' : 'Important Notice'}
            </h4>
            <div className="flex items-start space-x-2 bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700 text-xs text-slate-400">
              <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                {isTamil
                  ? 'GreenAgriX AI வழிகாட்டுதல்களை வழங்குகிறது மற்றும் தொழில்முறை வேளாண் நிபுணர் சரிபார்ப்புக்கு துணைபுரிகிறது.'
                  : 'GreenAgriX provides informational guidance and does not replace professional agricultural advice or expert field verification.'}
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 text-center text-xs text-slate-500 font-medium">
          © {new Date().getFullYear()} GreenAgriX · {isTamil ? 'அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.' : 'All rights reserved.'}
        </div>
      </div>
    </footer>
  );
}