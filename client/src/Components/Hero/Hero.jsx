// src/Components/Hero/Hero.jsx
import React, { useContext, useEffect, useState, useRef } from "react";
import "./Hero.css";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../../context/LanguageContext";
import Artwork from "../../Sections/Artworks/Artwork";
import ArtistSection from "../ArtistSection/ArtistSection";
import OpeningNight from "../OpeningNight/OpeningNight";
import { getRandomExhibitions } from "../../utils/api";

const Hero = () => {
  const { t } = useContext(LanguageContext);
  const [items, setItems] = useState([]);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const navigate = useNavigate();
  const intervalRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL;

 const getHeroImage = (cover) => {
  if (!cover) return "/fallback.jpg";
  if (cover.startsWith("http://")) {
    return cover.replace("http://", "https://"); // force https
  }
  if (cover.startsWith("https://")) return cover;
  return `${API_URL}/uploads/${cover.replace(/^\/+/, "")}`;
};


  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getExhibitions({ limit: 6 });
        setItems(Array.isArray(res.data.data) ? res.data.data : []);
        setCurrent(0);
      } catch (err) {
        console.error("Hero fetch error:", err);
      }
    };
    fetch();
  }, []);

  useEffect(() => {
    if (paused || items.length === 0) return;
    intervalRef.current = setInterval(() => {
      setCurrent((p) => (p + 1) % items.length);
    }, 2000);
    return () => clearInterval(intervalRef.current);
  }, [paused, items]);

  return (
    <>
      <div
        className="hero-container"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="hero-slider">
          {(() => {
            if (!items.length) return null;
            const prevIndex = (current - 1 + items.length) % items.length;
            const nextIndex = (current + 1) % items.length;
            const order = [
              items[prevIndex],
              items[current],
              items[nextIndex],
              ...items.filter(
                (_, i) =>
                  i !== prevIndex && i !== current && i !== nextIndex
              ),
            ];
            return order.map((item, i) => (
              <div
                key={String(item._id) + "-" + i}
                className="hero-item"
                style={{
                  backgroundImage: `url(${getHeroImage(item.cover)})`,
                }}
              >
                <div className="hero-content">
                  <div className="name">{t(item.title)}</div>
                  <div className="descripe">{t(item.description)}</div>
                  <button
                    onClick={() =>
                      navigate(`/exhibitions/overview/${item._id}`)
                    }
                  >
                    {t("See More")}
                  </button>
                </div>
              </div>
            ));
          })()}
        </div>
      </div>

      {/* Sections under hero */}
      <section className="new-section">
        <Artwork />
      </section>

      <section className="new-section art-section">
        <ArtistSection />
      </section>

      <section className="section">
        <OpeningNight />
      </section>
    </>
  );
};

export default Hero;
