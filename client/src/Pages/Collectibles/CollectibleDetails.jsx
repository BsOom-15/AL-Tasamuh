import { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import Modal from "../../Components/Modal/Modal";

const Collectibles = () => {


  const API_URL = import.meta.env.VITE_API_URL;
  const [collectibles, setCollectibles] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [selectedCollectible, setSelectedCollectible] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const getImageUrl = (img) => {
  if (!img) return "/default-collectible.jpg"; // أو `${API_URL}/uploads/default-collectible.jpg`
  return img.startsWith("http") ? img : `${API_URL}/${img}`;
};


  useEffect(() => {
    const fetchCollectibles = async () => {
      try {
        const url = `${API_URL}/api/collectibles?page=${page}&limit=12`;
        const res = await axios.get(url);
        setCollectibles(res.data || []);
        // إذا أضفت pagination في الباك أضف هنا setPages(res.data.pages || 1);
      } catch (err) {
        console.error("Error fetching collectibles:", err);
      }
    };
    fetchCollectibles();
  }, [page]);

  const handleOpenModal = (item, index) => {
    setSelectedCollectible(item);
    setCurrentIndex(index);
  };

  const handleCloseModal = () => setSelectedCollectible(null);

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % collectibles.length;
    setCurrentIndex(nextIndex);
    setSelectedCollectible(collectibles[nextIndex]);
  };

  const handlePrev = () => {
    const prevIndex = (currentIndex - 1 + collectibles.length) % collectibles.length;
    setCurrentIndex(prevIndex);
    setSelectedCollectible(collectibles[prevIndex]);
  };

  return (
    <Wrapper>
      <h1>Collectibles</h1>
      <div className="collectibles-grid">
        {collectibles.map((item, index) => (
          <div key={item._id} className="collectible-card">
            <div className="image-wrapper">
              <img
  src={getImageUrl(item.image)}
  alt={item.title}
  className="collectible-image"
  onClick={() => handleOpenModal(item, index)}
/>

            </div>
            <p className="collectible-title">{item.title || "Untitled"}</p>
            <p className="collectible-price">{item.price ? `${item.currency || 'USD'} ${item.price}` : 'Price on request'}</p>
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
      {selectedCollectible && (
        <Modal
          artwork={selectedCollectible}
          artworks={collectibles}
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
  .collectibles-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    justify-items: center;
  }
  .collectible-card {
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
  .collectible-card:hover {
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
  .collectible-image {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    border-radius: 8px;
    cursor: pointer;
  }
  .collectible-title {
    margin-top: 10px;
    font-weight: 600;
    color: #333;
    font-size: 16px;
  }
  .collectible-price {
    font-size: 14px;
    color: #666;
    margin-top: 4px;
    display: flex;
    justify-content: center;
    gap: 5px;
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
    .collectibles-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  @media (max-width: 600px) {
    .collectibles-grid {
      grid-template-columns: 1fr;
      padding: 0 20px;
    }
  }
`;

export default Collectibles;
