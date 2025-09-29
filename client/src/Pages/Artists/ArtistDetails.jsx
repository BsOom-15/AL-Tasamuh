// src/Pages/Artists/ArtistDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import Modal from "../../Components/Modal/Modal"; // ✅ تأكدي المسار صحيح
import Loader from "../../Components/Modal/Loaders";

const ArtistDetails = () => {

  const API_URL = import.meta.env.VITE_API_URL;
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/artists/${id}`);

        setArtist(res.data);
      } catch (err) {
        console.error("fetch artist:", err);
      }
    };
    fetchArtist();
  }, [id]);

  if (!artist) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'70vh'}}>
      <Loader />
    </div>
  );

  const openArtworkModal = (art, idx) => {
    // ✅ أضمن إنو artwork فيه بيانات الفنان
    setSelectedArtwork({ ...art, artist: artist });
    setCurrentIndex(idx);
    setOpenModal(true);
  };

  const closeModal = () => {
    setOpenModal(false);
    setSelectedArtwork(null);
  };

  const prev = () => {
    if (!artist?.artworks?.length) return;
    const newIndex = currentIndex > 0 ? currentIndex - 1 : artist.artworks.length - 1;
    setCurrentIndex(newIndex);
    setSelectedArtwork({ ...artist.artworks[newIndex], artist });
  };

  const next = () => {
    if (!artist?.artworks?.length) return;
    const newIndex = currentIndex < artist.artworks.length - 1 ? currentIndex + 1 : 0;
    setCurrentIndex(newIndex);
    setSelectedArtwork({ ...artist.artworks[newIndex], artist });
  };

  return (
    <Wrapper>
      <h1>{artist.name}</h1>


      <h2>Artworks</h2>
      <div className="artworks-grid">
        {artist.artworks?.map((art, idx) => (
          <div key={art._id} className="artwork-card" onClick={() => openArtworkModal(art, idx)}>
            <img src={art.image || "/default-artwork.jpg"} alt={art.title} className="artwork-image" />
            <p className="artwork-title">{art.title || "Untitled"}</p>
          </div>
        ))}
      </div>

      {openModal && selectedArtwork && (
        <Modal
          artwork={selectedArtwork}
          artworks={artist.artworks}
          onClose={closeModal}
          onNext={next}
          onPrev={prev}
          currentIndex={currentIndex}
        />
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding: 60px 80px;

  h1 { text-align:center; font-size:34px; margin-bottom:20px; }

  .artist-info-table {
    max-width: 900px;
    margin: 0 auto 30px auto;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    background: #fafafa;
    padding: 18px;
    border-radius: 8px;
    box-shadow: 0 6px 18px rgba(0,0,0,0.05);
    font-size: 15px;
  }

  .artist-info-table .bio { grid-column: 1 / -1; color:#444; }

  h2 { margin-top:40px; margin-bottom:16px; text-align:left; color:#333; }

  .artworks-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }

  .artwork-card { text-align:center; cursor:pointer; }
  .artwork-image {
    width:100%;
    height:220px;
    object-fit:cover;
    border-radius:10px;
    box-shadow: 0 6px 18px rgba(0,0,0,0.08);
    transition: transform .25s ease;
  }
  .artwork-card:hover .artwork-image { transform: scale(1.03); }
  .artwork-title { margin-top:8px; color:#444; font-weight:500; }

  @media (max-width:1000px) {
    .artworks-grid { grid-template-columns: repeat(2, 1fr); }
    .artist-info-table { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width:600px) {
    .artworks-grid { grid-template-columns: repeat(1, 1fr); }
    .artist-info-table { grid-template-columns: 1fr; }
  }
`;

export default ArtistDetails;
