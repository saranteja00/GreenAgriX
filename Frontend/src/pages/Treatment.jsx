import React from 'react';
import { ShieldCheck, AlertCircle, CheckSquare, Stethoscope, ArrowLeft } from 'lucide-react';

export default function Treatment({ result, setActivePage }) {
  if (!result || !result.details) {
    return (
      <div className="max-w-md mx-auto my-16 text-center space-y-4 px-4">
        <h2 className="text-xl font-bold text-slate-800">No Treatment Data</h2>
        <p className="text-slate-500 text-sm">Please perform a crop scan to view recommendations.</p>
        <button
          onClick={() => setActivePage('scanner')}
          className="bg-emerald-600 text-white font-semibold px-6 py-2.5 rounded-xl text-sm"
        >
          Go to Scanner
        </button>
      </div>
    );
  }

  const { details } = result;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <button 
            onClick={() => setActivePage('diagnosis')}
            className="text-xs font-semibold text-emerald-600 hover:underline flex items-center space-x-1 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Diagnosis</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Treatment & Prevention Guide</h1>
          <p className="text-slate-600 text-sm">Actionable steps for managing {details.name}.</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Symptoms Section */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 text-amber-800">
            <Stethoscope className="w-5 h-5 text-amber-600" />
            <h2 className="font-bold text-lg text-slate-900">What to Look For</h2>
          </div>
          <ul className="space-y-2 text-slate-700 text-sm">
            {details.symptoms.map((symptom, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0"></span>
                <span>{symptom}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Treatment Actions */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 text-emerald-800">
            <CheckSquare className="w-5 h-5 text-emerald-600" />
            <h2 className="font-bold text-lg text-slate-900">Recommended Actions</h2>
          </div>
          <ul className="space-y-2 text-slate-700 text-sm">
            {details.treatment.map((action, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 shrink-0"></span>
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Prevention */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 text-blue-800">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <h2 className="font-bold text-lg text-slate-900">Prevention Measures</h2>
          </div>
          <ul className="space-y-2 text-slate-700 text-sm">
            {details.prevention.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0"></span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Safety Notice */}
        <div className="bg-slate-900 text-slate-200 p-6 rounded-2xl space-y-2 border border-slate-800">
          <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>Safety Notice</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Always follow the label instructions for agricultural products and use appropriate protective equipment. Do not mix chemicals unless specifically instructed by the product label or a qualified professional.
          </p>
        </div>
      </div>
    </div>
  );
}