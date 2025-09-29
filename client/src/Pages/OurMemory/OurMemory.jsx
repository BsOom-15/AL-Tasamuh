// src/Pages/OurMemory/OurMemory.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import Modal from "../../Components/Modal/Modal";
import { VITE_API_URL } from "../../../config";

const OurMemory = () => {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("all");
  const [selectedIndex, setSelectedIndex] = useState(null);

useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await axios.get(`${VITE_API_URL}/api/memory-items`);
      setItems(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };
  fetchData();
}, []);


  const filtered =
    filter === "all" ? items : items.filter((i) => i.type === filter);

  const openModal = (index) => {
    // معالجة الصورة قبل فتح المودال
    const item = filtered[index];
    const processed = { ...item, image: getImageUrl(item.image) };
    // استبدال العنصر في filtered بنسخة معالجة فقط للمودال
    filtered[index] = processed;
    setSelectedIndex(index);
  };
  const closeModal = () => setSelectedIndex(null);
  const nextItem = () =>
    setSelectedIndex((prev) => (prev + 1) % filtered.length);
  const prevItem = () =>
    setSelectedIndex((prev) => (prev - 1 + filtered.length) % filtered.length);

  // ✅ Helper function to handle image URLs
 const getImageUrl = (img) => {
  if (!img) return `${VITE_API_URL}/uploads/default-artwork.jpg`;

  const cleanPath = img.startsWith("uploads/") ? img : `uploads/${img}`;

  return img.startsWith("http")
    ? img
    : `${VITE_API_URL}${cleanPath.replace(/^\/+/, "")}`;
};


  return (
    <Wrapper>
      <h1>Our Memory</h1>

      {/* ✅ Filters */}
      <Filters>
        {["all", "artist", "exhibition", "artwork", "card"].map((cat) => (
          <button
            key={cat}
            className={filter === cat ? "active" : ""}
            onClick={() => setFilter(cat)}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </Filters>

      {/* ✅ Grid */}
      <Grid>
        {filtered.map((item, idx) => (
          <Card key={item._id} onClick={() => openModal(idx)}>
            <div className="image">
              <img src={getImageUrl(item.image)} alt={item.title} />
            </div>
            <div className="info">
              <h3>{item.title}</h3>
              <p>{item.year || "Unknown year"}</p>
              {item.artist && (
                <small>By {item.artist.name || item.artist}</small>
              )}
              <p className="status">
                {item.status ? "Available" : "Sold"}
              </p>
            </div>
          </Card>
        ))}
      </Grid>

      {/* ✅ Modal */}
      {selectedIndex !== null && (
        <Modal
          artwork={filtered[selectedIndex]}
          artworks={filtered}
          currentIndex={selectedIndex}
          onClose={closeModal}
          onNext={nextItem}
          onPrev={prevItem}
        />
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding: 60px 20px;
  h1 {
    text-align: center;
    margin-bottom: 30px;
    font-size: 36px;
  }
`;

const Filters = styled.div`
  text-align: center;
  margin-bottom: 30px;

  button {
    margin: 0 10px;
    padding: 8px 16px;
    border: none;
    border-radius: 20px;
    background: #eee;
    cursor: pointer;
    font-weight: bold;
    transition: 0.3s;
  }
  .active {
    background: #333;
    color: #fff;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: 0.3s;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
  }

  .image {
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .info {
    padding: 15px;
    h3 {
      margin: 0 0 8px;
      font-size: 18px;
    }
    p {
      margin: 0;
      color: #666;
      font-size: 14px;
    }
    .status {
      margin-top: 8px;
      font-weight: bold;
      color: #333;
    }
    small {
      display: block;
      margin-top: 5px;
      color: #999;
    }
  }
`;

export default OurMemory;
