import { useState, useEffect } from 'react';
import { Plane, Sparkles, MapPin, Calendar, CloudRain, Briefcase } from 'lucide-react';
import axios from 'axios';

export default function Travel() {
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [weather, setWeather] = useState('');
  const [occasion, setOccasion] = useState('');
  
  const [isPlanning, setIsPlanning] = useState(false);
  const [packingPlan, setPackingPlan] = useState(null);
  const [wardrobe, setWardrobe] = useState([]);

  useEffect(() => {
    fetchWardrobe();
  }, []);

  const fetchWardrobe = async () => {
    try {
      const res = await axios.get('http://localhost:5000/wardrobe');
      setWardrobe(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePlanTrip = async (e) => {
    e.preventDefault();
    setIsPlanning(true);
    try {
      const res = await axios.post('http://localhost:5000/ai/packing', {
        destination,
        startDate,
        endDate,
        weather,
        occasion
      });
      setPackingPlan(res.data);
    } catch (err) {
      console.error(err);
      alert("Oops! The AI couldn't generate a plan. Please try again.");
    } finally {
      setIsPlanning(false);
    }
  };

  const renderItemGroup = (title, itemIds) => {
    if (!itemIds || itemIds.length === 0) return null;
    const items = itemIds.map(id => wardrobe.find(w => w._id === id)).filter(Boolean);
    if (items.length === 0) return null;

    return (
      <div className="mb-8">
        <h3 className="text-xl font-serif text-charcoal mb-4 flex items-center gap-2">
          {title} <span className="text-sm font-sans text-charcoal/40 bg-charcoal/5 px-2 py-0.5 rounded-full">{items.length}</span>
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map(item => (
            <div key={item._id} className="bg-white rounded-xl shadow-sm border border-sage/10 overflow-hidden">
               <img src={item.imageBase64} className="w-full aspect-square object-cover" />
               <div className="p-2 text-center text-xs font-medium text-charcoal truncate">
                 {item.color} {item.pattern}
               </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 p-8 bg-beige/30 max-w-6xl mx-auto w-full">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-serif mb-2 flex items-center gap-3">Travel Planner <Plane className="text-sage" size={32} /></h1>
          <p className="text-lg text-charcoal/60">Pack smart with AI-powered capsule wardrobe suggestions.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Input Form */}
        <div className="w-full lg:w-1/3">
          <div className="bg-ivory rounded-2xl shadow-sm border border-sage/10 p-6">
            <h2 className="text-xl font-serif mb-6">Trip Details</h2>
            <form onSubmit={handlePlanTrip} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-charcoal/80 mb-1 flex items-center gap-2"><MapPin size={16}/> Destination</label>
                <input required type="text" value={destination} onChange={e => setDestination(e.target.value)} placeholder="e.g. Paris, France" className="w-full p-3 rounded-xl bg-white border border-sage/20 focus:outline-none focus:border-sage shadow-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-charcoal/80 mb-1 flex items-center gap-2"><Calendar size={16}/> Start Date</label>
                  <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full p-3 rounded-xl bg-white border border-sage/20 focus:outline-none focus:border-sage shadow-sm" />
                </div>
                <div>
                  <label className="text-sm font-medium text-charcoal/80 mb-1 flex items-center gap-2"><Calendar size={16}/> End Date</label>
                  <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full p-3 rounded-xl bg-white border border-sage/20 focus:outline-none focus:border-sage shadow-sm" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-charcoal/80 mb-1 flex items-center gap-2"><CloudRain size={16}/> Weather</label>
                <input required type="text" value={weather} onChange={e => setWeather(e.target.value)} placeholder="e.g. Rainy, Cold" className="w-full p-3 rounded-xl bg-white border border-sage/20 focus:outline-none focus:border-sage shadow-sm" />
              </div>
              <div>
                <label className="text-sm font-medium text-charcoal/80 mb-1 flex items-center gap-2"><Briefcase size={16}/> Occasion</label>
                <input type="text" value={occasion} onChange={e => setOccasion(e.target.value)} placeholder="e.g. Business, Sightseeing" className="w-full p-3 rounded-xl bg-white border border-sage/20 focus:outline-none focus:border-sage shadow-sm" />
              </div>
              
              <button 
                type="submit"
                disabled={isPlanning || !destination || !weather}
                className="w-full mt-6 py-3.5 bg-sage text-white rounded-xl font-medium hover:bg-sage/90 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-sage/20"
              >
                {isPlanning ? <><Sparkles size={18} className="animate-pulse" /> Planning...</> : "Get Packing Suggestions"}
              </button>
            </form>
          </div>
        </div>

        {/* Results output */}
        <div className="w-full lg:w-2/3">
          {!packingPlan && !isPlanning ? (
            <div className="h-full min-h-[400px] flex flex-col justify-center items-center text-center p-8 bg-ivory/50 rounded-2xl border border-dashed border-sage/30">
               <div className="w-16 h-16 bg-white rounded-full flex justify-center items-center shadow-sm mb-4">
                  <Plane className="text-sage" size={24} />
               </div>
               <h3 className="text-xl font-serif mb-2">Where to next?</h3>
               <p className="text-charcoal/60 max-w-sm">Enter your trip details and let the AI build the perfect minimalist capsule wardrobe for your journey.</p>
            </div>
          ) : isPlanning ? (
             <div className="h-full min-h-[400px] flex flex-col justify-center items-center text-center p-8 bg-ivory/50 rounded-2xl border border-sage/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-sage/5 animate-pulse"></div>
                <div className="relative z-10 w-20 h-20 bg-white rounded-full flex justify-center items-center shadow-lg shadow-sage/10 mb-6">
                  <Sparkles className="text-sage animate-spin-slow" size={32} />
               </div>
               <h3 className="text-2xl font-serif mb-2 relative z-10 text-charcoal">Analyzing your wardrobe...</h3>
               <p className="text-charcoal/60 max-w-sm relative z-10">Matching your clothes with the weather in {destination || 'your destination'}</p>
             </div>
          ) : (
            <div className="bg-ivory rounded-2xl shadow-sm border border-sage/10 p-8">
               <div className="bg-sage/10 text-sage p-4 rounded-xl mb-8 flex gap-3 text-sm leading-relaxed border border-sage/20">
                  <Sparkles size={20} className="shrink-0 mt-0.5" />
                  <p>{packingPlan.summary}</p>
               </div>

               {renderItemGroup("Tops", packingPlan.tops)}
               {renderItemGroup("Bottoms", packingPlan.bottoms)}
               {renderItemGroup("Outerwear", packingPlan.outerwear)}
               {renderItemGroup("Shoes", packingPlan.shoes)}
               {renderItemGroup("Accessories", packingPlan.accessories)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
