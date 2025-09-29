import { useEffect, useState } from 'react';
import axios from 'axios';
import './ArtistSection.css';
import { Link } from 'react-router-dom';
import Modal from '../../Components/Modal/Modal'; // استدعاء المودال نفسه
import { VITE_API_URL } from '../../../config';

const ArtistSection = () => {
  const [artist, setArtist] = useState(null);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);

  useEffect(() => {
    axios.get(`${VITE_API_URL}/api/artists`)
      .then(res => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          setArtist(res.data[0]);
        }
      })
      .catch(err => console.log(err));
  }, []);

  const getImageUrl = (imgPath) => {
    if (!imgPath) return "";
    return imgPath.startsWith("http") ? imgPath : `${VITE_API_URL}${imgPath}`;
  };

  const handleOpenModal = async (artwork, index) => {
    try {
      const res = await axios.get(`${VITE_API_URL}/api/artworks/${artwork._id}`);
      const fullArtwork = res.data; // populated artwork
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
    if (!artist?.artworks?.length) return;
    setCurrentIndex(prevIndex => {
      const newIndex = prevIndex > 0 ? prevIndex - 1 : artist.artworks.length - 1;
      handleOpenModal(artist.artworks[newIndex], newIndex);
      return newIndex;
    });
  };

  const handleNext = () => {
    if (!artist?.artworks?.length) return;
    setCurrentIndex(prevIndex => {
      const newIndex = prevIndex < artist.artworks.length - 1 ? prevIndex + 1 : 0;
      handleOpenModal(artist.artworks[newIndex], newIndex);
      return newIndex;
    });
  };

  if (!artist) return null;

  const birthYear = artist.birthDate ? new Date(artist.birthDate).getFullYear() : '';
  const deathYear = artist.deathDate ? new Date(artist.deathDate).getFullYear() : null;

  return (
    <div className='artist-container'>
      <div className="artist-items" key={artist._id}>
        <h1>
          {artist.name} 
          <span>
            {deathYear ? `(${birthYear} - ${deathYear})` : `(${birthYear})`}
          </span>
        </h1>
        <p>{artist.bio}</p>
        <div className="slider-container">
          <div className="slider-list">
            {artist.artworks?.map((artwork, artworkIndex) => (
              <div 
                className="item" 
                key={artwork._id} 
                style={{ '--position': artworkIndex + 1 }}
                onClick={() => handleOpenModal(artwork, artworkIndex)}
              >
                {(() => {
                  const imgValue = Array.isArray(artwork.image) ? artwork.image[0] : artwork.image;
                  const imgUrl = getImageUrl(imgValue);
                  console.log('artwork.image:', imgValue);
                  console.log('imgUrl:', imgUrl);
                  return null;
                })()}
                <img 
                  src={getImageUrl(Array.isArray(artwork.image) ? artwork.image[0] : artwork.image)} 
                  alt={artwork.title} 
                />
                <div className="title">
                  <h3>{artist.name},</h3>
                  <p>{artwork.title}, <span>{artwork.year}</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {openModal && selectedArtwork && (
        <Modal
          artwork={selectedArtwork}
          artworks={artist.artworks}
          onClose={handleCloseModal}
          onNext={handleNext}
          onPrev={handlePrev}
          currentIndex={currentIndex}
        />
      )}
    </div>
  );
};

export default ArtistSection;
