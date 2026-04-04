import { useState, useEffect } from 'react';
import { Plus, Check, Upload, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';

export default function Outfits() {
  const [outfits, setOutfits] = useState([]);
  const [wardrobe, setWardrobe] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // New Outfit States
  const [name, setName] = useState('');
  const [occasion, setOccasion] = useState('Casual');
  const [selectedItemIds, setSelectedItemIds] = useState([]);
  const [userPhotoBase64, setUserPhotoBase64] = useState('');

  useEffect(() => {
    fetchOutfits();
    fetchWardrobe();
  }, []);

  const fetchOutfits = async () => {
    try {
      const res = await axios.get('http://localhost:5000/outfits');
      setOutfits(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchWardrobe = async () => {
    try {
      const res = await axios.get('http://localhost:5000/wardrobe');
      setWardrobe(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleItem = (id) => {
    setSelectedItemIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setUserPhotoBase64(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleCreateOutfit = async () => {
    if (!name || selectedItemIds.length === 0) return;
    
    try {
      await axios.post('http://localhost:5000/outfits', {
        name,
        occasion,
        items: selectedItemIds,
        userPhotoBase64
      });
      setShowModal(false);
      setName('');
      setSelectedItemIds([]);
      setUserPhotoBase64('');
      fetchOutfits();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex-1 p-8 bg-beige/30">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-4xl font-serif mb-2">My Favorite Outfits</h1>
          <p className="text-sm text-charcoal/60">{outfits.length} saved combinations</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-navy text-white px-5 py-2.5 rounded-lg font-medium hover:bg-navy/90 transition-all flex items-center gap-2 shadow-sm"
        >
          <Plus size={18} /> Create Outfit
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {outfits.map(outfit => (
          <div key={outfit._id} className="bg-white rounded-2xl shadow-sm border border-sage/10 overflow-hidden">
             
             {/* If user uploaded their own photo wearing it, show it. Otherwise show grid of items */}
             {outfit.userPhotoBase64 ? (
                <div className="w-full aspect-[4/5] relative">
                   <img src={outfit.userPhotoBase64} alt={outfit.name} className="w-full h-full object-cover" />
                   <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-charcoal shadow-sm">
                      {outfit.occasion}
                   </div>
                </div>
             ) : (
                <div className="w-full aspect-[4/5] bg-beige/50 p-4 grid grid-cols-2 gap-2 content-start">
                   {outfit.items.slice(0, 4).map(item => (
                     <div key={item._id} className="aspect-square bg-white rounded-lg shadow-sm overflow-hidden">
                       <img src={item.imageBase64} className="w-full h-full object-cover" />
                     </div>
                   ))}
                </div>
             )}

             <div className="p-5 border-t border-sage/10">
                <h3 className="text-xl font-serif mb-1">{outfit.name}</h3>
                <p className="text-sm text-charcoal/60 mb-4">{outfit.items.length} items from your closet</p>
                
                {/* Show thumbnail circles of the items if user photo is main */}
                {outfit.userPhotoBase64 && (
                  <div className="flex gap-2">
                     {outfit.items.map(item => (
                       <div key={item._id} className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden">
                          <img src={item.imageBase64} className="w-full h-full object-cover" />
                       </div>
                     ))}
                  </div>
                )}
             </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-charcoal/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-ivory rounded-2xl w-full max-w-3xl shadow-2xl relative max-h-[90vh] overflow-y-auto flex flex-col md:flex-row">
            
            {/* Left side: Metadata and Photo Upload */}
            <div className="p-8 md:w-1/2 border-b md:border-b-0 md:border-r border-sage/10 bg-white">
              <h2 className="text-2xl font-serif mb-6">Save an Outfit</h2>
              
              <div className="space-y-4">
                 <div>
                   <label className="text-sm font-medium text-charcoal/80 mb-1 block">Outfit Name</label>
                   <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Summer Brunch" className="w-full p-3 rounded-lg bg-beige/50 border border-sage/20 focus:outline-none focus:border-sage" />
                 </div>
                 <div>
                   <label className="text-sm font-medium text-charcoal/80 mb-1 block">Occasion</label>
                   <select value={occasion} onChange={e => setOccasion(e.target.value)} className="w-full p-3 rounded-lg bg-beige/50 border border-sage/20 focus:outline-none focus:border-sage">
                     <option>Casual</option>
                     <option>Office</option>
                     <option>Party</option>
                     <option>Travel</option>
                     <option>Workout</option>
                   </select>
                 </div>

                 <div className="mt-6">
                    <label className="text-sm font-medium text-charcoal/80 mb-2 block">Reference Photo (Optional)</label>
                    <p className="text-xs text-charcoal/50 mb-3 block">Upload a photo of yourself wearing this outfit so you remember exactly how it looks!</p>
                    
                    {!userPhotoBase64 ? (
                      <label className="aspect-video w-full bg-blush/10 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-sage/30 hover:bg-blush/20 transition-colors cursor-pointer group">
                        <ImageIcon size={24} className="text-sage mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-sm text-charcoal/60">Upload Photo</span>
                        <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                      </label>
                    ) : (
                      <div className="aspect-video w-full rounded-xl overflow-hidden relative">
                         <img src={userPhotoBase64} className="w-full h-full object-cover" />
                         <button onClick={() => setUserPhotoBase64('')} className="absolute top-2 right-2 bg-charcoal/60 text-white p-1 rounded-full hover:bg-charcoal">✕</button>
                      </div>
                    )}
                 </div>
              </div>
            </div>

            {/* Right side: Wardrobe Selection */}
            <div className="p-8 md:w-1/2 bg-ivory/50 flex flex-col">
              <div className="flex justify-between items-center mb-4">
                 <h3 className="text-lg font-medium text-charcoal">Select Items ({selectedItemIds.length})</h3>
                 <button onClick={() => setShowModal(false)} className="text-charcoal/40 hover:text-charcoal md:hidden">✕</button>
              </div>

              <div className="grid grid-cols-3 gap-3 overflow-y-auto stylish-scrollbar pr-2 max-h-[40vh] md:max-h-[500px]">
                 {wardrobe.map(item => {
                   const isSelected = selectedItemIds.includes(item._id);
                   return (
                     <div 
                       key={item._id} 
                       onClick={() => toggleItem(item._id)}
                       className={`aspect-square rounded-xl overflow-hidden cursor-pointer relative border-2 transition-all ${isSelected ? 'border-sage shadow-md' : 'border-transparent opacity-80 hover:opacity-100'}`}
                     >
                        <img src={item.imageBase64} className="w-full h-full object-cover" />
                        {isSelected && (
                          <div className="absolute top-1 right-1 bg-sage text-white rounded-full p-0.5 shadow-sm">
                             <Check size={14} />
                          </div>
                        )}
                     </div>
                   );
                 })}
              </div>

              <div className="mt-auto pt-6 flex gap-3">
                 <button onClick={() => setShowModal(false)} className="flex-1 py-3 text-charcoal font-medium hover:bg-sage/10 rounded-lg transition-colors hidden md:block border border-sage/20">Cancel</button>
                 <button 
                   onClick={handleCreateOutfit}
                   disabled={!name || selectedItemIds.length === 0}
                   className="flex-2 w-full py-3 bg-navy text-white rounded-lg font-medium hover:bg-navy/90 disabled:opacity-50 transition-colors"
                 >
                   Save Outfit
                 </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
