import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Hero from './Components/Hero/Hero';
import Navbar from './Components/Navbar/Navbar';
import About from './Pages/About/About';
import Exhibitions from './Pages/Exhibitions/Exhibitions';
import Artists from './Pages/Artists/Artists';
import Artworks from './Pages/Artworks/Artworks';
import Collectibles from './Pages/Collectibles/Collectibles';
import OurMemory from './Pages/OurMemory/OurMemory';
import Contact from './Pages/Contact/Contact';
import { LanguageProvider } from './context/LanguageContext';
import Archive from './Pages/Archive/Archive';
import Footer from './Components/Footer/Footer';
import Overview from './Pages/Overview/Overview';

// Admin
import Login from './Pages/Admin/Login';
import ArtistDetails from './Pages/Artists/ArtistDetails';
import ArtworkOverview from './Pages/Artworks/ArtworkOverview';
import CollectibleDetails from './Pages/Collectibles/CollectibleDetails';
import CollectibleAdmin from './Pages/Admin/CollectibleAdmin';
import ArchiveItemDetails from './Pages/Archive/ArchiveDetails';
import { ToastContainer } from 'react-toastify';
import AdminDashboard from './Pages/Admin/AdminDashboard';
import ArtistsAdmin from './Pages/Admin/ArtistsAdmin';
import ArtworksAdmin from './Pages/Admin/ArtworksAdmin';
import ExhibitionsAdmin from './Pages/Admin/ExhibitionsAdmin';
import ArchiveAdmin from './Pages/Admin/ArchiveAdmin';
import AboutAdmin from './Pages/Admin/AboutAdmin';
import MemoryAdmin from './Pages/Admin/MemoryAdmin';
import ForgotPassword from './Pages/Admin/ForgotPassword';
import ResetPassword from './Pages/Admin/ResetPassword';
function Home() {
  return <Hero />;
}

// حماية لوحة التحكم
const ProtectedAdmin = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  if (!token) return <Navigate to="/admin/login" />;
  return children;
};

function App() {
  return (
    <LanguageProvider>
      <Navbar />
      <Routes>
        {/* Frontend Routes */}
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/exhibitions' element={<Exhibitions />} />
        <Route path='/exhibitions/overview/:id' element={<Overview />} />
        <Route path='/artists' element={<Artists />} />
        <Route path='/artists/:id' element={<ArtistDetails />} />
        <Route path='/artworks' element={<Artworks />} />
        <Route path='/artworks/:id' element={<ArtworkOverview />} /> 
        <Route path='/collectibles' element={<Collectibles />} />
        <Route path='/collectibles/:id' element={<CollectibleDetails />} />
        <Route path='/admin/collectibles' element={<CollectibleAdmin />} />
        <Route path='/ourmemory' element={<OurMemory />} />
        <Route path='/archive' element={<Archive />} />
        <Route path='/archive/:id' element={<ArchiveItemDetails />} />
        <Route path='/contact' element={<Contact />} />

        {/* Admin Routes */}
        <Route path='/admin/login' element={<Login onLogin={() => window.location.href = '/admin/dashboard'} />} />
        <Route 
          path='/admin/dashboard' 
          element={
            <ProtectedAdmin>
              <AdminDashboard />
            </ProtectedAdmin>
          } 
        />
        <Route 
          path='/admin/artists' 
          element={
            <ProtectedAdmin>
              <ArtistsAdmin />
            </ProtectedAdmin>
          } 
        />

        <Route path="/admin/artworks" 
        element={
            <ProtectedAdmin>
              <ArtworksAdmin />
            </ProtectedAdmin>
          }  />


            <Route path="/admin/exhibitions" 
        element={
            <ProtectedAdmin>
              <ExhibitionsAdmin />
            </ProtectedAdmin>
          }  />



            <Route path="/admin/archive" 
        element={
            <ProtectedAdmin>
              <ArchiveAdmin />
            </ProtectedAdmin>
          }  />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />

            <Route path="/admin/about" 
        element={
            <ProtectedAdmin>
              <AboutAdmin/>
            </ProtectedAdmin>
          }  />


            <Route path="/admin/memories" 
        element={
            <ProtectedAdmin>
              <MemoryAdmin/>
            </ProtectedAdmin>
          }  />

      </Routes>

      <Footer />
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </LanguageProvider>
  );
}

export default App;
