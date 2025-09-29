import React, { useEffect, useState } from "react";
import CircleIcon from "@mui/icons-material/Circle";
import Modal from "../../Components/Modal/Modal";
import axios from "axios";
import "./FilterCategory.css";

const FilterCategory = ({ category }) => {
  const [artworks, setArtworks] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  const getImageUrl = (img) => {
    if (!img) return `${API_URL}/uploads/default-artwork.jpg`;
    return img.startsWith("http")
      ? img
      : `${API_URL}/${img.startsWith("uploads/") ? img : `uploads/${img}`}`;
  };

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/memory-items`, {
          params: { type: "artwork", ...(category && { category }) },
        });
        // نتأكد من وجود data
        setArtworks(res.data.data || []);
      } catch (err) {
        console.error("Error fetching artworks:", err);
      }
    };
    fetchArtworks();
  }, [category]);

  const openModalHandler = (index) => {
    setSelectedArtwork({ ...artworks[index], image: getImageUrl(artworks[index].image) });
    setCurrentIndex(index);
    setOpenModal(true);
  };

  const closeModalHandler = () => setOpenModal(false);

  const nextArtwork = () => {
    const nextIndex = (currentIndex + 1) % artworks.length;
    openModalHandler(nextIndex);
  };

  const prevArtwork = () => {
    const prevIndex = (currentIndex - 1 + artworks.length) % artworks.length;
    openModalHandler(prevIndex);
  };

  return (
    <div className="artwork-container art">
      {artworks.map((art, idx) => (
        <div className="artwork-border" key={art._id} onClick={() => openModalHandler(idx)}>
          <div className="artwork-content">
            <div className="artwork-img">
              <img src={getImageUrl(art.image)} alt={art.title || "Artwork"} />
            </div>
            <div className="artwork-details">
              <h2>{art.artist?.name || "Unknown Artist"}</h2>
              <p>{art.year || ""}, {art.title || ""}</p>
              <p>{art.medium || ""}</p>
              <p>{art.dimensions || ""}</p>
              <p>{art.status ? "Available" : "Sold"}</p>
            </div>
          </div>
        </div>
      ))}

      {openModal && selectedArtwork && (
        <Modal
          artwork={selectedArtwork}
          artworks={artworks}
          currentIndex={currentIndex}
          onClose={closeModalHandler}
          onNext={nextArtwork}
          onPrev={prevArtwork}
        />
      )}
    </div>
  );
};

export default FilterCategory;
