// src/Pages/Artists/Artists.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { VITE_VITE_API_URL } from "../../../config";

const Artists = () => {
  const [artists, setArtists] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArtists = async () => {
  try {
    const res = await axios.get(`${VITE_VITE_API_URL}/api/artists`);
    setArtists(res.data);
  } catch (err) {
    console.error("fetch artists error:", err);
  }
};

    fetchArtists();
  }, []);

  const short = (text, n = 18) => {
    if (!text) return "";
    const words = text.split(" ");
    return words.length <= n ? text : words.slice(0, n).join(" ") + "...";
  };

  return (
    <Wrapper>
      <h1 className="page-title">Artists</h1>
      <div className="artists-grid">
        {artists.map((artist) => (
          <div
            key={artist._id}
            className="book"
            role="button"
            onClick={() => navigate(`/artists/${artist._id}`)}
            onKeyDown={() => navigate(`/artists/${artist._id}`)}
            tabIndex={0}
          >
            {/* المحتوى اللي يبان بعد ما الـ cover يتحرّك */}
            <div className="book-content">
              <h3 className="artist-name">{artist.name}</h3>
              <p className="artist-meta">
                {artist.birthDate ? new Date(artist.birthDate).getFullYear() : ""}{" "}
                {artist.nationality ? `· ${artist.nationality}` : ""}
              </p>
              <p className="artist-bio">{short(artist.bio, 15)}</p>
              {artist.featured && <span className="featured-badge">Featured</span>}
            </div>

            {/* الغلاف العلوي (يستدير عند hover) */}
            <div
              className="cover"
              style={{
                 backgroundImage: `url(${
      artist.artworks && artist.artworks[0]?.image
        ? artist.artworks[0].image.startsWith('http')
          ? artist.artworks[0].image
          : `${VITE_VITE_API_URL}${artist.artworks[0].image.replace(/^\/+/, '')}`
        : "/default-artist.jpg"
    })`,
              }}
            />
          </div>
        ))}
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding: 60px 80px;

  .page-title {
    text-align: center;
    margin-bottom: 40px;
    font-size: 36px;
    font-weight: 600;
    color: #222;
  }

  .artists-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 40px;
    justify-items: center;
  }

  .book {
    position: relative;
    border-radius: 10px;
    width: 260px;
    height: 340px;
    background-color: whitesmoke;
    box-shadow: 0 6px 18px rgba(0,0,0,0.12);
    perspective: 1800px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 18px;
    cursor: pointer;
    overflow: hidden;
  }

  .book-content {
    position: absolute;
    z-index: 1; /* تحت الغلاف */
    width: 100%;
    height: 100%;
    padding: 24px 18px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-start;
    color: #111;
  }

  .artist-name {
    margin: 0;
    font-size: 20px;
    font-weight: 700;
  }

  .artist-meta {
    margin: 6px 0;
    color: #666;
    font-size: 13px;
  }

  .artist-bio {
    margin-top: 10px;
    font-size: 13px;
    color: #444;
  }

  .featured-badge {
    margin-top: 10px;
    display: inline-block;
    background-color: #f1c40f;
    color: #111;
    padding: 4px 8px;
    border-radius: 6px;
    font-size: 12px;
  }

  .cover {
    position: absolute;
    z-index: 2; /* فوق المحتوى */
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #ddd;
    background-size: cover;
    background-position: center;
    transform-origin: left;
    transition: transform 0.6s cubic-bezier(.2,.9,.3,1);
    box-shadow: 0 6px 18px rgba(0,0,0,0.18);
  }

  .book:hover .cover {
    transform: rotateY(-85deg);
  }

  /* responsive */
  @media (max-width: 900px) {
    .artists-grid { grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); }
    .book { width: 200px; height: 300px; }
  }
`;

export default Artists;
