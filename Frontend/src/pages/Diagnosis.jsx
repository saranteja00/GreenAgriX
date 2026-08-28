import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import {
  CheckCircle, AlertTriangle, ArrowRight, RotateCcw, ShieldCheck,
  Sparkles, Volume2, Square, FlaskConical, Leaf, ShieldAlert,
  HelpCircle, ExternalLink, Cpu
} from 'lucide-react';
import { Card } from '../components/ui/index';

export default function Diagnosis({ result, setActivePage }) {
  const { isTamil } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState('nim_report'); // 'nim_report' | 'pesticides' | 'organic'

  if (!result) {
    return (
      <div className="max-w-md mx-auto my-16 text-center space-y-4 px-4">
        <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">
          {isTamil ? 'பரிசோதனை முடிவுகள் இல்லை' : 'No Active Diagnosis'}
        </h2>
        <p className="text-slate-500 text-sm">
          {isTamil ? 'முதலில் பயிரின் இலையை ஸ்கேன் செய்யவும்.' : 'Please upload and analyze a crop leaf image first.'}
        </p>
        <button
          onClick={() => setActivePage('scanner')}
          className="bg-emerald-600 text-white font-semibold px-6 py-2.5 rounded-xl text-sm"
        >
          {isTamil ? 'ஸ்கேனருக்கு செல்க' : 'Go to Scanner'}
        </button>
      </div>
    );
  }

  const isHealthy = result.disease === 'Healthy' || result.disease?.includes('Healthy');
  const nimReport = result.nvidia_nim_diagnosis?.diagnosis_report || result.details?.treatment?.join('\n') || '';

  const speakReport = () => {
    if ('speechSynthesis' in window && nimReport) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(nimReport);
      utterance.lang = isTamil ? 'ta-IN' : 'en-US';
      utterance.rate = 0.95;
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      setIsPlaying(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6 animate-fade-in pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-1 border border-emerald-200">
            <Leaf size={14} className="text-emerald-700" />
            <span>{isTamil ? 'AI பயிர் மருத்துவ அறிக்கை & பரிந்துரை' : 'AI Crop Doctor Diagnostic Report'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-charcoal-900 font-display">
            {isTamil ? 'பயிர் நோயறிதல் & சிகிச்சை அறிக்கை' : 'Crop Diagnostic & Treatment Report'}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActivePage('scanner')}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-charcoal-700 font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw size={14} />
            <span>{isTamil ? 'மீண்டும் ஸ்கேன் செய்ய' : 'Scan Another'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Sample Image with YOLO Detection Overlay */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm space-y-4 lg:col-span-1">
          <div className="relative rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center">
            <img src={result.image} alt="Analyzed Crop" className="object-cover max-h-72 w-full" />
            
            {/* YOLO Bounding Box simulated overlay */}
            {!isHealthy && (
              <div className="absolute inset-8 border-2 border-dashed border-rose-500 bg-rose-500/10 rounded-xl pointer-events-none flex items-start justify-start p-1.5">
                <span className="bg-rose-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                  {result.disease} ({result.confidence}%)
                </span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-charcoal-500 uppercase">{isTamil ? 'பயிர் வகை' : 'Target Crop'}</span>
              <span className="font-black text-charcoal-900">{result.crop}</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-charcoal-500 uppercase">{isTamil ? 'கண்டறிதல்' : 'Detection'}</span>
              <span className={`font-bold px-2.5 py-0.5 rounded-full text-[11px] ${
                isHealthy ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {isHealthy ? (isTamil ? 'ஆரோக்கியமானது' : 'Healthy') : (isTamil ? 'நோய் கண்டறியப்பட்டது' : 'Disease Detected')}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-charcoal-500 uppercase">{isTamil ? 'AI துல்லியம்' : 'YOLO Confidence'}</span>
              <span className="font-black text-emerald-700">{result.confidence}%</span>
            </div>
          </div>
        </div>

        {/* NVIDIA NIM Comprehensive Diagnosis & Prescription */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6 lg:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-200">
                🌿 {isTamil ? 'AI பயிர் மருத்துவர் பரிந்துரை' : 'AI Crop Doctor Prescription'}
              </span>
              <h2 className="text-2xl font-black text-charcoal-900 mt-1">
                {isTamil ? (result.diseaseTa || result.disease) : result.disease}
              </h2>
            </div>

            {/* Audio Readout */}
            <div className="flex items-center gap-2">
              {!isPlaying ? (
                <button
                  onClick={speakReport}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Volume2 size={15} />
                  <span>{isTamil ? 'குரலில் கேட்க' : 'Listen Diagnosis'}</span>
                </button>
              ) : (
                <button
                  onClick={stopAudio}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Square size={15} />
                  <span>{isTamil ? 'நிறுத்து' : 'Stop Audio'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Diagnostic Text Display */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 text-xs text-charcoal-800 leading-relaxed font-medium whitespace-pre-line">
            {nimReport}
          </div>

          {/* Targeted Chemical & Organic Quick Cards */}
          {result.pesticides && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {/* Chemical */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                  <FlaskConical size={16} className="text-amber-700" />
                  <span>{isTamil ? 'இரசாயன மருந்தளவு' : 'Chemical Formulation'}</span>
                </div>
                <p className="text-[11px] font-bold text-amber-950">
                  {isTamil ? result.pesticides.chemical_remedy?.spray_name_ta : result.pesticides.chemical_remedy?.spray_name_en}
                </p>
                <p className="text-[11px] text-amber-800">
                  {isTamil ? result.pesticides.chemical_remedy?.dosage_ta : result.pesticides.chemical_remedy?.dosage_en}
                </p>
              </div>

              {/* Organic */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                  <Leaf size={16} className="text-emerald-700" />
                  <span>{isTamil ? 'இயற்கை உயிரி கட்டுப்பாடு' : 'Organic Bio-Control'}</span>
                </div>
                <p className="text-[11px] font-bold text-emerald-950">
                  {isTamil ? result.pesticides.organic_remedy?.spray_name_ta : result.pesticides.organic_remedy?.spray_name_en}
                </p>
                <p className="text-[11px] text-emerald-800">
                  {isTamil ? result.pesticides.organic_remedy?.dosage_ta : result.pesticides.organic_remedy?.dosage_en}
                </p>
              </div>
            </div>
          )}

          {/* Navigation Actions */}
          <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => setActivePage('treatment')}
              className="w-full sm:flex-1 py-3 px-4 bg-field-900 hover:bg-field-800 text-white font-bold text-xs rounded-2xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{isTamil ? 'முழு சிகிச்சை அட்டவணை' : 'Detailed Treatment Schedule'}</span>
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => window.location.hash = '#/dashboard/schemes'}
              className="w-full sm:w-auto py-3 px-5 bg-slate-100 hover:bg-slate-200 text-charcoal-700 font-bold text-xs rounded-2xl transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{isTamil ? 'மானியம் பார்க்க' : 'Check Subsidies'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}