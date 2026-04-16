import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
>>>>>>> neworigin/main
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MyCloset from './pages/MyCloset';
import AIStylist from './pages/AIStylist';
import Outfits from './pages/Outfits';
import Travel from './pages/Travel';
import Insights from './pages/Insights';
import Wishlist from './pages/Wishlist';

function App() {
<<<<<<< HEAD
  const { user } = useContext(AuthContext);

  useEffect(() => {
    // Dynamically increase root font size for authenticated users to scale all text and rem units up
    if (user) {
      document.documentElement.style.setProperty('font-size', '19px', 'important');
    } else {
      document.documentElement.style.setProperty('font-size', '16px', 'important');
    }
  }, [user]);

=======

=======
import { useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MyCloset from './pages/MyCloset';
import AIStylist from './pages/AIStylist';
import Outfits from './pages/Outfits';
import Travel from './pages/Travel';
import Insights from './pages/Insights';
import Wishlist from './pages/Wishlist';

function App() {
  const { user } = useContext(AuthContext);

  useEffect(() => {
    // Dynamically increase root font size for authenticated users to scale all text and rem units up
    if (user) {
      document.documentElement.style.setProperty('font-size', '19px', 'important');
    } else {
      document.documentElement.style.setProperty('font-size', '16px', 'important');
    }
  }, [user]);
=======
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
>>>>>>> neworigin/main
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MyCloset from './pages/MyCloset';
import AIStylist from './pages/AIStylist';
import Outfits from './pages/Outfits';
import Travel from './pages/Travel';
import Insights from './pages/Insights';
import Wishlist from './pages/Wishlist';

function App() {
<<<<<<< HEAD
  const { user } = useContext(AuthContext);

  useEffect(() => {
    // Dynamically increase root font size for authenticated users to scale all text and rem units up
    if (user) {
      document.documentElement.style.setProperty('font-size', '19px', 'important');
    } else {
      document.documentElement.style.setProperty('font-size', '16px', 'important');
    }
  }, [user]);

=======
>>>>>>> neworigin/main
  return (
    <Router>
      <div className="min-h-screen flex flex-col pt-16">
        <Navbar />
        <main className="flex-grow flex flex-col">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/closet" element={<MyCloset />} />
            <Route path="/stylist" element={<AIStylist />} />
            <Route path="/outfits" element={<Outfits />} />
            <Route path="/travel" element={<Travel />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/wishlist" element={<Wishlist />} />
            {/* Future routes */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
