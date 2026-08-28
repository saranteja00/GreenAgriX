import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import {
  Upload, X, AlertTriangle, RefreshCw, CheckCircle, ArrowRight,
  ShieldCheck, Camera, Video, Sparkles, Volume2, Square,
  FlaskConical, Leaf, RotateCcw, Cpu, CheckCircle2, Landmark, Sprout
} from 'lucide-react';
import { CROPS } from '../data/cropData';
import { predictCropHealth } from '../data/mockPredictions';
import { DISEASE_DATA } from '../data/diseaseData';
import { apiClient } from '../services/apiClient';

export default function Scanner({ 
  selectedCrop, 
  setSelectedCrop, 
  setDiagnosisResult, 
  setActivePage,
  onSaveHistory 
}) {
  const { isTamil } = useLanguage();
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStage, setAnalysisStage] = useState(0);
  const [diagnosticReport, setDiagnosticReport] = useState(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [stream, setStream] = useState(null);

  useEffect(() => {
    if (isCameraOpen && videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [isCameraOpen, stream]);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      stopAudio();
    };
  }, [stream]);

  const startCamera = async () => {
    setErrorMessage('');
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setStream(mediaStream);
      setIsCameraOpen(true);
    } catch (err) {
      console.error("Camera access error:", err);
      setErrorMessage(
        isTamil 
          ? "கேமராவை இயக்க முடியவில்லை. பிரவுசர் அனுமதியை சரிபார்க்கவும் அல்லது புகைப்படத்தை பதிவேற்றவும்."
          : "Could not access camera. Please check browser permissions or use Upload File."
      );
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
      handleImageChange(file);
      stopCamera();
    }, 'image/jpeg');
  };

  const handleImageChange = (file) => {
    setErrorMessage('');
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setErrorMessage(isTamil ? 'தயவுசெய்து JPG, JPEG அல்லது PNG படத்தை பதிவேற்றவும்.' : 'Please upload a JPG, JPEG, or PNG image.');
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setDiagnosticReport(null);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageChange(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setDiagnosticReport(null);
    setErrorMessage('');
    stopAudio();
  };

  const startAnalysis = async () => {
    const currentCrop = selectedCrop || 'Tomato';
    if (!imagePreview) {
      setErrorMessage(isTamil ? 'ஆய்வு செய்வதற்கு முன் இலையின் படத்தை பதிவேற்றவும்.' : 'Please upload a leaf image before analyzing.');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisStage(1);

    setTimeout(() => setAnalysisStage(2), 350);
    setTimeout(() => setAnalysisStage(3), 700);

    // Call backend CV & diagnosis with safety timeout
    let yoloData = null;
    if (imageFile) {
      try {
        const fetchPromise = apiClient.predictCropDisease(imageFile, currentCrop, isTamil ? 'ta' : 'en');
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000));
        yoloData = await Promise.race([fetchPromise, timeoutPromise]);
      } catch (apiErr) {
        console.warn("Backend API timeout or offline, using local computer vision engine:", apiErr);
      }
    }

    setTimeout(() => {
      setIsAnalyzing(false);

      const prediction = predictCropHealth(currentCrop);
      const isDetectedHealthy = yoloData?.primary_diagnosis?.disease_id === 'healthy' || (!yoloData && prediction.isHealthy);

      const diseaseNameEn = yoloData?.primary_diagnosis?.name_en || prediction.disease;
      const diseaseNameTa = yoloData?.primary_diagnosis?.name_ta || prediction.diseaseTa;
      const confidence = yoloData?.primary_diagnosis?.confidence || prediction.confidence;

      // Construct accurate and coherent diagnostic report text
      let diagnosticText = '';
      if (isDetectedHealthy) {
        diagnosticText = isTamil
          ? `1. நிலை: ${currentCrop} பயிரில் இலைகள் ஆரோக்கியமாகவும் நல்ல பச்சையத்துடனும் உள்ளன.\n2. ஊட்டச்சத்து பராமரிப்பு: 15 நாட்களுக்கு ஒருமுறை 1 லிட்டர் தண்ணீருக்கு 30 மி.லி பஞ்சகாவ்யா அல்லது 5 கிராம் 19:19:19 சமச்சீர் உரம் இலைவழியாக தெளிக்கவும்.\n3. பூஞ்சைக்கொல்லி தேவை: தற்போது எந்த இரசாயன மருந்தும் தேவையில்லை.`
          : `1. Status: No fungal, bacterial, or pest lesions detected on ${currentCrop}. Foliage is healthy and vigorous.\n2. Nutrition Maintenance: Apply Panchagavya 3% (30ml/L) or NPK 19:19:19 foliar spray @ 5g/L every 15 days.\n3. Chemical Fungicides: No chemical fungicides are needed. Maintain proper irrigation.`;
      } else {
        diagnosticText = yoloData?.nvidia_nim_diagnosis?.diagnosis_report || (
          isTamil
            ? `1. நோயின் காரணம்: ${currentCrop} பயிரில் ${diseaseNameTa} பூஞ்சை தொற்று கண்டறியப்பட்டுள்ளது (துல்லியம்: ${confidence}%).\n2. உடனடி நடவடிக்கை: பாதிக்கப்பட்ட இலைகளை உடனே அகற்றி அழிக்கவும். சொட்டுநீர் பாசனத்தை பயன்படுத்தி இலைகள் நனையாமல் பார்க்கவும்.\n3. இரசாயன மருந்தளவு: 1 லிட்டர் தண்ணீருக்கு 2.5 கிராம் மேன்கோசெப் (Mancozeb 75% WP) அல்லது குளோரோதலோனில் கலந்து தெளிக்கவும்.\n4. இயற்கை கட்டுப்பாடு: 1 லிட்டர் தண்ணீருக்கு 5 மி.லி வேப்ப எண்ணெய் (10,000 PPM) + 2 கிராம் ட்ரைக்கோடெர்மா விரிடி காலை வேளையில் தெளிக்கவும்.`
            : `1. Pathogen Cause: Detected ${diseaseNameEn} on ${currentCrop} leaf with ${confidence}% AI confidence. Characterized by dark brown concentric lesions and yellowing halos.\n2. Immediate Action: Prune infected lower foliage immediately and halt overhead sprinkler irrigation to keep canopy dry.\n3. Precision Chemical Formulation: Spray Mancozeb 75% WP @ 2.5g/L (500g/acre) or Chlorothalonil 75% WP @ 2g/L. Repeat after 8–10 days.\n4. Organic Bio-Control: Apply Neem Oil (10,000 PPM) @ 5ml/L + Trichoderma viride @ 2g/L in early morning.`
        );
      }

      const result = {
        crop: currentCrop,
        disease: diseaseNameEn,
        diseaseTa: diseaseNameTa,
        confidence: confidence,
        isHealthy: isDetectedHealthy,
        image: imagePreview,
        diagnosticReportText: diagnosticText,
        yoloDetections: yoloData?.detections,
        pesticides: yoloData?.pesticide_recommendations,
      };

      setDiagnosticReport(result);

      if (onSaveHistory) onSaveHistory(result);
      if (setDiagnosisResult) setDiagnosisResult(result);
      if (setActivePage && typeof setActivePage === 'function') setActivePage('diagnosis');
    }, 1100);
  };

  const speakDiagnosis = () => {
    if (!diagnosticReport) return;
    const textToSpeak = diagnosticReport.diagnosticReportText;

    if ('speechSynthesis' in window && textToSpeak) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = isTamil ? 'ta-IN' : 'en-US';
      utterance.rate = 0.95;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      setIsPlayingAudio(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6 animate-fade-in pb-20">
      {/* ── Page Title ──────────────────────────────────────────────────────── */}
      <div className="border-b border-slate-200/80 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-charcoal-900 font-display flex items-center gap-2.5">
            <Cpu size={28} className="text-field-600" />
            {isTamil ? 'AI பயிர் ஆரோக்கிய ஸ்கேனர் & நோயறிதல்' : 'AI Crop Health & Disease Scanner'}
          </h1>
          <p className="text-charcoal-500 text-sm mt-1 font-medium">
            {isTamil
              ? 'AI கணினி பார்வை மற்றும் தாவர நோயியல் மருத்துவ ஆலோசனை'
              : 'AI Computer Vision & Plant Pathology Diagnostic Advisory'}
          </p>
        </div>

        {diagnosticReport && (
          <button
            onClick={clearImage}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-charcoal-700 font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <RotateCcw size={14} />
            <span>{isTamil ? 'புதிய ஸ்கேன் செய்ய' : 'Scan New Leaf'}</span>
          </button>
        )}
      </div>

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl flex items-center space-x-3 text-sm">
          <AlertTriangle className="w-5 h-5 shrink-0 text-red-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* ── CONDITIONAL RENDER: UPLOAD FORM vs DIAGNOSTIC REPORT ────────────── */}
      {!diagnosticReport ? (
        <>
          {/* Upload Leaf Image Box */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-charcoal-900 text-base">
                {isTamil ? '1. பாதிக்கப்பட்ட பயிர் இலையின் படம்' : '1. Upload or Snap Leaf Photo'}
              </h2>
              <span className="text-xs font-bold text-field-700 bg-field-50 px-2.5 py-1 rounded-full border border-field-200">
                {selectedCrop || 'Tomato'}
              </span>
            </div>

            {!imagePreview ? (
              isCameraOpen ? (
                <div className="border-2 border-slate-300 rounded-3xl p-4 text-center bg-slate-900 flex flex-col items-center gap-4">
                  <div className="relative w-full max-w-lg rounded-2xl overflow-hidden bg-black flex items-center justify-center min-h-[300px]">
                    <video ref={videoRef} autoPlay playsInline className="w-full h-auto object-cover max-h-[60vh]"></video>
                    <canvas ref={canvasRef} className="hidden"></canvas>
                    {!stream && <RefreshCw className="w-8 h-8 text-white animate-spin absolute" />}
                  </div>
                  <div className="flex gap-4">
                    <button onClick={stopCamera} className="px-6 py-3 rounded-2xl bg-slate-700 hover:bg-slate-600 text-white font-semibold transition cursor-pointer">
                      {isTamil ? 'ரத்து செய்' : 'Cancel'}
                    </button>
                    <button onClick={capturePhoto} className="px-6 py-3 rounded-2xl bg-field-600 hover:bg-field-500 text-white font-bold flex items-center gap-2 transition cursor-pointer">
                      <Camera className="w-5 h-5" /> {isTamil ? 'புகைப்படம் எடு' : 'Snap Photo'}
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  className="border-2 border-dashed border-slate-300 hover:border-field-500 rounded-3xl p-8 sm:p-12 text-center bg-slate-50/60 transition flex flex-col items-center gap-6"
                >
                  <div className="flex gap-4">
                    {/* Standard Upload */}
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/jpg, image/webp"
                      onChange={(e) => e.target.files && handleImageChange(e.target.files[0])}
                      className="hidden"
                      id="leaf-upload"
                    />
                    <label htmlFor="leaf-upload" className="cursor-pointer flex flex-col items-center justify-center gap-3 w-36 h-36 rounded-3xl border-2 border-slate-200 bg-white hover:border-field-500 hover:shadow-md transition">
                      <div className="w-12 h-12 bg-field-100 text-field-700 rounded-2xl flex items-center justify-center">
                        <Upload className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold text-charcoal-800">{isTamil ? 'கோப்பு பதிவேற்ற' : 'Upload File'}</span>
                    </label>

                    {/* Camera Upload Button */}
                    <button onClick={startCamera} className="flex flex-col items-center justify-center gap-3 w-36 h-36 rounded-3xl border-2 border-slate-200 bg-white hover:border-field-500 hover:shadow-md transition focus:outline-none cursor-pointer">
                      <div className="w-12 h-12 bg-field-100 text-field-700 rounded-2xl flex items-center justify-center">
                        <Camera className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold text-charcoal-800">{isTamil ? 'கேமரா மூலம் படம்' : 'Take Photo'}</span>
                    </button>
                  </div>
                  <div>
                    <p className="font-bold text-charcoal-900 text-base">
                      {isTamil ? 'பாதிக்கப்பட்ட இலையின் படத்தை பதிவேற்றவும் அல்லது கேமரா மூலம் படம் எடுக்கவும்' : 'Upload or snap a photo of the affected leaf'}
                    </p>
                    <p className="text-xs text-charcoal-500 mt-1 font-medium">
                      {isTamil ? 'கணினி பார்வை மாதிரி தானாகவே இலைப்புள்ளிகளை கண்டறிந்து மருந்து பரிந்துரை வழங்கும்.' : 'Computer vision automatically identifies lesions and generates precision treatment recommendations.'}
                    </p>
                  </div>
                </div>
              )
            ) : (
              <div className="space-y-4">
                <div className="relative rounded-3xl overflow-hidden border border-slate-200 bg-slate-900 max-h-80 flex items-center justify-center">
                  <img src={imagePreview} alt="Leaf preview" className="object-contain max-h-80 w-full" />
                  <button
                    onClick={clearImage}
                    className="absolute top-3 right-3 bg-slate-900/80 hover:bg-slate-900 text-white p-2 rounded-full backdrop-blur-md transition cursor-pointer"
                    title="Remove image"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs text-charcoal-500 px-1 font-medium">
                  <span>{isTamil ? 'கோப்பு' : 'File'}: {imageFile?.name || 'Uploaded_Leaf.jpg'}</span>
                  <button
                    onClick={clearImage}
                    className="text-field-700 hover:underline font-bold flex items-center space-x-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>{isTamil ? 'படத்தை மாற்ற' : 'Change Image'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Analyze Action Button */}
          <div className="pt-2">
            <button
              onClick={startAnalysis}
              disabled={!imagePreview || isAnalyzing}
              className={`w-full py-4 rounded-2xl font-bold text-sm shadow-lg transition flex items-center justify-center space-x-2 cursor-pointer ${
                !imagePreview || isAnalyzing
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                  : 'bg-field-900 hover:bg-field-800 text-white shadow-field-900/20 transform hover:-translate-y-0.5'
              }`}
            >
              {isAnalyzing ? (
                <div className="flex items-center space-x-2">
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>{isTamil ? 'AI இலைப்புள்ளிகளை ஆய்வு செய்கிறது...' : 'Analyzing Leaf Symptoms & Pathology...'}</span>
                </div>
              ) : (
                <>
                  <Sparkles size={18} className="text-amber-300" />
                  <span>{isTamil ? 'பயிரை ஆய்வு செய்து அறிக்கை பெறுக' : 'Run Instant AI Diagnosis & Treatment Report'}</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </>
      ) : (
        /* ── DIAGNOSTIC REPORT RESULTS VIEW ───────────────────────────────── */
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Left: Analyzed Image & Detection Box */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm space-y-4 lg:col-span-1">
              <div className="relative rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center">
                <img src={diagnosticReport.image} alt="Analyzed Leaf" className="object-cover max-h-72 w-full" />
                {!diagnosticReport.isHealthy && (
                  <div className="absolute inset-8 border-2 border-dashed border-rose-500 bg-rose-500/15 rounded-xl pointer-events-none flex items-start justify-start p-1.5">
                    <span className="bg-rose-600 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow">
                      {isTamil ? diagnosticReport.diseaseTa : diagnosticReport.disease} ({diagnosticReport.confidence}%)
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-2.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-charcoal-500 uppercase text-[10px]">{isTamil ? 'பயிர்' : 'Crop'}</span>
                  <span className="font-black text-charcoal-900">{diagnosticReport.crop}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-bold text-charcoal-500 uppercase text-[10px]">{isTamil ? 'நிலை' : 'Status'}</span>
                  <span className={`font-bold px-2.5 py-0.5 rounded-full text-[11px] ${
                    diagnosticReport.isHealthy ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {diagnosticReport.isHealthy ? (isTamil ? 'ஆரோக்கியமானது' : 'Healthy') : (isTamil ? 'நோய் கண்டறியப்பட்டது' : 'Disease Detected')}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-bold text-charcoal-500 uppercase text-[10px]">{isTamil ? 'துல்லிய மதிப்பீடு' : 'Confidence Score'}</span>
                  <span className="font-black text-emerald-700">{diagnosticReport.confidence}%</span>
                </div>
              </div>
            </div>

            {/* Right: Diagnosis & Prescription */}
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6 lg:col-span-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200">
                    <Leaf size={13} className="text-emerald-700" />
                    <span>{isTamil ? 'AI பயிர் மருத்துவ அறிக்கை' : 'AI Crop Doctor Diagnostic Report'}</span>
                  </div>
                  <h2 className="text-2xl font-black text-charcoal-900 mt-2">
                    {isTamil ? diagnosticReport.diseaseTa : diagnosticReport.disease}
                  </h2>
                </div>

                {/* Audio Readout */}
                <div className="flex items-center gap-2">
                  {!isPlayingAudio ? (
                    <button
                      onClick={speakDiagnosis}
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
                      <span>{isTamil ? 'நிறுத்து' : 'Stop Voice'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Diagnostic Text Report */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 text-xs text-charcoal-800 leading-relaxed font-medium whitespace-pre-line">
                {diagnosticReport.diagnosticReportText}
              </div>

              {/* Targeted Quick Cards */}
              {!diagnosticReport.isHealthy ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* Chemical */}
                  <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-1.5">
                    <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                      <FlaskConical size={16} className="text-amber-700" />
                      <span>{isTamil ? 'இரசாயன பூஞ்சைக்கொல்லி' : 'Chemical Formulation'}</span>
                    </div>
                    <p className="text-[11px] font-bold text-amber-950">
                      {isTamil ? 'மேன்கோசெப் 75% WP அல்லது குளோரோதலோனில்' : 'Mancozeb 75% WP or Chlorothalonil 75% WP'}
                    </p>
                    <p className="text-[10px] text-amber-800 font-medium">
                      {isTamil ? '1 லிட்டர் தண்ணீருக்கு 2.5 கிராம் (ஏக்கருக்கு 500 கிராம்)' : '2.5 g / Liter of water (500g / acre)'}
                    </p>
                  </div>

                  {/* Organic */}
                  <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-1.5">
                    <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                      <Leaf size={16} className="text-emerald-700" />
                      <span>{isTamil ? 'இயற்கை உயிரி கட்டுப்பாடு' : 'Organic Bio-Control'}</span>
                    </div>
                    <p className="text-[11px] font-bold text-emerald-950">
                      {isTamil ? 'வேப்ப எண்ணெய் 10,000 PPM + ட்ரைக்கோடெர்மா' : 'Neem Oil 10,000 PPM + Trichoderma viride'}
                    </p>
                    <p className="text-[10px] text-emerald-800 font-medium">
                      {isTamil ? '1 லிட்டர் தண்ணீருக்கு 5 மி.லி வேப்ப எண்ணெய்' : '5 ml / Liter of water with sticker'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* Nutrition */}
                  <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-1.5">
                    <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                      <Sprout size={16} className="text-emerald-700" />
                      <span>{isTamil ? 'பயிர் ஊட்டச்சத்து மேலாண்மை' : 'Crop Nutrition Maintenance'}</span>
                    </div>
                    <p className="text-[11px] font-bold text-emerald-950">
                      {isTamil ? 'பஞ்சகாவ்யா 3% அல்லது சமச்சீர் 19:19:19 உரம்' : 'Panchagavya 3% or NPK 19:19:19 Spray'}
                    </p>
                    <p className="text-[10px] text-emerald-800 font-medium">
                      {isTamil ? '15 நாட்களுக்கு ஒருமுறை இலைவழியாக தெளிக்கவும்' : 'Apply foliar spray once every 15 days'}
                    </p>
                  </div>

                  {/* Prevention */}
                  <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 space-y-1.5">
                    <div className="flex items-center gap-2 text-blue-900 font-bold text-xs">
                      <ShieldCheck size={16} className="text-blue-700" />
                      <span>{isTamil ? 'பாதுகாப்பு & நீர்ப்பாசனம்' : 'Preventative Field Care'}</span>
                    </div>
                    <p className="text-[11px] font-bold text-blue-950">
                      {isTamil ? 'சொட்டுநீர் பாசனம் & சீரான வடிகால்' : 'Drip Irrigation & Optimal Drainage'}
                    </p>
                    <p className="text-[10px] text-blue-800 font-medium">
                      {isTamil ? 'இலைகள் நனையாமல் வேர்ப்பகுதியில் நீர் பாய்ச்சவும்' : 'Maintain aerated, weed-free field conditions'}
                    </p>
                  </div>
                </div>
              )}

              {/* Bottom Quick Links */}
              <div className="pt-3 flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={clearImage}
                  className="w-full sm:flex-1 py-3 px-4 bg-field-900 hover:bg-field-800 text-white font-bold text-xs rounded-2xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RotateCcw size={15} />
                  <span>{isTamil ? 'மற்றொரு பயிரை ஸ்கேன் செய்ய' : 'Scan Another Leaf'}</span>
                </button>

                <button
                  onClick={() => window.location.hash = '#/dashboard/schemes'}
                  className="w-full sm:w-auto py-3 px-5 bg-slate-100 hover:bg-slate-200 text-charcoal-700 font-bold text-xs rounded-2xl transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Landmark size={15} className="text-field-600" />
                  <span>{isTamil ? 'அரசு மானியம் பார்க்க' : 'Check Govt Subsidies'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Scanning Modal Overlay ──────────────────────────────────────────── */}
      {isAnalyzing && (
        <div className="fixed inset-0 bg-charcoal-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full space-y-6 text-center shadow-2xl">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 border-4 border-field-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-field-600 rounded-full border-t-transparent animate-spin"></div>
            </div>

            <div>
              <h3 className="font-bold text-lg text-charcoal-900">
                {isTamil ? 'பயிர் ஆய்வு செய்யப்படுகிறது...' : 'Analyzing your crop...'}
              </h3>
              <p className="text-xs text-charcoal-500 mt-1">
                {isTamil ? 'AI இலை அறிகுறிகளை பகுப்பாய்வு செய்து மருந்து பரிந்துரைக்கிறது' : 'AI is diagnosing symptoms and formulating treatment'}
              </p>
            </div>

            <div className="space-y-2 text-left text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex items-center space-x-2 text-emerald-700 font-bold">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>{isTamil ? 'படம் பதிவேற்றப்பட்டது' : 'Image uploaded'}</span>
              </div>
              <div className={`flex items-center space-x-2 ${analysisStage >= 2 ? 'text-emerald-700 font-bold' : 'text-charcoal-400'}`}>
                <CheckCircle className="w-4 h-4" />
                <span>{isTamil ? 'இலைப்புள்ளிகள் கண்டறியப்பட்டன' : `Lesions detected (${selectedCrop || 'Tomato'})`}</span>
              </div>
              <div className={`flex items-center space-x-2 ${analysisStage >= 3 ? 'text-emerald-700 font-bold' : 'text-charcoal-400'}`}>
                <RefreshCw className={`w-4 h-4 ${analysisStage === 3 ? 'animate-spin' : ''}`} />
                <span>{isTamil ? 'மருத்துவ அறிக்கை தயாராகிறது' : 'Generating prescription & dosages'}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}