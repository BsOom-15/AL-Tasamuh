import React, { useEffect, useState } from 'react';
import './OpeningNight.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation, Scrollbar } from 'swiper/modules';
import axios from 'axios';
import { VITE_API_URL } from '../../../config';

const OpeningNight = () => {
  const [openingNights, setOpeningNights] = useState([]);

  useEffect(() => {
    axios
      .get(`${VITE_API_URL}/api/opening-night?limit=3`)
      .then(res => {
        console.log("Opening Night API Response:", res.data);
        setOpeningNights(res.data.data || []);
      })
      .catch(err => console.log("Error fetching opening night:", err));
  }, []);

  return (
    <div className="opening-night-container">
      <h1>Opening Night</h1>
      {openingNights.map((item) => (
        <div className="opening-night-content" key={item._id}>
          <h3>{item.name}</h3>
          <Swiper
            modules={[Scrollbar, Navigation]}
            spaceBetween={20}
            slidesPerView={2}
            scrollbar={{ draggable: true }}
            navigation
          >
            {item.images.map((image, index) => (
              <SwiperSlide
                key={index}
                style={{ width: '500px', height: '500px' }}
              >
                <img
  src={
    image.startsWith("http")
      ? image
      : `${VITE_API_URL}/uploads/${image}`
  }
  alt={`Slide ${index}`}
  className="slide-image"
/>



              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ))}
    </div>
  );
};

export default OpeningNight;
