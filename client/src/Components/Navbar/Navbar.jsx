import React, { useContext, useState, useEffect } from "react";
import { LanguageContext } from "../../context/LanguageContext"; 
import AltasamuhLogo from "../../assets/AltasamuhLogo.png"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; 
import { faFacebookF, faInstagram, faXTwitter } from "@fortawesome/free-brands-svg-icons"; 
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import "./Navbar.css";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const { t } = useContext(LanguageContext); 
  const [menuOpen, setMenuOpen] = useState(false); 
  const location = useLocation();

  const isWhiteBackground = location.pathname !== "/";

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // ✨ يقفل المنيو أوتوماتيكياً لما أتنقل لصفحة جديدة
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  return ( 
    <div className={`navbar-container ${isWhiteBackground ? "white-bg" : ""}`}>
      {/* Logo */}
      <div className="navbar-logo"> 
        <Link to={"/"}>
          <img src={AltasamuhLogo} alt="Altasamuh Logo" /> 
        </Link>
      </div> 

      {/* Hamburger / Close Icon */}
      <div className={`menu-icon ${menuOpen ? "close-icon" : ""}`} onClick={toggleMenu}>
        <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
      </div>

      {/* Links */}
      <div className={`navbar-links ${menuOpen ? "active" : ""}`}>
        <ul> 
          <Link to={"/about"}><li>{t("About")}</li></Link>
          <Link to={"/exhibitions"}><li>{t("Exhibitions")}</li></Link>
          <Link to={"/artists"}><li>{t("Artists")}</li></Link>
          <Link to={"/artworks"}><li>{t("Artworks and Sales")}</li></Link>
          <Link to={"/collectibles"}><li>{t("Altsamuh Collectibles")}</li></Link>
          <Link to={"/archive"}><li>{t("Archive")}</li></Link>
          <Link to={"/ourmemory"}><li>{t("Our Memory")}</li></Link>
          <Link to={"/contact"}><li>{t("Contact")}</li></Link>
        </ul> 
      </div> 

      {/* Social */}
      <div className={`navbar-social ${isWhiteBackground ? "white-bg" : ""}`}>
        <a href="https://www.facebook.com/profile.php?id=61563813774896">
          <FontAwesomeIcon className="social-icon facebook" icon={faFacebookF} /> 
        </a> 
        <a href="https://x.com"> 
          <FontAwesomeIcon className="social-icon twitter" icon={faXTwitter} /> 
        </a> 
        <a href="https://www.instagram.com/altsamuh"> 
          <FontAwesomeIcon className="social-icon instagram" icon={faInstagram} /> 
        </a> 
      </div> 
    </div> 
  ); 
}; 

export default Navbar;
