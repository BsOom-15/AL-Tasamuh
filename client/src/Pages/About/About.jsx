// src/Pages/About/About.jsx
import React, { useEffect, useState } from "react";
import Loader from "../../Components/Modal/Loaders";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./About.css";
import { VITE_API_URL } from "../../../config";

const About = () => {
  const [about, setAbout] = useState(null);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await axios.get(`${VITE_API_URL}/api/about`);
        setAbout(res.data);
      } catch (err) {
        console.error("Error fetching about:", err);
      }
    };
    fetchAbout();
  }, []);

  if (!about)
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Loader />
      </div>
    );

  // نسخة مطابقة لـ getImageUrl من AboutAdmin
   const getImageUrl = (imgPath) => {
    if (!imgPath) return "";
    if (typeof imgPath !== "string") return "";
    imgPath = imgPath.trim();

    if (imgPath.startsWith("data:")) return imgPath;
    if (imgPath.startsWith("http://") || imgPath.startsWith("https://"))
      return imgPath;
    return `${VITE_API_URL}${imgPath.replace(/^\/+/, "")}`;
  };

  return (
    <div className="about-container">
      <div className="about-header">
        <div className="about-text">
          <h1>{about.header.title}</h1>
          <p>{about.header.subtitle}</p>
        </div>

        <div className="about-imgText">
          <p>{about.header.introText}</p>
        </div>
      </div>

      <div className="about-section">
        <div className="about-text-sections">
          {about.sections.map((sec, i) => (
            <div key={i}>
              <h2>{sec.title}</h2>
              <p>{sec.content}</p>
            </div>
          ))}
        </div>

        <div className="about-gellary">
          {about.galleries.map((gal, i) => (
            <div key={i} className="gellary-about">
              <div className="gallery-image">
                <Swiper
                  modules={[Navigation, Pagination, Scrollbar, A11y]}
                  spaceBetween={50}
                  slidesPerView={1}
                  navigation
                  pagination={{ clickable: true }}
                  scrollbar={{ draggable: true }}
                >
                  {gal.images.map((img, idx) => (
                    <SwiperSlide key={idx}>
                      <img src={getImageUrl(img)} alt={`slide-${idx}`} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
              <div className="gallery-text">
                <h3>{gal.name}</h3>
                {gal.description && <p>{gal.description}</p>}
              </div>
            </div>
          ))}
        </div>

        {about.quote && (
          <div className="about-qout">
            <div className="qout">
              <h1>{about.quote.text}</h1>
              <p>- {about.quote.author}</p>
            </div>
          </div>
        )}

        {about.founders.map((f, i) => (
          <div key={i} className="founderSection">
            <div className="founderImage">
              <img src={getImageUrl(f.image)} alt={f.name} />
            </div>
            <div className="founderTitle">
              <h1>{f.name}</h1>
              <h3>{f.title}</h3>
              <p>{f.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;
