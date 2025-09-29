// src/Pages/Archive/ArchiveItemDetails.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Loader from "../../Components/Modal/Loaders";
import Modal from "../../Components/Modal/Modal"; // ✅ استدعاء المودال الجاهز
import { VITE_VITE_API_URL } from "../../../config";

const ArchiveItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [allItems, setAllItems] = useState([]);

  useEffect(() => {
    axios
      .get(`${VITE_VITE_API_URL}/api/archive/${id}`)
      .then((res) => {
        // نخلي status = false عشان الـ Archive كله مبيعات
        setItem({ ...res.data, status: false });
      })
      .catch((err) => console.error(err));

    axios
      .get(`${VITE_VITE_API_URL}/api/archive?limit=100`)
      .then((res) => setAllItems(res.data.data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!item)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "70vh",
        }}
      >
        <Loader />
      </div>
    );

  const navigatePrev = () => {
    if (!allItems.length) return;
    const idx = allItems.findIndex((a) => a._id === item._id);
    const newIndex = idx > 0 ? idx - 1 : allItems.length - 1;
    setCurrentIndex(newIndex);
    navigate(`/archive/${allItems[newIndex]._id}`);
  };

  const navigateNext = () => {
    if (!allItems.length) return;
    const idx = allItems.findIndex((a) => a._id === item._id);
    const newIndex = idx < allItems.length - 1 ? idx + 1 : 0;
    setCurrentIndex(newIndex);
    navigate(`/archive/${allItems[newIndex]._id}`);
  };

  return (
    <Wrapper>
      <div className="top-bar">
        <Link to="/archive" className="back-btn">
          <CloseIcon /> Back
        </Link>
      </div>

      {/* ✅ استدعاء المودال الجاهز */}
      {item && (
        <Modal
          artwork={item}
          artworks={allItems}
          currentIndex={currentIndex}
          onClose={() => navigate("/archive")}
          onNext={navigateNext}
          onPrev={navigatePrev}
        />
      )}

      <div className="nav-arrows">
        <div className="prev" onClick={navigatePrev}>
          <ArrowBackIosNewIcon />
        </div>
        <div className="next" onClick={navigateNext}>
          <ArrowForwardIosIcon className="next-icon" />
        </div>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding: 60px 80px;

  .top-bar {
    margin-bottom: 30px;
    display: flex;
    justify-content: flex-start;
  }

  .back-btn {
    display: flex;
    align-items: center;
    gap: 5px;
    color: #333;
    text-decoration: none;
    font-weight: 500;
    transition: 0.2s;
  }

  .back-btn:hover {
    color: #0e3a3a;
  }

  .nav-arrows {
    display: flex;
    justify-content: space-between;
    margin-top: 30px;
    align-items: center;
  }

  .nav-arrows div {
    cursor: pointer;
    color: #0e3a3a;
    font-size: 28px;
    transition: 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
    border-radius: 50%;
  }

  .nav-arrows div:hover {
    background: rgba(0, 0, 0, 0.05);
  }

  /* 📱 موبايل صغير */
  @media (max-width: 576px) {
    padding: 30px 20px;

    .top-bar {
      justify-content: center;
    }

    .back-btn {
      font-size: 14px;
    }

    .nav-arrows {
      margin-top: 20px;
    }

    .nav-arrows div {
      font-size: 22px;
      padding: 6px;
    }
  }

  /* 📱 تابلت */
  @media (max-width: 900px) {
    padding: 40px 30px;

    .back-btn {
      font-size: 15px;
    }

    .nav-arrows div {
      font-size: 24px;
    }
  }
`;


export default ArchiveItemDetails;
