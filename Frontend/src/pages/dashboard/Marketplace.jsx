import React, { useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Card } from '../../components/ui/index';
import {
  marketplaceService,
  BUYER_REQUIREMENTS,
  HARVEST_ADVISORY,
  FLEET_VEHICLES,
} from '../../services/marketplaceService';
import {
  CalendarDays, ShoppingBag, PlusCircle, Sparkles, TrendingUp,
  Truck, ArrowRight, CheckCircle2, XCircle, AlertCircle, Info,
  MapPin, Clock, Phone, ShieldCheck, Star, IndianRupee, Filter,
  ArrowUpDown, UploadCloud, Trash2, Eye, MessageSquare, ChevronRight,
  Check, X, Store, Award, BarChart3, HelpCircle, Layers, Send
} from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip,
  CartesianGrid, Legend
} from 'recharts';

// ─── Sub-Navigation Tabs ──────────────────────────────────────────────────────
const TABS = [
  { id: 'harvest', num: 1, labelEn: 'Harvest Recommendation', labelTa: 'அறுவடை பரிந்துரை', icon: CalendarDays },
  { id: 'buyers', num: 2, labelEn: 'Find Buyers', labelTa: 'வாங்குவோரைக் கண்டறிய', icon: ShoppingBag },
  { id: 'sell', num: 3, labelEn: 'My Crop for Sale', labelTa: 'விற்பனைக்கான பயிர்கள்', icon: PlusCircle },
  { id: 'matching', num: 4, labelEn: 'AI Buyer Matching', labelTa: 'AI வாங்குவோர் பொருத்தம்', icon: Sparkles },
  { id: 'opportunity', num: 5, labelEn: 'Best Selling Opportunity', labelTa: 'அதிக நிகர லாப வாய்ப்பு', icon: TrendingUp },
  { id: 'transport', num: 6, labelEn: 'Transportation', labelTa: 'போக்குவரத்து & லாரி', icon: Truck },
];

export default function Marketplace() {
  const { user, activeFarm } = useAuth();
  const { isTamil } = useLanguage();

  // Active Tab: 'harvest' | 'buyers' | 'sell' | 'matching' | 'opportunity' | 'transport'
  const [activeTab, setActiveTab] = useState('harvest');

  // Shared state across screens
  const [selectedCrop, setSelectedCrop] = useState('Tomato');
  const [selectedBuyerId, setSelectedBuyerId] = useState('buyer_2'); // Defaults to Buyer B (Best Net)
  const [buyerModal, setBuyerModal] = useState(null);
  const [contactSuccessModal, setContactSuccessModal] = useState(null);
  const [pickupConfirmModal, setPickupConfirmModal] = useState(false);

  // Screen 2 Filters
  const [buyerSearchQuery, setBuyerSearchQuery] = useState('');
  const [buyerSortBy, setBuyerSortBy] = useState('match'); // 'match' | 'price' | 'distance' | 'date'
  const [gradeFilter, setGradeFilter] = useState('All');

  // Screen 3 Form state
  const [formCrop, setFormCrop] = useState('Tomato');
  const [formVariety, setFormVariety] = useState('Arka Rakshak');
  const [formQuantity, setFormQuantity] = useState('2000');
  const [formUnit, setFormUnit] = useState('kg');
  const [formGrade, setFormGrade] = useState('Grade A');
  const [formDate, setFormDate] = useState('2026-09-14');
  const [formPrice, setFormPrice] = useState('30');
  const [formLocation, setFormLocation] = useState(activeFarm?.name ? `${activeFarm.name}, Plot B` : 'Kumar Fields, Plot B South');
  const [formPhotos, setFormPhotos] = useState([]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [myListings, setMyListings] = useState(() => marketplaceService.getMyListings());

  // Screen 5 Opportunity Sorting
  const [oppSortBy, setOppSortBy] = useState('net'); // 'net' | 'price' | 'transport'

  // Service Data
  const harvestAdvisory = useMemo(() => marketplaceService.getHarvestAdvisory(), []);
  const allBuyers = useMemo(() => marketplaceService.getAllBuyers(), []);
  const matchedOpportunities = useMemo(() => marketplaceService.getOpportunities(selectedCrop, 2000), [selectedCrop]);
  const fleets = useMemo(() => marketplaceService.getTransportFleets(), []);

  // Selected Buyer for Transport (Screen 6)
  const activeTransportBuyer = useMemo(() => {
    return matchedOpportunities.find(b => b.id === selectedBuyerId) || matchedOpportunities[0];
  }, [matchedOpportunities, selectedBuyerId]);

  // Filtered & Sorted Buyers for Screen 2
  const filteredBuyers = useMemo(() => {
    let list = allBuyers.filter(b => {
      const name = isTamil ? (b.nameTa || b.name) : b.name;
      const location = isTamil ? (b.locationTa || b.location) : b.location;
      const matchSearch = name.toLowerCase().includes(buyerSearchQuery.toLowerCase()) ||
                          location.toLowerCase().includes(buyerSearchQuery.toLowerCase()) ||
                          b.crop.toLowerCase().includes(buyerSearchQuery.toLowerCase());
      const matchGrade = gradeFilter === 'All' || b.gradeEn.includes(gradeFilter);
      return matchSearch && matchGrade;
    });

    if (buyerSortBy === 'match') {
      list.sort((a, b) => b.matchScore - a.matchScore);
    } else if (buyerSortBy === 'price') {
      list.sort((a, b) => b.offeredPrice - a.offeredPrice);
    } else if (buyerSortBy === 'distance') {
      list.sort((a, b) => a.distanceKm - b.distanceKm);
    } else if (buyerSortBy === 'date') {
      list.sort((a, b) => a.dateShortEn.localeCompare(b.dateShortEn));
    }
    return list;
  }, [allBuyers, buyerSearchQuery, buyerSortBy, gradeFilter, isTamil]);

  // Sorted Opportunities for Screen 5
  const sortedOpportunities = useMemo(() => {
    const list = [...matchedOpportunities];
    if (oppSortBy === 'net') {
      list.sort((a, b) => b.netPricePerKg - a.netPricePerKg);
    } else if (oppSortBy === 'price') {
      list.sort((a, b) => b.offeredPrice - a.offeredPrice);
    } else if (oppSortBy === 'transport') {
      list.sort((a, b) => a.transportPerKg - b.transportPerKg);
    }
    return list;
  }, [matchedOpportunities, oppSortBy]);

  // Form Submit Handler
  const handlePostCrop = (e) => {
    e.preventDefault();
    if (!formCrop || !formQuantity || !formPrice) return;

    const newListing = marketplaceService.saveListing({
      crop: formCrop,
      cropTa: formCrop === 'Tomato' ? 'தக்காளி' : formCrop === 'Wheat' ? 'கோதுமை' : formCrop === 'Maize' ? 'மக்காச்சோளம்' : 'பருத்தி',
      emoji: formCrop === 'Tomato' ? '🍅' : formCrop === 'Wheat' ? '🌾' : formCrop === 'Maize' ? '🌽' : '🪴',
      varietyEn: formVariety,
      varietyTa: formVariety === 'Arka Rakshak' ? 'அர்கா ரக்ஷக்' : formVariety,
      quantity: Number(formQuantity),
      unit: formUnit,
      gradeEn: formGrade,
      gradeTa: formGrade === 'Grade A' ? 'தரம் A' : formGrade === 'Grade B' ? 'தரம் B' : 'ஏற்றுமதி தரம்',
      expectedHarvestDate: formDate,
      expectedPrice: Number(formPrice),
      locationEn: formLocation,
      locationTa: isTamil ? 'குமார் நிலம், பிளாட் B தெற்கு' : formLocation,
      photos: formPhotos,
    });

    setMyListings(marketplaceService.getMyListings());
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
    }, 4000);
  };

  const handleDeleteListing = (id) => {
    const updated = marketplaceService.deleteListing(id);
    setMyListings(updated);
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const newUrls = files.slice(0, 5 - formPhotos.length).map(f => URL.createObjectURL(f));
    setFormPhotos(prev => [...prev, ...newUrls]);
  };

  const handleRemovePhoto = (index) => {
    setFormPhotos(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="pb-24 max-w-7xl mx-auto pt-4 px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
      {/* ── Top Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏪</span>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-charcoal-900">
              {isTamil ? 'சந்தை வர்த்தகம்' : 'Marketplace & Trade'}
            </h1>
          </div>
          <p className="text-charcoal-500 font-medium text-sm mt-1">
            {isTamil
              ? 'அறுவடை காலம் அறிதல் → வாங்குவோரைக் கண்டறிதல் → நேரடி விற்பனை → AI பொருத்தம் → நிகர லாபம் → போக்குவரத்து வசதி.'
              : 'Harvest Timing → Find Buyers → Post Crop → AI Match → Net Return Optimization → Transport Booking.'}
          </p>
        </div>

        {/* Selected Crop Badge / Switcher */}
        <div className="flex items-center gap-3 self-start md:self-center">
          <span className="text-xs font-bold text-charcoal-400 uppercase tracking-wider">
            {isTamil ? 'பயிர்:' : 'Active Crop:'}
          </span>
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200/80">
            {['Tomato', 'Wheat', 'Maize'].map(c => (
              <button
                key={c}
                onClick={() => setSelectedCrop(c)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedCrop === c
                    ? 'bg-white text-charcoal-900 shadow-sm'
                    : 'text-charcoal-500 hover:text-charcoal-900'
                }`}
              >
                <span>{c === 'Tomato' ? '🍅' : c === 'Wheat' ? '🌾' : '🌽'}</span>
                <span>{isTamil ? (c === 'Tomato' ? 'தக்காளி' : c === 'Wheat' ? 'கோதுமை' : 'மக்காச்சோளம்') : c}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Sub-Navigation Workflow Tabs ────────────────────────────────────── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                isActive
                  ? 'bg-field-900 text-white shadow-md shadow-field-950/20'
                  : 'bg-white text-charcoal-600 border border-slate-200/80 hover:bg-slate-50 hover:text-charcoal-900'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                isActive ? 'bg-harvest-400 text-charcoal-950' : 'bg-slate-100 text-charcoal-500'
              }`}>
                {tab.num}
              </span>
              <Icon size={16} className={isActive ? 'text-harvest-300' : 'text-charcoal-400'} />
              <span>{isTamil ? tab.labelTa : tab.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* SCREEN 1: HARVEST RECOMMENDATION */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {activeTab === 'harvest' && (
        <div className="space-y-6 animate-fade-in">
          {/* Primary Card */}
          <Card className="p-6 md:p-8 bg-gradient-to-br from-field-900 via-field-950 to-charcoal-950 text-white rounded-3xl shadow-xl space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{harvestAdvisory.emoji}</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-harvest-300">
                    {isTamil ? harvestAdvisory.varietyTa : harvestAdvisory.varietyEn}
                  </span>
                </div>
                <h2 className="font-display font-black text-2xl md:text-3xl text-white">
                  {isTamil ? 'பரிந்துரைக்கப்படும் அறுவடை காலம்' : 'Recommended Harvest Period'}
                </h2>
                <p className="text-field-200 text-sm font-medium">
                  {isTamil
                    ? 'பயிரின் முதிர்ச்சி, வரவிருக்கும் வறண்ட வானிலை மற்றும் உச்சபட்ச கொள்முதல் விலையின் அடிப்படையில் கணிக்கப்பட்டது.'
                    : 'Scientifically aligned with peak fruit firmness, 0% rain forecast, and regional mandi supply shortages.'}
                </p>
              </div>

              {/* Counter Pill */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-3xl text-center shrink-0 min-w-[200px]">
                <p className="text-[10px] font-black uppercase tracking-wider text-harvest-300">
                  {isTamil ? 'அறுவடை வரை நாட்கள்' : 'Days Until Harvest'}
                </p>
                <p className="font-display font-black text-5xl text-white my-1 tabular-nums">
                  {harvestAdvisory.daysRemaining}
                </p>
                <span className="inline-block bg-emerald-500/30 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-400/40">
                  {isTamil ? harvestAdvisory.recommendedWindowTa : harvestAdvisory.recommendedWindowEn}
                </span>
              </div>
            </div>

            {/* 4 Sub-Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {harvestAdvisory.drivers.map((d) => (
                <div key={d.id} className="bg-white/10 rounded-2xl p-5 border border-white/10 space-y-2 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{d.icon}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-harvest-400/20 text-harvest-300 border border-harvest-400/30">
                        {isTamil ? d.statusTa : d.statusEn}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-white">
                      {isTamil ? d.headlineTa : d.headlineEn}
                    </h3>
                    <p className="text-xs text-field-200/90 font-medium leading-relaxed mt-1">
                      {isTamil ? d.detailTa : d.detailEn}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-white/10 text-[10px] font-bold text-white/50 uppercase">
                    {isTamil ? d.titleTa : d.titleEn}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveTab('buyers')}
                className="bg-harvest-400 hover:bg-harvest-300 text-field-950 font-black text-sm px-7 py-3.5 rounded-2xl shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer"
              >
                {isTamil ? 'வாங்குவோரைக் கண்டறிய →' : 'Find Buyers →'}
              </button>
            </div>
          </Card>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* SCREEN 2: FIND BUYERS */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {activeTab === 'buyers' && (
        <div className="space-y-6 animate-fade-in">
          {/* Controls / Filter Bar */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 max-w-md">
              <div className="relative w-full">
                <input
                  type="text"
                  value={buyerSearchQuery}
                  onChange={(e) => setBuyerSearchQuery(e.target.value)}
                  placeholder={isTamil ? 'வாங்குவோர், இடம் அல்லது பயிர் தேடுக...' : 'Search buyer name, mandi location, crop...'}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-charcoal-900 focus:outline-none focus:border-field-500"
                />
                <span className="absolute left-3 top-3 text-charcoal-400">🔍</span>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Grade Filter */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="font-bold text-charcoal-400">{isTamil ? 'தரம்:' : 'Grade:'}</span>
                <select
                  value={gradeFilter}
                  onChange={(e) => setGradeFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-charcoal-800 cursor-pointer"
                >
                  <option value="All">{isTamil ? 'அனைத்து தரமும்' : 'All Grades'}</option>
                  <option value="Grade A">Grade A</option>
                  <option value="Grade B">Grade B</option>
                  <option value="Export">Export Grade</option>
                </select>
              </div>

              {/* Sort By */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="font-bold text-charcoal-400">{isTamil ? 'வரிசைப்படுத்து:' : 'Sort By:'}</span>
                <select
                  value={buyerSortBy}
                  onChange={(e) => setBuyerSortBy(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-charcoal-800 cursor-pointer"
                >
                  <option value="match">{isTamil ? 'AI பொருத்தம் %' : 'AI Match %'}</option>
                  <option value="price">{isTamil ? 'அதிக விலை' : 'Highest Price'}</option>
                  <option value="distance">{isTamil ? 'குறைந்த தூரம்' : 'Nearest Distance'}</option>
                  <option value="date">{isTamil ? 'தேவைப்படும் நாள்' : 'Required Date'}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Buyer Requirement Cards List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredBuyers.map((buyer) => {
              const isGreen = buyer.matchScore >= 90;
              const isYellow = buyer.matchScore >= 70 && buyer.matchScore < 90;
              const badgeBg = isGreen
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : isYellow
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-slate-100 text-charcoal-600 border-slate-200';

              const buyerDisplayName = isTamil ? (buyer.nameTa || buyer.name) : buyer.name;
              const buyerDisplayGrade = isTamil ? buyer.gradeTa : buyer.gradeEn;
              const buyerDisplayLocation = isTamil ? buyer.locationTa : buyer.locationEn;
              const buyerDisplayDate = isTamil ? buyer.dateShortTa : buyer.dateShortEn;
              const buyerDisplayType = isTamil ? buyer.buyerTypeTa : buyer.buyerTypeEn;

              return (
                <Card
                  key={buyer.id}
                  className="p-6 bg-white border border-slate-200/90 rounded-3xl shadow-sm hover:shadow-md hover:border-field-300 transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl p-2 bg-slate-50 rounded-2xl border border-slate-100 group-hover:scale-105 transition-transform">
                          {buyer.emoji}
                        </span>
                        <div>
                          <h3 className="font-bold text-charcoal-900 text-base leading-tight">
                            {buyerDisplayName}
                          </h3>
                          <p className="text-[11px] text-charcoal-400 font-semibold mt-0.5">
                            {isTamil ? (buyer.crop === 'Tomato' ? 'தக்காளி' : buyer.crop === 'Wheat' ? 'கோதுமை' : 'மக்காச்சோளம்') : buyer.crop} · <span className="text-field-700">{buyerDisplayGrade}</span>
                          </p>
                        </div>
                      </div>

                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black border ${badgeBg}`}>
                        {buyer.matchScore}% {isTamil ? 'பொருத்தம்' : 'Match'}
                      </span>
                    </div>

                    {/* Specifications Grid */}
                    <div className="grid grid-cols-2 gap-2.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70 text-xs">
                      <div>
                        <p className="text-[10px] font-bold text-charcoal-400 uppercase">{isTamil ? 'தேவை அளவு' : 'Required Qty'}</p>
                        <p className="font-black text-charcoal-900 mt-0.5">{buyer.requiredQuantity.toLocaleString()} {buyer.unit}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-charcoal-400 uppercase">{isTamil ? 'தேவைப்படும் நாள்' : 'Required Date'}</p>
                        <p className="font-bold text-field-700 mt-0.5">{buyerDisplayDate}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-charcoal-400 uppercase">{isTamil ? 'இடம் & தூரம்' : 'Location'}</p>
                        <p className="font-medium text-charcoal-700 mt-0.5 truncate">{buyerDisplayLocation} ({buyer.distanceKm} {isTamil ? 'கி.மீ' : 'km'})</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-charcoal-400 uppercase">{isTamil ? 'கொள்முதல் விலை' : 'Offered Price'}</p>
                        <p className="font-black text-emerald-700 mt-0.5">₹{buyer.offeredPrice} / {isTamil ? 'கிலோ' : 'kg'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-[10px] font-bold text-charcoal-400">
                      ⭐ {buyer.rating} · {buyerDisplayType}
                    </span>
                    <button
                      onClick={() => setBuyerModal(buyer)}
                      className="px-4 py-2 bg-field-900 hover:bg-field-800 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      {isTamil ? 'விவரம் / தொடர்பு' : 'View Buyer'} <ArrowRight size={13} />
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* SCREEN 3: MY CROP FOR SALE (LISTING FORM + ACTIVE LISTINGS) */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {activeTab === 'sell' && (
        <div className="space-y-8 animate-fade-in">
          {/* Post Form Card */}
          <Card className="p-6 md:p-8 bg-white border border-slate-200/90 rounded-3xl shadow-sm space-y-6">
            <div>
              <h2 className="font-display font-bold text-xl text-charcoal-900 flex items-center gap-2">
                <PlusCircle size={22} className="text-field-600" />
                {isTamil ? '🔄 விற்பனைக்கு பயிரை பதிவிடவும்' : '🔄 List Your Crop for Sale'}
              </h2>
              <p className="text-xs text-charcoal-500 font-medium mt-0.5">
                {isTamil
                  ? 'உங்கள் நிலத்தில் தயாராகும் பயிரை முன்கூட்டியே பதிவு செய்து, சிறந்த மொத்த கொள்முதல் விலையைப் பெறுங்கள்.'
                  : 'Post your upcoming harvest to get direct buyer inquiries and automated AI matching.'}
              </p>
            </div>

            {formSubmitted && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-3 animate-fade-in">
                <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
                <span>
                  {isTamil
                    ? 'உங்கள் பயிர் பதிவு நேரலையில் பதிவிடப்பட்டது! வாங்குவோர் இதனை AI Matching பக்கத்தில் உடனடியாகக் காண்பார்கள்.'
                    : 'Your crop listing is now live! Buyers can discover it in Find Buyers and AI Buyer Matching.'}
                </span>
              </div>
            )}

            <form onSubmit={handlePostCrop} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Crop */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-charcoal-700">{isTamil ? 'பயிர்' : 'Crop'}</label>
                  <select
                    value={formCrop}
                    onChange={(e) => setFormCrop(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-charcoal-900 cursor-pointer"
                  >
                    <option value="Tomato">🍅 Tomato ({isTamil ? 'தக்காளி' : 'Tomato'})</option>
                    <option value="Wheat">🌾 Wheat ({isTamil ? 'கோதுமை' : 'Wheat'})</option>
                    <option value="Maize">🌽 Maize ({isTamil ? 'மக்காச்சோளம்' : 'Maize'})</option>
                    <option value="Cotton">🪴 Cotton ({isTamil ? 'பருத்தி' : 'Cotton'})</option>
                    <option value="Onion">🧅 Onion ({isTamil ? 'வெங்காயம்' : 'Onion'})</option>
                  </select>
                </div>

                {/* Quantity & Unit */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-charcoal-700">{isTamil ? 'விற்பனை அளவு' : 'Available Quantity'}</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      required
                      value={formQuantity}
                      onChange={(e) => setFormQuantity(e.target.value)}
                      placeholder="2000"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-charcoal-900"
                    />
                    <select
                      value={formUnit}
                      onChange={(e) => setFormUnit(e.target.value)}
                      className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-charcoal-900 cursor-pointer"
                    >
                      <option value="kg">kg</option>
                      <option value="quintal">quintal</option>
                      <option value="ton">ton</option>
                    </select>
                  </div>
                </div>

                {/* Quality / Grade */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-charcoal-700">{isTamil ? 'தரம் / வகை' : 'Quality / Grade'}</label>
                  <select
                    value={formGrade}
                    onChange={(e) => setFormGrade(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-charcoal-900 cursor-pointer"
                  >
                    <option value="Grade A">Grade A ({isTamil ? 'உயர்தர சூப்பர் மார்க்கெட்' : 'Premium Supermarket'})</option>
                    <option value="Grade B">Grade B ({isTamil ? 'மண்டி பொதுத்தரம்' : 'Standard Mandi'})</option>
                    <option value="Grade C">Grade C ({isTamil ? 'பதப்படுத்தும் ஆலைத் தரம்' : 'Processing/Sauce'})</option>
                    <option value="Export Grade">Export Grade ({isTamil ? 'ரசாயனமற்ற ஏற்றுமதி தரம்' : 'Residue Free'})</option>
                  </select>
                </div>

                {/* Expected Harvest Date */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-charcoal-700">{isTamil ? 'எதிர்பார்க்கப்படும் அறுவடை நாள்' : 'Expected Harvest Date'}</label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-charcoal-900 cursor-pointer"
                  />
                </div>

                {/* Expected Price */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-charcoal-700">{isTamil ? 'எதிர்பார்க்கும் விலை (₹/கிலோ)' : 'Expected Price (₹ per kg)'}</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-charcoal-400 font-bold">₹</span>
                    <input
                      type="number"
                      required
                      value={formPrice}
                      onChange={(e) => setFormPrice(e.target.value)}
                      placeholder="30"
                      className="w-full pl-8 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-charcoal-900"
                    />
                  </div>
                </div>

                {/* Farm Location */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-charcoal-700">{isTamil ? 'பண்ணை அமைவிடம்' : 'Farm Location'}</label>
                  <input
                    type="text"
                    required
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    placeholder="e.g. Plot B South, Nashik"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-charcoal-900"
                  />
                </div>
              </div>

              {/* Photos multi-upload */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-charcoal-700">
                    {isTamil ? 'பயிர் புகைப்படங்கள் (அதிகபட்சம் 5)' : 'Crop Photos (Up to 5 images)'}
                  </label>
                  <span className="text-[10px] font-bold text-field-700 bg-field-50 px-2 py-0.5 rounded-full border border-field-200">
                    💡 {isTamil ? 'புகைப்படம் உள்ள பதிவுகளுக்கு 3 மடங்கு அதிக வாங்குவோர் பார்வை கிடைக்கிறது' : 'Listings with photos get 3x more buyer views'}
                  </span>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  {formPhotos.map((url, i) => (
                    <div key={i} className="relative w-20 h-20 rounded-2xl overflow-hidden border border-slate-200 group">
                      <img src={url} alt="Crop preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(i)}
                        className="absolute top-1 right-1 bg-rose-600 text-white rounded-full p-1 shadow-md hover:bg-rose-700 transition cursor-pointer"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}

                  {formPhotos.length < 5 && (
                    <label className="w-20 h-20 rounded-2xl border-2 border-dashed border-slate-300 hover:border-field-500 bg-slate-50 hover:bg-field-50/40 flex flex-col items-center justify-center text-charcoal-400 hover:text-field-700 cursor-pointer transition">
                      <UploadCloud size={20} />
                      <span className="text-[9px] font-bold mt-1">+ {isTamil ? 'சேர்' : 'Add'}</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Post Button */}
              <button
                type="submit"
                className="w-full py-4 bg-field-900 hover:bg-field-800 text-white font-black text-sm rounded-2xl shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
              >
                <PlusCircle size={18} />
                {isTamil ? 'பயிரை உடனடியாக பதிவிடவும்' : 'Post Crop Now'}
              </button>
            </form>
          </Card>

          {/* Active Listings Section */}
          <div className="space-y-4">
            <h3 className="font-display font-bold text-lg text-charcoal-900 flex items-center gap-2">
              <Layers size={18} className="text-field-600" />
              {isTamil ? 'எனது நேரலை பதிவுகள்' : 'My Active Listings'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myListings.map((l) => (
                <div
                  key={l.id}
                  className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{l.emoji}</span>
                      <div>
                        <h4 className="font-bold text-charcoal-900 text-base">
                          {isTamil ? (l.cropTa || l.crop) : l.crop} — {isTamil ? (l.varietyTa || l.varietyEn) : (l.varietyEn || l.variety)}
                        </h4>
                        <p className="text-xs text-charcoal-400 font-medium">
                          {isTamil ? (l.locationTa || l.locationEn) : (l.locationEn || l.location)} · {isTamil ? (l.gradeTa || l.gradeEn) : (l.gradeEn || l.grade)}
                        </p>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      ● {isTamil ? (l.statusTa || 'நேரலை') : (l.statusEn || l.status)}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-2xl text-xs">
                    <div>
                      <p className="text-[10px] text-charcoal-400 font-bold">{isTamil ? 'அளவு' : 'Quantity'}</p>
                      <p className="font-black text-charcoal-900">{l.quantity.toLocaleString()} {l.unit}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-charcoal-400 font-bold">{isTamil ? 'விலை' : 'Expected Price'}</p>
                      <p className="font-black text-field-700">₹{l.expectedPrice} / {isTamil ? 'கிலோ' : 'kg'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-charcoal-400 font-bold">{isTamil ? 'அறுவடை' : 'Harvest'}</p>
                      <p className="font-bold text-charcoal-800">{l.expectedHarvestDate}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-charcoal-500 font-medium pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1"><Eye size={13} /> {l.viewsCount} {isTamil ? 'பார்வைகள்' : 'views'}</span>
                      <span className="flex items-center gap-1"><MessageSquare size={13} /> {l.inquiriesCount} {isTamil ? 'விசாரணைகள்' : 'inquiries'}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteListing(l.id)}
                      className="text-rose-600 hover:text-rose-700 font-bold text-xs hover:underline cursor-pointer"
                    >
                      {isTamil ? 'நீக்கு' : 'Delete'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* SCREEN 4: AI BUYER MATCHING */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {activeTab === 'matching' && (
        <div className="space-y-6 animate-fade-in">
          {/* Header Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-field-900 to-field-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles size={20} className="text-harvest-300" />
                <h2 className="font-display font-bold text-xl text-white">
                  {isTamil ? '🤖 உங்களுக்கான சிறந்த AI வாங்குவோர்' : '🤖 Best Buyers For You'}
                </h2>
              </div>
              <p className="text-field-200 text-xs font-medium mt-1">
                {isTamil
                  ? 'பொருத்தம் %: விலை போட்டித்தன்மை, தூரம், தேவையான அளவு மற்றும் அறுவடை தேதியின் அடிப்படையில் கணக்கிடப்படுகிறது.'
                  : 'Match % is based on price competitiveness, distance, quantity fit, and required delivery date.'}
              </p>
            </div>

            <span className="self-start sm:self-center px-3.5 py-1.5 rounded-full bg-white/10 text-harvest-300 border border-white/10 text-xs font-bold">
              {matchedOpportunities.length} {isTamil ? 'வாங்குவோர் கண்டறியப்பட்டனர்' : 'Buyers Matched'}
            </span>
          </div>

          {/* Ranked Buyer Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {matchedOpportunities.map((buyer, idx) => {
              const reasonsList = isTamil ? buyer.reasonsTa : buyer.reasonsEn;
              const buyerDisplayName = isTamil ? (buyer.nameTa || buyer.name) : buyer.name;
              const buyerDisplayLocation = isTamil ? buyer.locationTa : buyer.locationEn;
              const buyerDisplayDate = isTamil ? buyer.dateShortTa : buyer.dateShortEn;

              return (
                <Card
                  key={buyer.id}
                  className="p-6 bg-white border border-slate-200/90 rounded-3xl shadow-sm hover:shadow-md hover:border-field-400 transition-all flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-field-50 text-field-700 font-display font-black text-sm flex items-center justify-center border border-field-200">
                          #{idx + 1}
                        </div>
                        <div>
                          <h3 className="font-bold text-charcoal-900 text-base">{buyerDisplayName}</h3>
                          <p className="text-xs text-charcoal-400 font-semibold">{buyerDisplayLocation} · {buyer.distanceKm} {isTamil ? 'கி.மீ' : 'km'}</p>
                        </div>
                      </div>

                      {/* Big Match Badge */}
                      <div className="text-right">
                        <span className={`inline-block px-3.5 py-1 rounded-full text-xs font-black border ${
                          buyer.matchScore >= 90
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {buyer.matchScore}% {isTamil ? 'பொருத்தம்' : 'Match'}
                        </span>
                      </div>
                    </div>

                    {/* Bulleted Reason List */}
                    <div className="space-y-1.5 py-2">
                      {reasonsList.map((r, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs font-semibold">
                          {r.positive ? (
                            <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                          ) : (
                            <XCircle size={14} className="text-rose-500 shrink-0" />
                          )}
                          <span className={r.positive ? 'text-charcoal-800' : 'text-charcoal-500'}>
                            {r.text}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-3 p-3 bg-slate-50 rounded-2xl flex items-center justify-between text-xs">
                      <span className="text-charcoal-500 font-medium">{isTamil ? 'வழங்கும் விலை:' : 'Offered Price:'} <strong className="text-charcoal-900 font-black">₹{buyer.offeredPrice}/{isTamil ? 'கிலோ' : 'kg'}</strong></span>
                      <span className="text-charcoal-500 font-medium">{isTamil ? 'தேவை நாள்:' : 'Due:'} <strong className="text-field-700">{buyerDisplayDate}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 gap-3">
                    <button
                      onClick={() => {
                        setSelectedBuyerId(buyer.id);
                        setActiveTab('opportunity');
                      }}
                      className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-charcoal-800 font-bold text-xs rounded-xl transition cursor-pointer text-center"
                    >
                      {isTamil ? 'நிகர லாபம் காண்க' : 'Compare Net Return'}
                    </button>
                    <button
                      onClick={() => setBuyerModal(buyer)}
                      className="flex-1 py-2.5 bg-field-900 hover:bg-field-800 text-white font-bold text-xs rounded-xl transition cursor-pointer text-center"
                    >
                      {isTamil ? 'தொடர்பு கொள்க' : 'Contact Buyer'}
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* SCREEN 5: BEST SELLING OPPORTUNITY (NET RETURN RANKING) */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {activeTab === 'opportunity' && (
        <div className="space-y-6 animate-fade-in">
          {/* ⭐ Top Recommendation Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-harvest-400 via-amber-300 to-harvest-400 text-charcoal-950 shadow-md border-2 border-harvest-500 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-charcoal-950 text-harvest-300 flex items-center justify-center shrink-0 shadow-md font-bold text-2xl">
                ⭐
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-charcoal-950 text-white px-2.5 py-0.5 rounded-full">
                  {isTamil ? 'அதிக நிகர லாப பரிந்துரை' : 'Best Net Return Opportunity'}
                </span>
                <h2 className="font-display font-black text-xl text-charcoal-950 mt-1">
                  ⭐ {isTamil ? 'பரிந்துரை: கோயம்புத்தூர் டைரக்ட் அக்ரோ கனெக்ட் (Buyer B)' : 'Recommended: Coimbatore Direct Agro Connect (Buyer B)'}
                </h2>
                <p className="text-xs text-charcoal-900 font-bold mt-0.5 leading-relaxed">
                  {isTamil
                    ? 'குறைந்த விலைப்பட்டியல் (₹28/கிலோ) இருந்தபோதிலும், குறைந்த போக்குவரத்துச் செலவால் (₹1/கிலோ) உங்களுக்கு அதிக நிகர வருமானம் (₹27/கிலோ) கிடைக்கிறது!'
                    : 'Better estimated net return (₹27/kg) despite lower listed price due to minimal 12 km freight cost! Saves ₹5,000 in transit.'}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedBuyerId('buyer_2');
                setActiveTab('transport');
              }}
              className="bg-charcoal-950 hover:bg-charcoal-800 text-white font-black text-xs px-6 py-3 rounded-2xl shadow-md transition-all shrink-0 cursor-pointer"
            >
              {isTamil ? 'போக்குவரத்தை திட்டமிடு →' : 'Book Transport →'}
            </button>
          </div>

          {/* Sort Controls */}
          <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/90 text-xs">
            <span className="font-bold text-charcoal-600">
              {isTamil ? 'சூத்திரம்: நிகர வருமானம் = கொள்முதல் விலை − போக்குவரத்து செலவு' : 'Formula: Estimated Net Return = Listed Price − Freight Cost (₹/kg)'}
            </span>
            <div className="flex bg-slate-100 p-1 rounded-xl">
              {[
                { id: 'net', label: isTamil ? 'அதிக நிகர லாபம்' : 'Highest Net Return' },
                { id: 'price', label: isTamil ? 'கொள்முதல் விலை' : 'Listed Price' },
                { id: 'transport', label: isTamil ? 'குறைந்த போக்குவரத்து' : 'Lowest Freight' },
              ].map(s => (
                <button
                  key={s.id}
                  onClick={() => setOppSortBy(s.id)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                    oppSortBy === s.id ? 'bg-white text-charcoal-900 shadow-sm' : 'text-charcoal-500 hover:text-charcoal-900'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Stacked Opportunity Comparison Cards */}
          <div className="space-y-4">
            {sortedOpportunities.map((opp) => {
              const isBest = opp.id === 'buyer_2';
              const buyerDisplayName = isTamil ? (opp.nameTa || opp.name) : opp.name;
              const buyerDisplayLocation = isTamil ? opp.locationTa : opp.locationEn;

              return (
                <div
                  key={opp.id}
                  className={`p-6 rounded-3xl border transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6 ${
                    isBest
                      ? 'bg-emerald-50/50 border-2 border-emerald-400 shadow-md'
                      : 'bg-white border-slate-200/90 hover:border-field-300 shadow-sm'
                  }`}
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{opp.emoji}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-charcoal-900 text-base">{buyerDisplayName}</h3>
                          {isBest && (
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black uppercase">
                              ⭐ {isTamil ? 'சிறந்த நிகர ஒப்பந்தம்' : 'Best Net Deal'}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-charcoal-400 font-semibold">{buyerDisplayLocation} · {opp.distanceKm} {isTamil ? 'கி.மீ தூரம்' : 'km away'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Financial Math Breakdown */}
                  <div className="grid grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-center shrink-0 min-w-[320px]">
                    <div>
                      <p className="text-[10px] font-bold text-charcoal-400 uppercase">{isTamil ? 'கொள்முதல் விலை' : 'Listed Price'}</p>
                      <p className="font-bold text-charcoal-900 text-base mt-0.5">₹{opp.offeredPrice} / {isTamil ? 'கிலோ' : 'kg'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-rose-500 uppercase">{isTamil ? 'போக்குவரத்து' : 'Freight Cost'}</p>
                      <p className="font-bold text-rose-600 text-base mt-0.5">-₹{opp.transportPerKg} / {isTamil ? 'கிலோ' : 'kg'}</p>
                    </div>
                    <div className="bg-emerald-100/70 rounded-xl p-1 border border-emerald-300/80">
                      <p className="text-[10px] font-black text-emerald-800 uppercase">{isTamil ? 'நிகர லாபம்' : 'Est. Net'}</p>
                      <p className="font-black text-emerald-950 text-lg mt-0.5">₹{opp.netPricePerKg} / {isTamil ? 'கிலோ' : 'kg'}</p>
                    </div>
                  </div>

                  {/* CTA Action */}
                  <button
                    onClick={() => {
                      setSelectedBuyerId(opp.id);
                      setActiveTab('transport');
                    }}
                    className={`px-6 py-3 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer shadow-sm ${
                      isBest
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-field-900 hover:bg-field-800 text-white'
                    }`}
                  >
                    {isTamil ? 'போக்குவரத்து ஏற்பாடு செய்க' : 'Select for Transport'} <ArrowRight size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* SCREEN 6: TRANSPORTATION & LOGISTICS */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {activeTab === 'transport' && (
        <div className="space-y-6 animate-fade-in">
          {/* Active Selected Buyer Summary */}
          <Card className="p-6 md:p-8 bg-gradient-to-br from-field-900 to-field-950 text-white rounded-3xl shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-harvest-300">
                  {isTamil ? 'தேர்ந்தெடுக்கப்பட்ட வாங்குவோர்' : 'Target Destination & Buyer'}
                </span>
                <h2 className="font-display font-black text-2xl text-white mt-1">
                  {isTamil ? (activeTransportBuyer.nameTa || activeTransportBuyer.name) : activeTransportBuyer.name}
                </h2>
                <p className="text-field-200 text-xs font-medium">
                  {isTamil ? activeTransportBuyer.locationTa : activeTransportBuyer.locationEn} · {activeTransportBuyer.distanceKm} {isTamil ? 'கி.மீ போக்குவரத்து' : 'km transit'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-white/70 font-semibold">{isTamil ? 'மாற்று வாங்குவோர்:' : 'Switch Buyer:'}</span>
                <select
                  value={selectedBuyerId}
                  onChange={(e) => setSelectedBuyerId(e.target.value)}
                  className="px-3 py-1.5 bg-white/10 border border-white/20 rounded-xl text-xs font-bold text-white cursor-pointer"
                >
                  {matchedOpportunities.map((b) => (
                    <option key={b.id} value={b.id} className="text-charcoal-900">
                      {isTamil ? (b.nameTa || b.name) : b.name} (₹{b.netPricePerKg}/{isTamil ? 'கிலோ நிகரம்' : 'kg Net'})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Financial & Logistics Summary Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                <p className="text-[10px] font-bold text-field-300 uppercase">{isTamil ? 'தூரம்' : 'Distance'}</p>
                <p className="font-black text-xl text-white mt-0.5">{activeTransportBuyer.distanceKm} {isTamil ? 'கி.மீ' : 'km'}</p>
              </div>
              <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                <p className="text-[10px] font-bold text-field-300 uppercase">{isTamil ? 'பயண நேரம்' : 'Est. Travel Time'}</p>
                <p className="font-black text-xl text-white mt-0.5">{(activeTransportBuyer.distanceKm / 40).toFixed(1)} {isTamil ? 'மணி' : 'hrs'}</p>
              </div>
              <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                <p className="text-[10px] font-bold text-field-300 uppercase">{isTamil ? 'விற்பனை விலை' : 'Selling Price'}</p>
                <p className="font-black text-xl text-white mt-0.5">₹{activeTransportBuyer.offeredPrice}/{isTamil ? 'கிலோ' : 'kg'}</p>
              </div>
              <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                <p className="text-[10px] font-bold text-rose-300 uppercase">{isTamil ? 'போக்குவரத்து' : 'Freight / kg'}</p>
                <p className="font-black text-xl text-rose-300 mt-0.5">₹{activeTransportBuyer.transportPerKg}/{isTamil ? 'கிலோ' : 'kg'}</p>
              </div>
              <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                <p className="text-[10px] font-bold text-field-300 uppercase">{isTamil ? 'மொத்த வாடகை' : 'Total Freight'}</p>
                <p className="font-black text-xl text-white mt-0.5">₹{activeTransportBuyer.transportTotal.toLocaleString()}</p>
              </div>
              <div className="bg-harvest-400 text-charcoal-950 p-4 rounded-2xl font-bold shadow-inner">
                <p className="text-[10px] font-black uppercase">{isTamil ? 'எதிர்பார்க்கும் நிகர லாபம்' : 'Expected Net Return'}</p>
                <p className="font-black text-2xl mt-0.5">₹{activeTransportBuyer.netPricePerKg}/{isTamil ? 'கிலோ' : 'kg'}</p>
              </div>
            </div>
          </Card>

          {/* Side-by-Side Comparison Chart */}
          <Card className="p-6 md:p-8 bg-white border border-slate-200/90 rounded-3xl shadow-sm space-y-4">
            <h3 className="font-display font-bold text-lg text-charcoal-900 flex items-center gap-2">
              <BarChart3 size={20} className="text-field-600" />
              {isTamil ? 'விலை vs போக்குவரத்து vs நிகர லாபம் ஒப்பீடு' : 'Selling Price vs Freight vs Net Return Comparison'}
            </h3>
            <p className="text-xs text-charcoal-500 font-medium">
              {isTamil ? 'அனைத்து வாங்குவோருக்கும் இடையேயான நேரடி நிதி ஒப்பீடு.' : 'Visualized net profitability across all regional buyers.'}
            </p>

            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={matchedOpportunities.slice(0, 4).map(b => ({
                    ...b,
                    displayName: isTamil ? (b.nameTa || b.name) : b.name
                  }))}
                  margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="displayName" tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 11, fontWeight: 600 }} />
                  <Bar dataKey="offeredPrice" name={isTamil ? 'விற்பனை விலை (₹/கிலோ)' : 'Offered Price (₹/kg)'} fill="#3b82f6" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="transportPerKg" name={isTamil ? 'போக்குவரத்து (₹/கிலோ)' : 'Freight (₹/kg)'} fill="#f43f5e" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="netPricePerKg" name={isTamil ? 'நிகர லாபம் (₹/கிலோ)' : 'Net Return (₹/kg)'} fill="#10b981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Verified Vehicle Fleet Options */}
          <div className="space-y-4">
            <h3 className="font-display font-bold text-lg text-charcoal-900 flex items-center gap-2">
              <Truck size={20} className="text-field-600" />
              {isTamil ? 'சரிபார்க்கப்பட்ட வாகனங்கள் & ஓட்டுநர்கள்' : 'Verified Available Transport Fleets'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {fleets.map((fleet) => (
                <div
                  key={fleet.id}
                  className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">🚛</span>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        ⭐ {fleet.rating} {isTamil ? 'சரிபார்க்கப்பட்டது' : 'Verified'}
                      </span>
                    </div>
                    <h4 className="font-bold text-charcoal-900 text-sm">
                      {isTamil ? fleet.typeTa : fleet.typeEn}
                    </h4>
                    <p className="text-xs text-charcoal-500 font-medium mt-0.5">
                      {isTamil ? 'கொள்ளளவு:' : 'Capacity:'} {isTamil ? fleet.capacityTa : fleet.capacityEn}
                    </p>
                    <p className="text-xs text-field-700 font-bold mt-1">
                      {isTamil ? 'வாடகை:' : 'Rate:'} ₹{fleet.ratePerKm} / {isTamil ? 'கி.மீ' : 'km'}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-charcoal-600 font-bold flex items-center gap-1">
                      <Phone size={13} className="text-field-600" /> {fleet.phone}
                    </span>
                    <button
                      onClick={() => setPickupConfirmModal(true)}
                      className="px-3 py-1.5 bg-field-900 hover:bg-field-800 text-white font-bold rounded-xl transition cursor-pointer"
                    >
                      {isTamil ? 'வாகனம் முன்பதிவு' : 'Book Truck'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* MODAL: BUYER DETAILS */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {buyerModal && (
        <div className="fixed inset-0 bg-charcoal-900/60 backdrop-blur-sm flex items-center justify-center p-3 z-50 animate-fade-in">
          <div className="bg-white rounded-[2rem] w-full max-w-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 bg-gradient-to-r from-field-900 to-field-800 text-white rounded-t-[2rem] shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{buyerModal.emoji}</span>
                <div>
                  <h2 className="font-display font-bold text-xl text-white">
                    {isTamil ? (buyerModal.nameTa || buyerModal.name) : buyerModal.name}
                  </h2>
                  <p className="text-emerald-100 text-xs font-semibold mt-0.5">
                    {isTamil ? buyerModal.buyerTypeTa : buyerModal.buyerTypeEn} · <span className="text-amber-300">⭐ {buyerModal.rating}</span>
                  </p>
                </div>
              </div>
              <button onClick={() => setBuyerModal(null)} className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition cursor-pointer">
                <X size={20} className="text-white" />
              </button>
            </div>

            <div className="p-6 md:p-8 overflow-y-auto space-y-5 flex-1 text-xs text-charcoal-700">
              <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                <div>
                  <p className="font-bold text-charcoal-400 uppercase text-[10px]">{isTamil ? 'தேவை அளவு' : 'Required Volume'}</p>
                  <p className="font-black text-base text-charcoal-900 mt-0.5">{buyerModal.requiredQuantity.toLocaleString()} {buyerModal.unit}</p>
                </div>
                <div>
                  <p className="font-bold text-charcoal-400 uppercase text-[10px]">{isTamil ? 'வழங்கும் கொள்முதல் விலை' : 'Offered Price'}</p>
                  <p className="font-black text-base text-emerald-700 mt-0.5">₹{buyerModal.offeredPrice} / {isTamil ? 'கிலோ' : 'kg'}</p>
                </div>
                <div>
                  <p className="font-bold text-charcoal-400 uppercase text-[10px]">{isTamil ? 'தேவைப்படும் தேதி' : 'Required Delivery Date'}</p>
                  <p className="font-bold text-charcoal-900 mt-0.5">{isTamil ? buyerModal.requiredDateTa : buyerModal.requiredDateEn}</p>
                </div>
                <div>
                  <p className="font-bold text-charcoal-400 uppercase text-[10px]">{isTamil ? 'பணம் செலுத்தும் முறை' : 'Payment Terms'}</p>
                  <p className="font-bold text-charcoal-900 mt-0.5">{isTamil ? buyerModal.paymentTermsTa : buyerModal.paymentTermsEn}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-bold text-charcoal-900 uppercase text-[10px] tracking-wider">{isTamil ? 'AI பொருத்தம் பகுப்பாய்வு' : 'AI Match Breakdown'}</p>
                {(isTamil ? buyerModal.reasonsTa : buyerModal.reasonsEn).map((r, i) => (
                  <div key={i} className="flex items-center gap-2 font-medium">
                    {r.positive ? <Check size={14} className="text-emerald-600" /> : <X size={14} className="text-rose-500" />}
                    <span className={r.positive ? 'text-charcoal-800' : 'text-charcoal-500'}>{r.text}</span>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center gap-2.5 text-emerald-900 font-semibold">
                <ShieldCheck size={18} className="text-emerald-600 shrink-0" />
                <span>{isTamil ? 'இந்த வாங்குவோர் GreenAgriX மூலம் சரிபார்க்கப்பட்டு உத்தரவாதம் அளிக்கப்பட்டுள்ளார்.' : 'Verified AgriX Trader with automated digital payment escrow protection.'}</span>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
              <button
                onClick={() => setBuyerModal(null)}
                className="px-4 py-2 border border-slate-200 text-charcoal-600 font-bold rounded-xl hover:bg-slate-100 transition cursor-pointer text-xs"
              >
                {isTamil ? 'மூடு' : 'Close'}
              </button>
              <button
                onClick={() => {
                  setContactSuccessModal(buyerModal);
                  setBuyerModal(null);
                }}
                className="px-6 py-2.5 bg-field-900 hover:bg-field-800 text-white font-bold rounded-xl transition flex items-center gap-2 cursor-pointer text-xs shadow-sm"
              >
                <Send size={14} /> {isTamil ? 'நேரடி அழைப்பு / வாட்ஸ்அப்' : 'Connect with Buyer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* MODAL: CONTACT SUCCESS NOTIFICATION */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {contactSuccessModal && (
        <div className="fixed inset-0 bg-charcoal-900/60 backdrop-blur-sm flex items-center justify-center p-3 z-50 animate-fade-in">
          <div className="bg-white rounded-[2rem] w-full max-w-md p-6 text-center space-y-4 shadow-2xl">
            <div className="w-14 h-14 rounded-3xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="font-display font-bold text-xl text-charcoal-900">
              {isTamil ? 'வாங்குவோர் இணைப்பு வெற்றிகரமாக அனுப்பப்பட்டது!' : 'Inquiry Sent to Buyer!'}
            </h3>
            <p className="text-xs text-charcoal-600 font-medium leading-relaxed">
              {isTamil
                ? `${contactSuccessModal.nameTa || contactSuccessModal.name} அவர்களின் வாங்குதல் மேலாளருக்கு உங்கள் அறுவடை விவரங்கள் அனுப்பப்பட்டுள்ளன. அவர்கள் உங்களை 30 நிமிடங்களுக்குள் தொடர்புகொள்வார்கள்.`
                : `Your harvest specifications have been transmitted to ${contactSuccessModal.name}. Their procurement manager will reach you within 30 minutes.`}
            </p>
            <div className="pt-2">
              <button
                onClick={() => setContactSuccessModal(null)}
                className="w-full py-3 bg-charcoal-900 hover:bg-charcoal-800 text-white font-bold text-xs rounded-xl transition cursor-pointer"
              >
                {isTamil ? 'சரி' : 'Done'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* MODAL: PICKUP BOOKED CONFIRMATION */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {pickupConfirmModal && (
        <div className="fixed inset-0 bg-charcoal-900/60 backdrop-blur-sm flex items-center justify-center p-3 z-50 animate-fade-in">
          <div className="bg-white rounded-[2rem] w-full max-w-md p-6 text-center space-y-4 shadow-2xl">
            <div className="w-14 h-14 rounded-3xl bg-field-100 text-field-700 flex items-center justify-center mx-auto">
              <Truck size={32} />
            </div>
            <h3 className="font-display font-bold text-xl text-charcoal-900">
              {isTamil ? 'வாகன முன்பதிவு உறுதி செய்யப்பட்டது!' : 'Pickup Request Confirmed!'}
            </h3>
            <p className="text-xs text-charcoal-600 font-medium leading-relaxed">
              {isTamil
                ? `வாகனம் உங்கள் பண்ணைக்கு செப்டம்பர் 14 அன்று காலை 7:00 மணிக்கு வர திட்டமிடப்பட்டுள்ளது. ஓட்டுநர் தகவல் எஸ்.எம்.எஸ் மூலம் அனுப்பப்படும்.`
                : `Vehicle scheduled for field pickup on September 14 at 7:00 AM. Driver live tracking link has been sent to your registered mobile.`}
            </p>
            <div className="pt-2">
              <button
                onClick={() => setPickupConfirmModal(false)}
                className="w-full py-3 bg-field-900 hover:bg-field-800 text-white font-bold text-xs rounded-xl transition cursor-pointer"
              >
                {isTamil ? 'முடிந்தது' : 'Great, Thank you!'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
