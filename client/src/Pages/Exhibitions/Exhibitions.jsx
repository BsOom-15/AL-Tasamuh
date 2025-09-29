import React, { useEffect, useState } from 'react';
import './Exhibitions.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { VITE_VITE_API_URL } from '../../../config';

const Exhibitions = () => {
  const [exhibitions, setExhibitions] = useState([]);

const fetchExhibitions = async () => {
  try {
    const res = await axios.get(`${VITE_VITE_API_URL}/api/exhibitions`);
    setExhibitions(Array.isArray(res.data.data) ? res.data.data : []);
  } catch (err) {
    console.error('Error fetching exhibitions:', err);
  }
};


  useEffect(() => {
    fetchExhibitions();
  }, []);

  const textLimit = (text, wordLimit) => {
    if (!text) return '';
    const words = text.split(' ');
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(' ') + '...';
  };

  return (
    <div className='exhibitions-container'>
      <div className="exhibitions-text">
        <h1>Exhibitions</h1>
      </div>

      <div className="exhibitions-list">
        {exhibitions.length === 0 && <p>No exhibitions found.</p>}
        {exhibitions.map((exhibition) => (
          <div className="exhibition-card" key={exhibition._id}>
            <Link to={`/exhibitions/overview/${exhibition._id}`}>
              <img
  src={
    exhibition.cover
      ? exhibition.cover.startsWith('http')
        ? exhibition.cover
        : `${VITE_VITE_API_URL}${exhibition.cover.replace(/^\/+/, '')}`
      : 'https://via.placeholder.com/300x200'
  }
  alt={exhibition.title}
/>

            </Link>
            <div className="exhibition-info">
              <h2>{exhibition.title || 'Untitled'}</h2>
              <h4>{exhibition.artist?.name || 'Unknown Artist'}</h4>
              <p>{textLimit(exhibition.overview, 50)}</p>
              <p>{exhibition.date || 'No date'}</p>
              <Link to={`/exhibitions/overview/${exhibition._id}`}>
                <button>Read More</button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Exhibitions;
