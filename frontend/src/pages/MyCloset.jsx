import { useState, useEffect, useRef } from 'react';
import { Search, Filter, Plus, Sparkles, Upload, Trash2 } from 'lucide-react';
import axios from 'axios';

export default function MyCloset() {
  const [allItems, setAllItems] = useState([]);
  const [displayedItems, setDisplayedItems] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchingAI, setIsSearchingAI] = useState(false);
  
  // Custom manual filters
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterColor, setFilterColor] = useState('All');
  const [filterSeason, setFilterSeason] = useState('All');
  
  // Add Item States
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [imageBase64, setImageBase64] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Tops');
  const [color, setColor] = useState('');
  const [pattern, setPattern] = useState('');
  const [seasons, setSeasons] = useState([]);
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get('http://localhost:5000/wardrobe');
      setAllItems(res.data);
      setDisplayedItems(res.data);
      setSearchQuery('');
    } catch(err) {
      console.error(err);
    }
  };

  const handleAISearch = async () => {
    if (!searchQuery) return;
    setIsSearchingAI(true);
    try {
      const res = await axios.post('http://localhost:5000/ai/search', { query: searchQuery });
      // Update displayed items and reset dropdowns so they reflect the unique AI search result
      setDisplayedItems(allItems.filter(item => matchedIds.includes(item._id)));
      setFilterCategory('All');
      setFilterColor('All');
      setFilterSeason('All');
    } catch (err) {
      console.error("AI Search array failed", err);
      alert("AI search had an error, please try again.");
    } finally {
      setIsSearchingAI(false);
    }
  };

  const handleResetFilter = () => {
    setFilterCategory('All');
    setFilterColor('All');
    setFilterSeason('All');
    setDisplayedItems(allItems);
    setSearchQuery('');
  };

  useEffect(() => {
    // Only apply manual filters if not actively conducting an AI search
    if (isSearchingAI) return;
    let result = allItems;
    if (filterCategory !== 'All') result = result.filter(i => i.category === filterCategory);
    if (filterColor !== 'All') result = result.filter(i => i.color === filterColor);
    if (filterSeason !== 'All') result = result.filter(i => i.seasons && i.seasons.includes(filterSeason));
    setDisplayedItems(result);
  }, [allItems, filterCategory, filterColor, filterSeason]);

  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure you want to permanently delete this item?")) return;
    try {
      await axios.delete(`http://localhost:5000/wardrobe/${id}`);
      setAllItems(prev => prev.filter(item => item._id !== id));
      setDisplayedItems(prev => prev.filter(item => item._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result;
      setImageBase64(base64String);
      setIsAnalyzing(true);
      
      try {
        const res = await axios.post('http://localhost:5000/ai/analyze', { imageBase64: base64String });
        const { name: aiName, category, color, pattern, seasons } = res.data;
        if (category) setCategory(category);
        if (color) setColor(color);
        if (pattern) setPattern(pattern);
        if (seasons) setSeasons(seasons);
        setName(aiName || `${color} ${pattern} ${category}`);
      } catch (err) {
        console.error("AI Analysis failed", err);
      } finally {
        setIsAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const toggleSeason = (season) => {
    setSeasons(prev => 
      prev.includes(season) ? prev.filter(s => s !== season) : [...prev, season]
    );
  };

  const handleAddItem = async () => {
    try {
      await axios.post('http://localhost:5000/wardrobe', {
        imageBase64,
        category,
        color,
        pattern,
        seasons
      });
      setShowAddModal(false);
      setImageBase64('');
      setName('');
      fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex-1 p-8 bg-beige/30">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-4xl font-serif mb-2">My Closet</h1>
          <p className="text-sm text-charcoal/60">{displayedItems.length} items currently showing</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-sage text-white px-5 py-2.5 rounded-lg font-medium hover:bg-sage/90 transition-all flex items-center gap-2 shadow-sm"
        >
          <Plus size={18} /> Add Item
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 mb-10 items-start lg:items-center justify-between bg-white/50 p-4 rounded-2xl border border-sage/10 shadow-sm">
        
        {/* AI Search Bar */}
        <div className="flex gap-3 w-full lg:w-auto">
          <div className="relative flex-1 max-w-sm flex items-center">
            <Search className="absolute left-3 top-3.5 text-charcoal/40" size={17} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAISearch()}
              placeholder="AI Search e.g. 'black tops for summer'" 
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-sage/20 focus:outline-none focus:border-sage focus:ring-1 focus:ring-sage shadow-sm text-[14px]"
            />
          </div>
          <button 
            onClick={handleAISearch} 
            disabled={!searchQuery || isSearchingAI}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-sage text-white rounded-xl hover:bg-sage/90 transition-colors shadow-sm disabled:opacity-50 text-[14px] whitespace-nowrap min-w-[120px]"
          >
            <Sparkles size={16} className={isSearchingAI ? "animate-pulse" : ""} /> 
            {isSearchingAI ? "Thinking..." : "Search AI"}
          </button>
        </div>

        {/* Manual Filters */}
        <div className="flex flex-wrap gap-3 w-full lg:w-auto mt-2 lg:mt-0 items-center">
           <div className="w-[1px] h-8 bg-sage/20 mx-2 hidden lg:block"></div>
           
           <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="px-3.5 py-2.5 rounded-xl bg-white border border-sage/20 focus:outline-none text-[13px] text-charcoal/80 shadow-sm cursor-pointer flex-1 min-w-[120px]">
              <option value="All">All Categories</option>
              {Array.from(new Set(allItems.map(i => i.category).filter(Boolean))).map(cat => <option key={cat} value={cat}>{cat}</option>)}
           </select>
           
           <select value={filterSeason} onChange={e => setFilterSeason(e.target.value)} className="px-3.5 py-2.5 rounded-xl bg-white border border-sage/20 focus:outline-none text-[13px] text-charcoal/80 shadow-sm cursor-pointer flex-1 min-w-[110px]">
              <option value="All">All Seasons</option>
              <option value="Spring">Spring</option>
              <option value="Summer">Summer</option>
              <option value="Fall">Fall</option>
              <option value="Winter">Winter</option>
           </select>
           
           <select value={filterColor} onChange={e => setFilterColor(e.target.value)} className="px-3.5 py-2.5 rounded-xl bg-white border border-sage/20 focus:outline-none text-[13px] text-charcoal/80 shadow-sm cursor-pointer flex-1 min-w-[110px]">
              <option value="All">All Colors</option>
              {Array.from(new Set(allItems.map(i => i.color).filter(Boolean))).map(col => <option key={col} value={col}>{col.substring(0,20)}</option>)}
           </select>
           
           <button onClick={handleResetFilter} className="flex items-center gap-2 px-4 py-2.5 text-charcoal/60 hover:text-charcoal bg-white border border-sage/20 rounded-xl hover:bg-sage/10 transition-colors shadow-sm text-[13px]">
             Reset
           </button>
        </div>
      </div>

      {displayedItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-sage/10 rounded-full flex items-center justify-center text-sage mb-6">
             <Filter size={32} />
          </div>
          <h2 className="text-3xl font-serif mb-3">Your closet is empty</h2>
          <p className="text-charcoal/60 mb-8 max-w-md text-lg">Start building your digital wardrobe by adding your first item.</p>
          <button onClick={() => setShowAddModal(true)} className="bg-sage text-white px-8 py-3.5 rounded-lg font-medium hover:bg-sage/90 flex items-center gap-2 shadow-lg shadow-sage/20">
            <Sparkles size={18} /> Add Your First Item
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
           {displayedItems.map(item => (
             <div key={item._id} className="bg-white rounded-xl shadow-sm border border-sage/10 overflow-hidden group relative">
               <img src={item.imageBase64} className="w-full aspect-square object-cover" />
               <button onClick={() => handleDelete(item._id)} className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm text-rose-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-rose-50">
                  <Trash2 size={16} />
               </button>
               <div className="p-3">
                  <p className="text-sm font-medium">{item.color} {item.pattern}</p>
                  <p className="text-xs text-charcoal/60">{item.category}</p>
               </div>
             </div>
           ))}
        </div>
      )}

      {/* Add Modal remains largely the same */}
      {showAddModal && (
        <div className="fixed inset-0 bg-charcoal/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-ivory rounded-2xl w-full max-w-lg shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-serif">Add New Item</h2>
                <button onClick={() => setShowAddModal(false)} className="text-charcoal/40 hover:text-charcoal"><Upload size={20} className="rotate-45" /></button>
              </div>
              
              <p className="text-sm text-charcoal/60 mb-2">Photo</p>
              
              {!imageBase64 ? (
                <div onClick={() => fileInputRef.current?.click()} className="aspect-square bg-blush/10 rounded-2xl mb-6 relative overflow-hidden flex flex-col items-center justify-center border-2 border-dashed border-sage/30 hover:bg-blush/20 transition-colors cursor-pointer group">
                  <div className="bg-white p-3 rounded-full mb-3 shadow-sm group-hover:scale-110 transition-transform">
                    <Upload size={24} className="text-sage" />
                  </div>
                  <p className="text-charcoal/60 text-sm font-medium">Click or drag image to upload</p>
                  <input type="file" className="hidden" ref={fileInputRef} onChange={handleImageUpload} accept="image/*"/>
                </div>
              ) : (
                <div className="aspect-square rounded-2xl mb-6 relative overflow-hidden flex items-center justify-center">
                  <img src={imageBase64} alt="Preview" className={`w-full h-full object-cover ${isAnalyzing ? 'blur-sm grayscale' : ''}`} />
                  {isAnalyzing && (
                    <div className="absolute inset-0 flex items-center justify-center bg-ivory/40">
                      <div className="bg-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 font-medium">
                         <Sparkles size={16} className="text-sage animate-pulse" /> Analyzing...
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-4">
                 <div>
                   <label className="text-sm text-charcoal/80 mb-1 block">Name</label>
                   <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-3 rounded-lg bg-beige border border-sage/10 focus:outline-none focus:border-sage/50" />
                 </div>
                 <div>
                   <label className="text-sm text-charcoal/80 mb-1 block">Category</label>
                   <select value={category} onChange={e => setCategory(e.target.value)} className="w-full p-3 rounded-lg bg-beige border border-sage/10 focus:outline-none focus:border-sage/50">
                     <option>Tops</option>
                     <option>Bottoms</option>
                     <option>Dresses</option>
                     <option>Outerwear</option>
                     <option>Shoes</option>
                     <option>Accessories</option>
                   </select>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm text-charcoal/80 mb-1 block">Color</label>
                        <input type="text" value={color} onChange={e => setColor(e.target.value)} className="w-full p-3 rounded-lg bg-beige border border-sage/10 focus:outline-none focus:border-sage/50" />
                    </div>
                    <div>
                        <label className="text-sm text-charcoal/80 mb-1 block">Pattern</label>
                        <input type="text" value={pattern} onChange={e => setPattern(e.target.value)} className="w-full p-3 rounded-lg bg-beige border border-sage/10 focus:outline-none focus:border-sage/50" />
                    </div>
                 </div>
                 <div>
                    <label className="text-sm text-charcoal/80 mb-2 block">Seasons</label>
                    <div className="flex gap-2">
                       {['Spring', 'Summer', 'Fall', 'Winter'].map(s => (
                         <span key={s} onClick={() => toggleSeason(s)} className={`px-4 py-2 rounded-full text-sm cursor-pointer transition-colors ${seasons.includes(s) ? 'bg-sage text-white' : 'bg-sage/20 text-charcoal hover:bg-sage/30'}`}>
                           {s}
                         </span>
                       ))}
                    </div>
                 </div>
              </div>
              <button 
                onClick={handleAddItem}
                disabled={isAnalyzing || !imageBase64}
                className="w-full mt-8 py-3 bg-sage text-white rounded-lg font-medium hover:bg-sage/90 disabled:opacity-50"
              >
                Save Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
