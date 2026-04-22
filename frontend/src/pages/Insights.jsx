import { useState, useEffect } from 'react';
import { PieChart as PieChartIcon, TrendingUp, Palette, BarChart2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
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
           <h3 className="text-lg font-serif mb-6 flex items-center gap-2"><PieChartIcon size={18}/> Category Breakdown</h3>
           {Object.keys(categoryCount).length > 0 ? (
             <div className="h-[250px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Pie
                     data={Object.entries(categoryCount).map(([name, value]) => ({ name, value }))}
                     cx="50%"
                     cy="50%"
                     innerRadius={60}
                     outerRadius={80}
                     paddingAngle={5}
                     dataKey="value"
                   >
                     {Object.entries(categoryCount).map((entry, index) => {
                       const COLORS = ['#8EB29A', '#E07A5F', '#3D405B', '#F2CC8F', '#F4F1DE', '#D4A373'];
                       return <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />;
                     })}
                   </Pie>
                   <Tooltip 
                     formatter={(value, name) => [`${value} items`, name]}
                     contentStyle={{ borderRadius: '12px', border: '1px solid #e1e4e0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                   />
                 </PieChart>
               </ResponsiveContainer>
               <div className="flex flex-wrap justify-center gap-4 mt-4">
                 {Object.entries(categoryCount).map(([name, value], index) => {
                   const COLORS = ['#8EB29A', '#E07A5F', '#3D405B', '#F2CC8F', '#F4F1DE', '#D4A373'];
                   return (
                     <div key={name} className="flex items-center gap-1.5 text-xs text-charcoal/70">
                       <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                       {name} ({Math.round((value/totalItems)*100)}%)
                     </div>
                   );
                 })}
               </div>
             </div>
           ) : (
             <p className="text-sm text-charcoal/50 text-center py-10">Add items to your closet to see insights.</p>
           )}
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
