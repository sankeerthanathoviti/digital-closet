import { useState, useEffect } from 'react';
import { Sparkles, Trash2, Plus, ShoppingBag } from 'lucide-react';
import axios from 'axios';

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [isDetecting, setIsDetecting] = useState(false);
  const [newItemName, setNewItemName] = useState('');

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const res = await axios.get('http://localhost:5000/wishlist');
      setWishlist(res.data);
    } catch(err) { console.error(err); }
  };

  const handleGapDetection = async () => {
    setIsDetecting(true);
    try {
      const res = await axios.post('http://localhost:5000/ai/gap-detection');
      const gaps = res.data;
      
      // Add each gap as an AI suggested wishlist item
      for (const gap of gaps) {
         await axios.post('http://localhost:5000/wishlist', {
            itemName: gap.itemName,
            category: gap.category,
            isAiSuggested: true
         });
      }
      fetchWishlist();
    } catch(err) {
      console.error(err);
      alert("Gap detection failed.");
    } finally {
      setIsDetecting(false);
    }
  };

  const handleAddManual = async (e) => {
    e.preventDefault();
    if (!newItemName) return;
    try {
      await axios.post('http://localhost:5000/wishlist', {
         itemName: newItemName,
         category: 'Uncategorized',
         isAiSuggested: false
      });
      setNewItemName('');
      fetchWishlist();
    } catch(err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/wishlist/${id}`);
      setWishlist(prev => prev.filter(w => w._id !== id));
    } catch (err) { console.error(err); }
  };

  return (
    <div className="flex-1 p-8 bg-beige/30 max-w-5xl mx-auto w-full">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-serif mb-2 flex items-center gap-3">Wishlist & Shopping <ShoppingBag className="text-sage" size={28} /></h1>
          <p className="text-sm text-charcoal/60">{wishlist.length} missing essentials in your list</p>
        </div>
      </div>

      <div className="bg-ivory rounded-2xl shadow-sm border border-sage/10 p-8 mb-8 text-center flex flex-col items-center">
         <div className="w-16 h-16 bg-sage/10 rounded-full flex justify-center items-center mb-4">
            <Sparkles size={28} className="text-sage" />
         </div>
         <h2 className="text-2xl font-serif mb-2">Find your Wardrobe Gaps</h2>
         <p className="text-charcoal/60 max-w-md mb-6">Let the AI analyze your current closet and suggest missing essentials you should shop for to maximize your outfit combinations.</p>
         <button 
           onClick={handleGapDetection} 
           disabled={isDetecting}
           className="px-6 py-3 bg-sage text-white rounded-lg font-medium shadow-md shadow-sage/20 hover:bg-sage/90 disabled:opacity-50 transition-colors flex items-center gap-2"
         >
           {isDetecting ? <><Sparkles size={18} className="animate-pulse" /> Evaluating Closer...</> : 'Scan for Wardrobe Gaps'}
         </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-sage/10 overflow-hidden">
        <div className="p-6 border-b border-sage/10 flex justify-between items-center">
           <h3 className="font-serif text-xl">Shopping List</h3>
           <form onSubmit={handleAddManual} className="flex gap-2 w-1/2">
             <input type="text" value={newItemName} onChange={e => setNewItemName(e.target.value)} placeholder="Add item manually..." className="flex-1 px-4 py-2 bg-beige/50 border border-sage/20 rounded-lg focus:outline-none focus:border-sage" />
             <button type="submit" className="bg-navy text-white px-4 rounded-lg hover:bg-navy/90"><Plus size={18}/></button>
           </form>
        </div>
        
        <div className="p-6">
          {wishlist.length === 0 ? (
             <p className="text-center text-charcoal/50 italic py-8">Your wishlist is empty.</p>
          ) : (
             <div className="space-y-3">
               {wishlist.map(item => (
                  <div key={item._id} className="flex justify-between items-center p-4 bg-beige/20 rounded-xl border border-sage/10 hover:border-sage/30 transition-colors group">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                          {item.isAiSuggested ? <Sparkles size={16} className="text-sage" /> : <ShoppingBag size={16} className="text-charcoal/40" />}
                       </div>
                       <div>
                         <p className="font-medium text-charcoal">{item.itemName}</p>
                         <p className="text-xs text-charcoal/50">{item.category}</p>
                       </div>
                    </div>
                    <button onClick={() => handleDelete(item._id)} className="p-2 text-rose-400 hover:bg-rose-50 rounded-full opacity-0 group-hover:opacity-100 transition-all">
                       <Trash2 size={18} />
                    </button>
                  </div>
               ))}
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
