import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { aiVoiceService } from '../services/aiVoiceService';
import {
  Mic, Volume2, Square, Globe, Sparkles, AlertCircle, Loader2,
  Send, CheckCircle2, VolumeX, ArrowRight
} from 'lucide-react';

export default function Voice() {
  const { language, setLanguage, isTamil } = useLanguage();
  const [voiceState, setVoiceState] = useState('idle'); // 'idle' | 'listening' | 'processing' | 'response' | 'error'
  const [responseQuery, setResponseQuery] = useState('');
  const [responseText, setResponseText] = useState('');
  const [responseSource, setResponseSource] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [textInput, setTextInput] = useState('');

  const recognitionRef = useRef(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = isTamil ? 'ta-IN' : 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setResponseQuery(transcript);
        setVoiceState('processing');
        handleAIQuery(transcript, isTamil ? 'ta' : 'en');
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        if (event.error !== 'no-speech') {
          setErrorMessage(
            isTamil
              ? `மைக்ரோஃபோன் பிழை: ${event.error}. மைக் அனுமதி உள்ளதா என சரிபார்க்கவும்.`
              : `Microphone error: ${event.error}. Please ensure microphone permission is allowed.`
          );
          setVoiceState('error');
        } else {
          setVoiceState('idle');
        }
      };

      recognitionRef.current.onend = () => {
        if (voiceState === 'listening') {
          setVoiceState('processing');
        }
      };
    } else {
      setErrorMessage(
        isTamil
          ? 'உங்கள் உலாவியில் நேரடி குரல் அறிதல் வசதி இல்லை. நீங்கள் கீழே தட்டச்சு செய்து AI விடையைப் பெறலாம்.'
          : 'Your browser does not support Web Speech Recognition. You can type your question below.'
      );
    }

    return () => stopAudio();
  }, [language, isTamil]);

  // Update recognition language on change
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = isTamil ? 'ta-IN' : 'en-US';
    }

    // If an answer is already on screen, automatically translate it when language toggles
    if (responseQuery && responseText) {
      const activeLang = isTamil ? 'ta' : 'en';
      aiVoiceService.queryAgronomistAI(responseQuery, activeLang).then((result) => {
        setResponseText(result.text);
        setResponseSource(result.source);
      });
    }
  }, [language, isTamil]);

  // Query AI Service
  const handleAIQuery = async (queryText, currentLang = (isTamil ? 'ta' : 'en')) => {
    if (!queryText || queryText.trim() === '') return;

    setVoiceState('processing');
    setErrorMessage('');
    setResponseQuery(queryText);

    // Call trained NVIDIA NIM service with language enforcement
    const result = await aiVoiceService.queryAgronomistAI(queryText, currentLang);

    setResponseText(result.text);
    setResponseSource(result.source);
    setVoiceState('response');

    // Automatically speak the response in current language
    speakResponse(result.text, currentLang);
  };

  const handleMicClick = () => {
    if (voiceState === 'listening') {
      recognitionRef.current?.stop();
      setVoiceState('processing');
      return;
    }

    stopAudio();
    setErrorMessage('');
    setResponseText('');
    setResponseQuery('');
    setVoiceState('listening');

    try {
      recognitionRef.current?.start();
    } catch (e) {
      console.error(e);
      setVoiceState('idle');
    }
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    const query = textInput.trim();
    setTextInput('');
    handleAIQuery(query, isTamil ? 'ta' : 'en');
  };

  // Text-To-Speech Synthesis
  const speakResponse = (textToSpeak = responseText, currentLang = (isTamil ? 'ta' : 'en')) => {
    if ('speechSynthesis' in window && textToSpeak) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = currentLang === 'ta' ? 'ta-IN' : 'en-US';
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

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

  const sampleQuestions = isTamil ? [
    'தக்காளி இலைகளில் மஞ்சள் புள்ளிகள் மற்றும் கருகல் உள்ளது, என்ன மருந்து தெளிப்பது?',
    'அசுவினி மற்றும் வெள்ளை ஈ பூச்சிக்கு இயற்கை தீர்வு என்ன?',
    'பூக்கும் பருவத்தில் மகசூலை அதிகரிக்க எந்த உரம் இட வேண்டும்?',
    'மழைக்கு முன் சொட்டுநீர் பாசனம் செய்யலாமா?'
  ] : [
    'My tomato leaves have dark yellow spots and blight, what should I spray?',
    'What is the organic remedy for aphids and whiteflies?',
    'Which fertilizer increases flowering and fruit yield?',
    'Should I irrigate before forecasted heavy rainfall?'
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 animate-fade-in pb-20">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>{isTamil ? 'AI பயிற்சி பெற்ற பயிர் மருத்துவர் (GPT-4o)' : 'TRAINED AI CROP DOCTOR & AGRONOMIST'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-charcoal-900 font-display">
          {isTamil ? 'குரல் வழியே உங்கள் பயிர் மருத்துவரிடம் பேசுங்கள்' : 'Talk with Your AI Crop Doctor'}
        </h1>
        <p className="text-charcoal-500 text-sm max-w-xl mx-auto font-medium">
          {isTamil
            ? 'பயிர் நோய்கள், பூச்சி கட்டுப்பாடு, உர அட்டவணை மற்றும் பாசனம் பற்றி தமிழில் பேசுங்கள். NVIDIA Llama மூலம் உடனடி குரல் ஆலோசனை.'
            : 'Ask questions in natural voice about plant diseases, fertilizer dosages, and irrigation. Powered by NVIDIA Llama.'}
        </p>
      </div>

      {/* ── Language Switcher ────────────────────────────────────────────────── */}
      <div className="flex justify-center">
        <div className="bg-slate-100 p-1 rounded-2xl flex items-center space-x-1 border border-slate-200 shadow-sm">
          <button
            onClick={() => setLanguage('en')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
              !isTamil ? 'bg-white text-field-900 shadow-sm' : 'text-charcoal-500 hover:text-charcoal-900'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>English</span>
          </button>
          <button
            onClick={() => setLanguage('ta')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
              isTamil ? 'bg-white text-field-900 shadow-sm' : 'text-charcoal-500 hover:text-charcoal-900'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>தமிழ் (Tamil)</span>
          </button>
        </div>
      </div>

      {/* ── Interactive Microphone & Voice Hub ──────────────────────────────── */}
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/90 shadow-md text-center space-y-6">
        <div className="relative inline-block">
          {voiceState === 'listening' && (
            <div className="absolute inset-0 bg-rose-400 rounded-full animate-ping opacity-50" />
          )}
          <button
            onClick={handleMicClick}
            disabled={voiceState === 'processing'}
            className={`relative z-10 w-28 h-28 sm:w-32 sm:h-32 rounded-full flex items-center justify-center transition-all shadow-2xl cursor-pointer ${
              voiceState === 'listening'
                ? 'bg-rose-600 text-white shadow-rose-600/40 scale-105 animate-pulse'
                : voiceState === 'processing'
                ? 'bg-amber-500 text-white shadow-amber-500/40'
                : 'bg-field-900 hover:bg-field-800 hover:scale-105 text-white shadow-field-900/30'
            }`}
          >
            {voiceState === 'processing' ? (
              <Loader2 className="w-12 h-12 sm:w-14 sm:h-14 animate-spin" />
            ) : (
              <Mic className="w-12 h-12 sm:w-14 sm:h-14" />
            )}
          </button>
        </div>

        <div className="min-h-[4rem] flex flex-col items-center justify-center">
          {voiceState === 'idle' && (
            <div className="space-y-1">
              <h3 className="font-bold text-charcoal-900 text-lg">
                {isTamil ? 'பேச மைக்-ஐ அழுத்தவும்' : 'Tap to Speak'}
              </h3>
              <p className="text-xs text-charcoal-400 font-medium">
                {isTamil ? 'பயிரின் இலைகள், பூச்சி அல்லது உரம் பற்றி தமிழில் கேளுங்கள்' : 'Ask any question about your crop, soil, or pests'}
              </p>
            </div>
          )}

          {voiceState === 'listening' && (
            <div className="space-y-1">
              <h3 className="font-bold text-rose-600 text-lg animate-pulse">
                {isTamil ? 'கேட்கிறது... தமிழில் பேசுங்கள்' : 'Listening... Speak now'}
              </h3>
              <p className="text-xs text-charcoal-400 font-medium">
                {isTamil ? 'பேசி முடித்ததும் மீண்டும் அழுத்தவும்' : 'Tap microphone again when finished speaking'}
              </p>
            </div>
          )}

          {voiceState === 'processing' && (
            <div className="space-y-1">
              <h3 className="font-bold text-amber-600 text-lg flex items-center justify-center gap-2">
                <Sparkles size={18} className="animate-spin" />
                {isTamil ? 'AI ஆய்வு செய்கிறது...' : 'AI Analyzing...'}
              </h3>
              <p className="text-xs text-charcoal-400 font-medium">
                {isTamil ? 'வேளாண் நிபுணர் அமைப்பிலிருந்து துல்லியமான விடை பெறப்படுகிறது' : 'Synthesizing agricultural diagnosis & remedies'}
              </p>
            </div>
          )}

          {voiceState === 'response' && (
            <div className="space-y-1">
              <h3 className="font-bold text-emerald-700 text-lg flex items-center justify-center gap-2">
                <CheckCircle2 size={18} />
                {isTamil ? 'பதில் தயாராக உள்ளது' : 'Response Ready'}
              </h3>
              <p className="text-xs text-charcoal-400 font-medium">
                {isTamil ? 'அடுத்த கேள்வி கேட்க மீண்டும் மைக்-ஐ அழுத்தவும்' : 'Tap microphone to ask another question'}
              </p>
            </div>
          )}

          {voiceState === 'error' && (
            <div className="space-y-1">
              <h3 className="font-bold text-rose-600 text-base flex items-center justify-center gap-2">
                <AlertCircle size={18} /> {isTamil ? 'பிழை' : 'Error'}
              </h3>
              <p className="text-xs text-charcoal-500 max-w-sm mx-auto">{errorMessage}</p>
              <button
                onClick={() => setVoiceState('idle')}
                className="text-xs font-bold text-field-700 hover:underline mt-1"
              >
                {isTamil ? 'மீண்டும் முயற்சிக்கவும்' : 'Try Again'}
              </button>
            </div>
          )}
        </div>

        {/* Text Input Fallback Bar */}
        <form onSubmit={handleTextSubmit} className="pt-2 max-w-xl mx-auto flex gap-2">
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder={
              isTamil
                ? 'அல்லது உங்கள் கேள்வியை இங்கே தட்டச்சு செய்யவும்...'
                : 'Or type your farming question here...'
            }
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-charcoal-900 focus:outline-none focus:border-field-600"
          />
          <button
            type="submit"
            disabled={voiceState === 'processing' || !textInput.trim()}
            className="px-5 py-2.5 bg-field-900 hover:bg-field-800 text-white rounded-2xl font-bold text-xs transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-sm"
          >
            <Send size={14} />
            <span>{isTamil ? 'கேள்' : 'Ask'}</span>
          </button>
        </form>

        {/* Quick Sample Questions Chips */}
        <div className="pt-2 text-left space-y-2">
          <p className="text-[10px] font-bold text-charcoal-400 uppercase tracking-wider">
            💡 {isTamil ? 'பரிந்துரைக்கப்பட்ட மாதிரி கேள்விகள்:' : 'Sample Questions to Try:'}
          </p>
          <div className="flex flex-wrap gap-2">
            {sampleQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleAIQuery(q, isTamil ? 'ta' : 'en')}
                className="text-[11px] font-medium text-charcoal-700 bg-slate-100 hover:bg-field-50 hover:text-field-800 border border-slate-200/80 px-3 py-1.5 rounded-xl transition text-left cursor-pointer"
              >
                "{q}"
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Active AI Response Card ────────────────────────────────────────── */}
      {voiceState === 'response' && responseText && (
        <div className="bg-emerald-50/80 border-2 border-emerald-300 p-6 md:p-7 rounded-3xl space-y-4 animate-fade-in shadow-md">
          <div className="flex items-center justify-between border-b border-emerald-200/60 pb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-200/80 px-2.5 py-0.5 rounded-full">
              {isTamil ? 'நீங்கள் கேட்டது' : 'Your Question'}
            </span>
            <span className="text-[10px] font-bold text-emerald-700">
              {responseSource}
            </span>
          </div>
          <p className="text-charcoal-900 font-bold italic text-sm">
            "{responseQuery}"
          </p>

          <div className="border-t border-emerald-200/60 pt-3">
            <span className="text-[10px] font-black text-emerald-900 uppercase tracking-wider block mb-1">
              {isTamil ? 'AI பயிர் மருத்துவரின் ஆலோசனை' : 'AI Agronomist Advisory'}
            </span>
            <p className="text-charcoal-950 font-medium text-sm leading-relaxed whitespace-pre-line">
              {responseText}
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-emerald-200/60">
            <div className="flex items-center space-x-3">
              {!isPlaying ? (
                <button
                  onClick={() => speakResponse(responseText, isTamil ? 'ta' : 'en')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition flex items-center space-x-1.5 shadow cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>{isTamil ? 'குரலில் மீண்டும் கேட்க' : 'Replay Voice'}</span>
                </button>
              ) : (
                <button
                  onClick={stopAudio}
                  className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition flex items-center space-x-1.5 shadow cursor-pointer"
                >
                  <Square className="w-4 h-4" />
                  <span>{isTamil ? 'ஒலியை நிறுத்த' : 'Stop Voice'}</span>
                </button>
              )}
              <span className="text-xs text-emerald-800 font-semibold">
                {isPlaying ? (isTamil ? 'குரல் ஒலிக்கிறது...' : 'Playing voice...') : (isTamil ? 'குரல் தயார்' : 'Voice ready')}
              </span>
            </div>

            <button
              onClick={() => {
                setVoiceState('idle');
                stopAudio();
              }}
              className="text-xs text-charcoal-500 font-bold hover:text-charcoal-900 hover:underline cursor-pointer"
            >
              {isTamil ? 'அடுத்த கேள்வி' : 'Ask Next'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}