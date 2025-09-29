import React, { useEffect, useState } from 'react';
import './Artwork.css';
import CircleIcon from '@mui/icons-material/Circle';
import Modal from '../../Components/Modal/Modal';
import axios from 'axios';
import { VITE_API_URL } from '../../../config';

const Artwork = () => {
  const [artworks, setArtworks] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);

  // 🔑 helper: يبني الرابط الصحيح للصورة
  const getImageUrl = (imgPath) => {
    if (!imgPath) return "/default-artwork.jpg";
    return imgPath.startsWith("http")
      ? imgPath
      : `${VITE_API_URL}/${imgPath.startsWith("uploads/") ? imgPath : "uploads/" + imgPath}`;
  };

  // Shuffle function (للعرض العشوائي)
  const shuffleArray = (array) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  // Fetch artworks from backend
  useEffect(() => {
    axios.get(`${VITE_API_URL}/api/artworks`)
      .then(res => {
        if (res.data && res.data.data) {
          let items = res.data.data;
          // نعمل shuffle لو في عناصر كتيرة
          if (items.length > 8) {
            items = shuffleArray(items).slice(0, 8);
          }
          setArtworks(items);
        } else {
          console.log('Unexpected response:', res.data);
        }
      })
      .catch(err => console.log('Error fetching artworks:', err));
  }, []);

  const handleOpenModal = async (artwork) => {
    try {
      const res = await axios.get(`${VITE_API_URL}/api/artworks/${artwork._id}`);
      const fullArtwork = res.data; 
      const index = artworks.findIndex(a => a._id === artwork._id);

      if (Array.isArray(fullArtwork.image)) {
        fullArtwork.image = fullArtwork.image.map(img => getImageUrl(img));
      } else {
        fullArtwork.image = getImageUrl(fullArtwork.image);
      }

      setSelectedArtwork(fullArtwork);
      setCurrentIndex(index);
      setOpenModal(true);
    } catch (err) {
      console.log('Error fetching artwork details:', err);
    }
  };

  const handleCloseModal = () => {
    setSelectedArtwork(null);
    setOpenModal(false);
  };

  const handlePrev = () => {
    setCurrentIndex(prevIndex =>
      prevIndex > 0 ? prevIndex - 1 : artworks.length - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex(prevIndex =>
      prevIndex < artworks.length - 1 ? prevIndex + 1 : 0
    );
  };

  // منع التمرير عند فتح المودال
  useEffect(() => {
    document.body.style.overflow = openModal ? "hidden" : "";
  }, [openModal]);

  return (
    <div className='artwork-container'>
      {artworks.map((artwork) => (
        <div className="artwork-border" key={artwork._id}>
          <div className="artwork-content" onClick={() => handleOpenModal(artwork)}>
            <div className="artwork-img">
              <img
                src={getImageUrl(artwork.image)}
                alt={artwork.title || "Artwork"}
                onError={(e) => { e.currentTarget.src = "/default-artwork.jpg"; }}
              />
            </div>
            <div className="artwork-details">
              <div className="artist-name">
                <h2>{artwork.artist?.name || "Unknown Artist"}</h2>
                <span>
                  {artwork.status === "active" ? (
                    <CircleIcon style={{ color: "#4E9C1F", fontSize: "10px" }} />
                  ) : artwork.status === "sold" ? (
                    <CircleIcon style={{ color: "#CC0000", fontSize: "10px" }} />
                  ) : (
                    <CircleIcon style={{ color: "#999999", fontSize: "10px" }} />
                  )}
                </span>
              </div>
              <div className="artwork-name">
                <p>{artwork.year || ""}, <span>{artwork.title || ""}</span></p>
              </div>
              <p>{artwork.medium || ""}</p>
              <p>{artwork.dimensions || ""}</p>
              <p>signed & dated</p>
            </div>
          </div>
        </div>
      ))}

      {openModal && selectedArtwork && (
        <Modal
          artwork={selectedArtwork}
          artworks={artworks}
          onClose={handleCloseModal}
          onNext={handleNext}
          onPrev={handlePrev}
          currentIndex={currentIndex}
        />
      )}
    </div>
  );
};

export default Artwork;
