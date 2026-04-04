import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Eye, User, X } from 'lucide-react';
import landingBg from '../assets/landing-bg.jpeg';

export default function Home() {
  const [isLoginView, setIsLoginView] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        await signup(name, email, password);
      } else {
        await login(email, password);
      }
      navigate('/closet');
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-[#F9F7F3] overflow-hidden font-sans text-charcoal">
      
      {/* Background Image Layer (Unblurred for maximum clarity) */}
      <div className="absolute top-0 right-0 h-full w-full lg:w-[65%]">
        <img 
          src={landingBg} 
          alt="Premium Wardrobe" 
          className="w-full h-full object-cover object-right"
        />
        {/* Sleek left-to-right fade out over the image */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#F9F7F3] via-[#F9F7F3] lg:via-[#F9F7F3]/70 to-transparent"></div>
        {/* Subtle white tint over right side if needed, but keeping it transparent to preserve clarity */}
      </div>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex items-center w-full max-w-7xl mx-auto px-8 lg:px-16 pb-20 pt-10">
        
        {isLoginView ? (
          /* Sign-In View - Rendered over the view cleanly */
          <div className="w-full max-w-md bg-white/95 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/60 animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-3xl font-serif text-charcoal mb-2">{isSignUp ? 'Create Account' : 'Welcome Back'}</h1>
                <p className="text-sm text-charcoal/60">{isSignUp ? 'Start organizing your wardrobe' : 'Sign in to access your closet'}</p>
              </div>
              <button 
                onClick={() => setIsLoginView(false)} 
                className="text-charcoal/40 hover:text-charcoal transition-colors p-1"
                aria-label="Close"
              >
                <X size={20} strokeWidth={2} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {isSignUp && (
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-charcoal/80">Full Name</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full p-3 bg-[#F9F7F3] border border-sage/20 rounded-xl focus:outline-none focus:border-sage/50 focus:ring-1 focus:ring-sage/50 transition-all text-sm"
                    required={isSignUp}
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-1.5 text-charcoal/80">Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full p-3 bg-[#F9F7F3] border border-sage/20 rounded-xl focus:outline-none focus:border-sage/50 focus:ring-1 focus:ring-sage/50 transition-all text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 text-charcoal/80">Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full p-3 bg-[#F9F7F3] border border-sage/20 rounded-xl focus:outline-none focus:border-sage/50 focus:ring-1 focus:ring-sage/50 transition-all pr-10 text-sm"
                    required
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)} 
                    className="absolute right-3 top-3 text-charcoal/40 hover:text-charcoal focus:outline-none"
                  >
                    <Eye size={18} />
                  </button>
                </div>
                {isSignUp && <p className="text-[11px] text-charcoal/50 mt-1.5">Must be 8+ chars and contain at least one uppercase, lowercase, number, and special character.</p>}
              </div>
              <button 
                type="submit"
                className="w-full py-3.5 bg-sage text-white rounded-xl font-medium hover:bg-sage/90 transition-all mt-4 shadow-md shadow-sage/20"
              >
                {isSignUp ? 'Sign Up' : 'Sign In'}
              </button>
            </form>
            <div className="mt-8 text-center text-sm text-charcoal/60">
              {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
              <button onClick={() => setIsSignUp(!isSignUp)} className="text-sage hover:text-sage/80 font-medium transition-colors">
                {isSignUp ? 'Sign In' : 'Create one'}
              </button>
            </div>
          </div>
        ) : (
          /* Landing Page Text Content - Left Aligned */
          <div className="max-w-2xl text-left pt-6 pb-20">
            <div className="mb-8 inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-sm border border-sage/15 text-[13px] font-semibold text-charcoal/70">
              <span className="text-sage">✨</span> AI-Powered Fashion Assistant
            </div>
            
            <h1 className="text-5xl md:text-[5.5rem] mb-6 font-serif leading-[1.05] tracking-tight">
              Your Wardrobe,<br/>
              <span className="text-sage">Reimagined</span>
            </h1>
            
            <p className="mb-10 text-charcoal/70 text-lg md:text-[21px] leading-relaxed max-w-lg font-light">
              Organize, style, and discover your perfect look with AI-powered insights. 
              Transform your closet into a curated fashion experience.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => setIsLoginView(true)}
                className="px-7 py-3.5 bg-[#1B263B] text-white rounded-[10px] hover:bg-[#1B263B]/90 transition-all font-medium flex items-center gap-2 text-[15px]"
               >
                Start Your Closet &rarr;
              </button>
              <button 
                onClick={() => setIsLoginView(true)}
                className="px-7 py-3.5 bg-white text-charcoal rounded-[10px] hover:bg-white/90 transition-all font-medium text-[15px]"
              >
                Sign In
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
