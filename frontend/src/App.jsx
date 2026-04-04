import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MyCloset from './pages/MyCloset';
import AIStylist from './pages/AIStylist';
import Outfits from './pages/Outfits';
import Travel from './pages/Travel';
import Insights from './pages/Insights';
import Wishlist from './pages/Wishlist';

function App() {
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
