import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import Listings from './pages/Listings/Listings';
import PropertyDetail from './pages/PropertyDetail/PropertyDetail';
import PostProperty from './pages/PostProperty/PostProperty';
// import About from './pages/About/About';
import Destinations from './pages/Destinations/Destinations';
import Contact from './pages/Contact/Contact';
import DestinationDetail from './pages/DestinationDetail/DestinationDetail';
import IslamabadDetail from './pages/DestinationDetail/IslamabadDetail';
import SkarduDetail from './pages/DestinationDetail/SkarduDetail';
import HunzaDetail from './pages/DestinationDetail/HunzaDetail';
import PhanderDetail from './pages/DestinationDetail/PhanderDetail';
import NaranDetail from './pages/DestinationDetail/NaranDetail';
import FaisalMosqueDetail from './pages/DestinationDetail/FaisalMosqueDetail';
import DamanEKohDetail from './pages/DestinationDetail/DamanEKohDetail';
import PakistanMonumentDetail from './pages/DestinationDetail/PakistanMonumentDetail';
import MallRoadDetail from './pages/DestinationDetail/MallRoadDetail';
import BadshahiMosqueDetail from './pages/DestinationDetail/BadshahiMosqueDetail';
import LahoreFortDetail from './pages/DestinationDetail/LahoreFortDetail';
import ShalimarGardensDetail from './pages/DestinationDetail/ShalimarGardensDetail';
import QuaidEAzamMausoleumDetail from './pages/DestinationDetail/QuaidEAzamMausoleumDetail';
import CliftonBeachDetail from './pages/DestinationDetail/CliftonBeachDetail';
import MohattaPalaceDetail from './pages/DestinationDetail/MohattaPalaceDetail';
import PatriataDetail from './pages/DestinationDetail/PatriataDetail';
import PindiPointDetail from './pages/DestinationDetail/PindiPointDetail';

// Route elements moved inside <Routes> block

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
          <Route path="/post-property" element={<PostProperty />} />
          {/* <Route path="/about" element={<About />} /> */}
          <Route path="/contact" element={<Contact />} />
          <Route path="/destinations/murree" element={<DestinationDetail />} />
          <Route path="/destinations/islamabad" element={<IslamabadDetail />} />
          <Route path="/destinations/skardu" element={<SkarduDetail />} />
          <Route path="/destinations/hunza" element={<HunzaDetail />} />
          <Route path="/destinations/phander" element={<PhanderDetail />} />
          <Route path="/destinations/naran" element={<NaranDetail />} />
          <Route path="/destinations/islamabad/faisal-mosque" element={<FaisalMosqueDetail />} />
          <Route path="/destinations/islamabad/daman-e-koh" element={<DamanEKohDetail />} />
          <Route path="/destinations/islamabad/pakistan-monument" element={<PakistanMonumentDetail />} />
          <Route path="/destinations/islamabad/mall-road" element={<MallRoadDetail />} />
          <Route path="/destinations/islamabad/badshahi-mosque" element={<BadshahiMosqueDetail />} />
          <Route path="/destinations/islamabad/lahore-fort" element={<LahoreFortDetail />} />
          <Route path="/destinations/islamabad/shalimar-gardens" element={<ShalimarGardensDetail />} />
          <Route path="/destinations/islamabad/quaid-e-azam-mausoleum" element={<QuaidEAzamMausoleumDetail />} />
          <Route path="/destinations/islamabad/clifton-beach" element={<CliftonBeachDetail />} />
          <Route path="/destinations/islamabad/mohatta-palace" element={<MohattaPalaceDetail />} />
          <Route path="/destinations/lahore/badshahi-mosque" element={<BadshahiMosqueDetail />} />
          <Route path="/destinations/lahore/lahore-fort" element={<LahoreFortDetail />} />
          <Route path="/destinations/lahore/shalimar-gardens" element={<ShalimarGardensDetail />} />
          <Route path="/destinations/karachi/quaid-e-azam-mausoleum" element={<QuaidEAzamMausoleumDetail />} />
          <Route path="/destinations/karachi/clifton-beach" element={<CliftonBeachDetail />} />
          <Route path="/destinations/karachi/mohatta-palace" element={<MohattaPalaceDetail />} />
          <Route path="/destinations/islamabad/patriata" element={<PatriataDetail />} />
          <Route path="/destinations/islamabad/pindi-point" element={<PindiPointDetail />} />
          <Route path="/destinations/murree/patriata-new-murree" element={<PatriataDetail />} />
          <Route path="/destinations/murree/pindi-point" element={<PindiPointDetail />} />
          <Route path="/destinations/murree/mall-road" element={<MallRoadDetail />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
