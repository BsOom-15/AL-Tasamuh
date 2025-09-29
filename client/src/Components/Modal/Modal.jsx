import React, { useState } from "react";
import "./Modal.css";

import CloseIcon from "@mui/icons-material/Close";
import CircleIcon from "@mui/icons-material/Circle";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faInstagram,
  faPinterestP,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import {
  TwitterShareButton,
  PinterestShareButton,
} from "react-share";

const Modal = ({
  artwork,
  onClose,
  onNext,
  onPrev,
  artworks = [],
  currentIndex = 0,
}) => {
  if (!artwork && (!artworks || artworks.length === 0)) return null;

  const [showWallView, setShowWallView] = useState(false);

  const active = artwork || artworks[currentIndex] || {};
  const imgSrc = active.image || "/default-artwork.jpg";
  const title = active.title || "Untitled";
  console.log("active.available:", active.available);

  const shareURI = window.location.href;

  return (
    <>
      <div className="modal-background" onClick={onClose}>
        <div className="modal-container" onClick={(e) => e.stopPropagation()}>
          <button className="close-modal" onClick={onClose}>
            <CloseIcon className="close-icon" />
          </button>

          {/* LEFT SIDE */}
          <div className="left-modal">
            <Link
              to={
                active.artist?._id ? `/artists/${active.artist._id}` : "/artists"
              }
            >
              <div className="modal-name">
                <h1>{active.artist?.name || active.artist || ""}</h1>
                <span className="available-modal">
                  {active.status ? (
                    <CircleIcon style={{ color: "#4E9C1F", fontSize: "10px" }} />
                  ) : (
                    <CircleIcon style={{ color: "#CC0000", fontSize: "10px" }} />
                  )}
                </span>
              </div>
            </Link>

            <div className="title-modal">
              <p>
                {active.year ? `${active.year}, ` : ""}
                <span>{title}</span>
              </p>
              <p>{active.medium}</p>
              <p>{active.dimensions}</p>
              <p>{active.status ? "Available" : "Sold"}</p>
            </div>

            <div className="modal-btn">
              {active && active.status && (
                <Link to="/contact">
                  <button className="enquire-btn">Enquire</button>
                </Link>
              )}
              <button className="view-btn" onClick={() => setShowWallView(true)}>
                <VisibilityIcon className="view-icon" /> View In Wall
              </button>
            </div>

            {/* SHARE BUTTONS */}
            <div className="share-wrapper">
              <div className="share-btn">
                <div className="share-icon">
                  <a
                    href="https://www.facebook.com/people/%D8%A7%D9%84%D8%AA%D8%B3%D8%A7%D9%85%D8%AD/61563813774896/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FontAwesomeIcon className="icon" icon={faFacebookF} />
                  </a>
                </div>
                <span>Facebook</span>
              </div>
              <div className="share-btn">
                <div className="share-icon">
                  <a
                    href="https://www.instagram.com/altsamuh"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FontAwesomeIcon className="icon" icon={faInstagram} />
                  </a>
                </div>
                <span>Instagram</span>
              </div>
              <div className="share-btn">
                <div className="share-icon">
                  <TwitterShareButton url={shareURI}>
                    <FontAwesomeIcon className="icon" icon={faXTwitter} />
                  </TwitterShareButton>
                </div>
                <span>Twitter</span>
              </div>
              <div className="share-btn">
                <div className="share-icon">
                  <PinterestShareButton url={shareURI} media={imgSrc}>
                    <FontAwesomeIcon className="icon" icon={faPinterestP} />
                  </PinterestShareButton>
                </div>
                <span>Pinterest</span>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="right-modal">
            <div className="image-modal">
              <img
                src={imgSrc}
                alt={title}
                onError={(e) => {
                  console.warn("Image load failed:", imgSrc);
                  e.currentTarget.src = "/default-artwork.jpg";
                }}
              />
            </div>
          </div>

          <div className="prev-next">
            <div className="prev" onClick={onPrev}>
              <ArrowBackIosNewIcon />
            </div>
            <div className="next" onClick={onNext}>
              <ArrowForwardIosIcon className="next-icon" />
            </div>
          </div>
        </div>
      </div>

      {/* WALL VIEW */}
      {showWallView && (
        <div className="wall-view-modal">
          <div className="wall-view-container">
            <button
              className="close-wall-view"
              onClick={() => setShowWallView(false)}
            >
              <CloseIcon className="close-icon" />
            </button>
            <div className="wall-image-container">
              <motion.img
                src={imgSrc}
                alt={title}
                className="artwork-on-wall"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
