// client/src/Pages/Archive/Archive.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Archive = () => {

  const API_URL = import.meta.env.VITE_API_URL;
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const nav = useNavigate();

  useEffect(() => {
    axios
  .get(`${API_URL}/api/archive?page=${page}&limit=12`)
  .then((res) => {
    setItems(res.data.data || []);
    setPages(res.data.pages || 1);
  })
  .catch((err) => console.error(err));

  }, [page]);

  return (
    <Wrapper>
      <h1>Altsamuh Archive</h1>
      <div className="archive-grid">
        {items.map((it) => (
          <div
            key={it._id}
            className="archive-card"
            onClick={() => nav(`/archive/${it._id}`)}
          >
            <div className="image-wrapper">
              <img
                src={it.image || "/default-archive.jpg"}
                alt={it.title}
                className="archive-image"
              />
            </div>
            <p className="archive-title">{it.title || "Untitled"}</p>
            <p className="archive-date">
              {new Date(it.archivedAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>

      <div className="pagination">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
        >
          Prev
        </button>
        <span>
          Page {page} of {pages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, pages))}
          disabled={page === pages}
        >
          Next
        </button>
      </div>
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

  .archive-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    justify-items: center;
  }

  .archive-card {
    background: #fff;
    border: 1px solid #eee;
    border-radius: 12px;
    padding: 15px;
    text-align: center;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    cursor: pointer;
  }

  .archive-card:hover {
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

  .archive-image {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    border-radius: 8px;
  }

  .archive-title {
    margin-top: 12px;
    font-weight: 600;
    color: #333;
    font-size: 16px;
    text-align: center;
  }

  .archive-date {
    font-size: 14px;
    color: #0e3a3a;
    margin-top: 4px;
  }

  .pagination {
    text-align: center;
    margin-top: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 15px;
    flex-wrap: wrap;
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

  /* 🖥 شاشات أقل من 1200px (تابلت كبيرة) */
  @media (max-width: 1200px) {
    .archive-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  /* 📱 تابلت وأجهزة متوسطة */
  @media (max-width: 900px) {
    .archive-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  /* 📱 موبايل صغير */
  @media (max-width: 576px) {
    padding: 40px 20px;

    h1 {
      font-size: 26px;
    }

    .archive-grid {
      grid-template-columns: 1fr;
      gap: 15px;
    }

    .archive-card {
      padding: 12px;
    }

    .image-wrapper {
      height: 180px;
    }

    .archive-title {
      font-size: 15px;
    }

    .archive-date {
      font-size: 13px;
    }
  }
`;


export default Archive;
