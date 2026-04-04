import { useState, useContext, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

function Navbar() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-ivory/90 backdrop-blur-md z-50 border-b border-sage/10 shadow-sm flex items-center justify-between px-4 md:px-8">
      <Link to="/" className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-sage text-ivory flex items-center justify-center font-serif text-lg">
          D
        </div>
        <span className="font-serif text-xl font-medium tracking-wide">Digital Closet</span>
      </Link>

      <div className="hidden md:flex items-center gap-6 text-sm font-medium text-charcoal/80">
        <Link to="/closet" className="hover:text-sage transition-colors">My Closet</Link>
        <Link to="/outfits" className="hover:text-sage transition-colors">Outfits</Link>
        <Link to="/stylist" className="hover:text-sage transition-colors">AI Stylist</Link>
        <Link to="/insights" className="hover:text-sage transition-colors">Insights</Link>
        <Link to="/wishlist" className="hover:text-sage transition-colors">Wishlist</Link>
        <Link to="/travel" className="hover:text-sage transition-colors">Travel</Link>
        {user && (
          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)} 
              className="p-2 hover:bg-sage/10 rounded-full transition-colors ml-4 focus:outline-none"
            >
              <User size={20} />
            </button>
            
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-sage/10 shadow-lg rounded-xl overflow-hidden py-2 z-50">
                <div className="px-4 py-3 border-b border-sage/10 mb-1">
                  <p className="font-serif text-sm text-charcoal font-medium truncate">{user.name || user.email?.split('@')[0] || "Fashionista"}</p>
                </div>
                <button 
                  onClick={() => { 
                    setShowProfileMenu(false); 
                    logout(); 
                    navigate('/');
                  }} 
                  className="w-full text-left px-4 py-2.5 text-sm text-rose-500 hover:bg-rose-50 flex items-center gap-2 transition-colors"
                >
                  <LogOut size={16} /> Sign out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
