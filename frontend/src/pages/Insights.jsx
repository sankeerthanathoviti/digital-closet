import { useState, useEffect } from 'react';
import { PieChart, TrendingUp, Palette, BarChart2 } from 'lucide-react';
import axios from 'axios';

export default function Insights() {
  const [wardrobe, setWardrobe] = useState([]);

  useEffect(() => {
    fetchWardrobe();
  }, []);

  const fetchWardrobe = async () => {
    try {
      const res = await axios.get('http://localhost:5000/wardrobe');
      setWardrobe(res.data);
    } catch(err) { console.error(err); }
  };

  const totalItems = wardrobe.length;
  
  // Compute basic stats
  const categoryCount = wardrobe.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {});
  
  const colorCount = wardrobe.reduce((acc, item) => {
    acc[item.color] = (acc[item.color] || 0) + 1;
    return acc;
  }, {});

  const topColors = Object.entries(colorCount).sort((a, b) => b[1] - a[1]).slice(0, 3);
  
  const neverWorn = wardrobe.filter(w => !w.usageCount || w.usageCount === 0);

  return (
    <div className="flex-1 p-8 bg-beige/30 max-w-6xl mx-auto w-full">
      <div className="mb-10">
        <h1 className="text-4xl font-serif mb-2">Wardrobe Insights</h1>
        <p className="text-lg text-charcoal/60">Understand your style patterns and wear habits.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-sage/10 flex flex-col justify-between">
           <h3 className="text-sm font-serif text-charcoal/60 mb-4">Total Items</h3>
           <p className="text-4xl font-serif">{totalItems}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-sage/10 flex flex-col justify-between">
           <h3 className="text-sm font-serif text-charcoal/60 mb-4">Never Worn</h3>
           <p className="text-4xl font-serif">{neverWorn.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-sage/10">
           <h3 className="text-lg font-serif mb-6 flex items-center gap-2"><PieChart size={18}/> Category Breakdown</h3>
           {Object.entries(categoryCount).map(([cat, count]) => (
             <div key={cat} className="mb-4">
               <div className="flex justify-between text-sm mb-1">
                 <span className="font-medium text-charcoal/80">{cat}</span>
                 <span className="text-charcoal/50">{Math.round((count/totalItems)*100)}%</span>
               </div>
               <div className="w-full h-2 bg-beige rounded-full overflow-hidden">
                  <div className="h-full bg-sage" style={{ width: `${(count/totalItems)*100}%` }}></div>
               </div>
             </div>
           ))}
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-sage/10">
           <h3 className="text-lg font-serif mb-6 flex items-center gap-2"><Palette size={18}/> Top Colors</h3>
           <div className="space-y-4">
             {topColors.map(([color, count]) => (
               <div key={color} className="flex justify-between items-center pb-2 border-b border-sage/10">
                 <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full border border-sage/20 bg-ivory shadow-sm flex items-center justify-center text-[10px] text-charcoal/40">🎨</div>
                    <span className="font-medium">{color}</span>
                 </div>
                 <span className="text-sm text-charcoal/60">{count} items</span>
               </div>
             ))}
           </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-sage/10">
         <h3 className="text-lg font-serif mb-4 flex items-center gap-2"><TrendingUp size={18}/> Never Worn Items</h3>
         {neverWorn.length > 0 ? (
           <div className="flex gap-4 overflow-x-auto pb-2 stylish-scrollbar">
             {neverWorn.map(item => (
                <div key={item._id} className="min-w-[120px] bg-ivory rounded-xl border border-sage/10 overflow-hidden">
                  <img src={item.imageBase64} className="w-full aspect-square object-cover" />
                  <div className="p-2 text-center text-xs truncate font-medium text-charcoal">{item.color} {item.category}</div>
                </div>
             ))}
           </div>
         ) : (
           <p className="text-sm text-charcoal/50 italic">You wear everything you own! Great job.</p>
         )}
      </div>

    </div>
  );
}
