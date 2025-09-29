import { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import Modal from "../../Components/Modal/Modal";

const Artworks = () => {

  const API_URL = import.meta.env.VITE_API_URL;
  const [artworks, setArtworks] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const url =
  filter === "all"
    ? `${API_URL}/api/artworks?page=${page}&limit=12`
    : `${API_URL}/api/artworks?page=${page}&limit=12&status=${filter}`;

const res = await axios.get(url);
setArtworks(res.data.data || []);
setPages(res.data.pages || 1);

      } catch (err) {
        console.error("Error fetching artworks:", err);
      }
    };
    fetchArtworks();
  }, [page, filter]);

  const handleOpenModal = (art, index) => {
    setSelectedArtwork(art);
    setCurrentIndex(index);
  };

  const handleCloseModal = () => setSelectedArtwork(null);

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % artworks.length;
    setCurrentIndex(nextIndex);
    setSelectedArtwork(artworks[nextIndex]);
  };

  const handlePrev = () => {
    const prevIndex = (currentIndex - 1 + artworks.length) % artworks.length;
    setCurrentIndex(prevIndex);
    setSelectedArtwork(artworks[prevIndex]);
  };

  return (
    <Wrapper>
      <h1>Artworks</h1>

      <div className="filter-container">
        <label>Filter by Status:</label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="active">Available</option>
          <option value="sold">Sold</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="artworks-grid">
        {artworks.map((art, index) => (
          <div key={art._id} className="artwork-card">
            <div className="image-wrapper">
              <img
  src={
    art.image
      ? art.image.startsWith("http")
        ? art.image
        : `${API_URL}${art.image.replace(/^\/+/, "")}`
      : "/default-artwork.jpg"
  }
  alt={art.title}
  className="artwork-image"
  onClick={() => handleOpenModal(art, index)}
/>

            </div>
            <p className="artwork-title">{art.title || "Untitled"}</p>
            <p className="artist-name">
              {art.artist?.name || "Unknown Artist"} —{" "}
              <span className={`status ${art.status || "unknown"}`}>
                {art.status || "unknown"}
              </span>
            </p>
          </div>
        ))}
      </div>

      <div className="pagination">
        <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}>
          Prev
        </button>
        <span>
          Page {page} of {pages}
        </span>
        <button onClick={() => setPage((p) => Math.min(p + 1, pages))} disabled={page === pages}>
          Next
        </button>
      </div>

      {selectedArtwork && (
        <Modal
          artwork={selectedArtwork}
          artworks={artworks}
          currentIndex={currentIndex}
          onClose={handleCloseModal}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding: 60px 80px;
  h1 {
    text-align: center;
    font-size: 34px;
    margin-bottom: 20px;
    color: #222;
  }

  .filter-container {
    text-align: center;
    margin-bottom: 25px;
  }
  select {
    margin-left: 10px;
    padding: 6px 12px;
    border-radius: 6px;
    border: 1px solid #aaa;
    cursor: pointer;
  }

  .artworks-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    justify-items: center; /* 🔥 يخلي الكروت في النص */
  }

  .artwork-card {
    background: #fff;
    border: 1px solid #eee;
    border-radius: 12px;
    padding: 10px;
    text-align: center;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  .artwork-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }

  .image-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 220px;
    width: 100%;
    overflow: hidden;
  }

  .artwork-image {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    border-radius: 8px;
    cursor: pointer;
  }

  .artwork-title {
    margin-top: 10px;
    font-weight: 600;
    color: #333;
    font-size: 16px;
  }
  .artist-name {
    font-size: 14px;
    color: #666;
    margin-top: 4px;
    display: flex;
    justify-content: center;
    gap: 5px;
  }

  .status.active {
    color: green;
    font-weight: 600;
  }
  .status.inactive {
    color: gray;
    font-weight: 600;
  }
  .status.sold {
    color: red;
    font-weight: 600;
  }
  .status.unknown {
    color: orange;
    font-weight: 600;
  }

  .pagination {
    text-align: center;
    margin-top: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 15px;
  }

  .pagination button {
    padding: 8px 16px;
    border: none;
    border-radius: 6px;
    background: #333;
    color: #fff;
    cursor: pointer;
    transition: 0.2s;
  }

  .pagination button:disabled {
    background: #aaa;
    cursor: not-allowed;
  }

  @media (max-width: 1000px) {
    .artworks-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  @media (max-width: 600px) {
    .artworks-grid {
      grid-template-columns: 1fr;
      padding: 0 20px;
    }
  }
`;

export default Artworks;
