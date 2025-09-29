// client/src/Pages/Collectibles/Collectibles.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Modal from "../../Components/Modal/Modal";
import { VITE_VITE_API_URL } from "../../../config";

const Collectibles = () => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [selectedCollectible, setSelectedCollectible] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const nav = useNavigate();

 useEffect(() => {
  axios
    .get(`${VITE_VITE_API_URL}/api/collectibles?page=${page}&limit=12`)
    .then(res => {
      setItems(Array.isArray(res.data) ? res.data : res.data.data || []);
    })
    .catch(err => console.error(err));
}, [page]);


  return (
    <Wrapper>
      <h1>Altsamuh Collectibles</h1>
      <div className="collectibles-grid">
        {items.length === 0 ? (
          <div style={{textAlign:'center',width:'100%',color:'#888',fontSize:'18px',marginTop:'40px'}}>No collectibles found.</div>
        ) : (
          items.map((it, idx) => (
            <div
              key={it._id}
              className="collectible-card"
              onClick={() => { setSelectedCollectible(it); setCurrentIndex(idx); }}
            >
              <div className="image-wrapper">
                <img
  src={
    it.image
      ? it.image.startsWith("http")
        ? it.image
        : `${VITE_VITE_API_URL}${it.image.replace(/^\/+/, "")}`
      : "/default-collectible.jpg"
  }
  alt={it.title}
  className="collectible-image"
/>

              </div>
              <p className="collectible-title">{it.title || "Untitled"}</p>
              <p className="collectible-price">
                {it.price ? `${it.currency || "USD"} ${it.price}` : "Price on request"}
              </p>
            </div>
          ))
        )}
      </div>
      <div className="pagination">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
        >
          Prev
        </button>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, pages))}
          disabled={page === pages}
        >
          Next
        </button>
      </div>
      {selectedCollectible && (
        <Modal
          artwork={selectedCollectible}
          artworks={items}
          currentIndex={currentIndex}
          onClose={() => setSelectedCollectible(null)}
          onNext={() => {
            const nextIdx = (currentIndex + 1) % items.length;
            setCurrentIndex(nextIdx);
            setSelectedCollectible(items[nextIdx]);
          }}
          onPrev={() => {
            const prevIdx = (currentIndex - 1 + items.length) % items.length;
            setCurrentIndex(prevIdx);
            setSelectedCollectible(items[prevIdx]);
          }}
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
    cursor: pointer;
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
  }
  .collectible-title {
    margin-top: 10px;
    font-weight: 600;
    color: #333;
    font-size: 16px;
  }
  .collectible-price {
    font-size: 14px;
    color: #e53935;
    margin-top: 4px;
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
    background: #00ffff;
    color: #000;
    font-weight: 600;
    cursor: pointer;
    transition: 0.2s;
  }
  .pagination button:disabled {
    background: #444;
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
