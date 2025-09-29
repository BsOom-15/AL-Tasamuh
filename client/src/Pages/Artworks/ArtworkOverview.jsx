import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import styled from "styled-components";
import Loader from "../../Components/Modal/Loaders";
import { VITE_API_URL } from "../../../config";

const ArtworkOverview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [artwork, setArtwork] = useState(null);


    // ✅ Helper لمعالجة الصورة
  const getImageUrl = (img) => {
    if (!img) return "/default-artwork.jpg";
    return img.startsWith("http") ? img : `${VITE_API_URL}/${img}`;
  };

  useEffect(() => {
    axios.get(`${VITE_API_URL}/api/artworks/${id}`)
      .then((res) => setArtwork(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!artwork) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'70vh'}}>
      <Loader />
    </div>
  );

  return (
    <Wrapper>
      <div className="go-back">
        <ArrowBackIosIcon />
        <button onClick={() => navigate("/artworks")}>Back to Artworks</button>
      </div>

      <h1>{artwork.title || "Untitled"}</h1>

      <div className="overview-box">
        <div className="box-overview-left">
          <p>{artwork.description || "No description available."}</p>
        </div>
        <div className="box-overview-right">
          <img src={getImageUrl(artwork.image)} alt={artwork.title} />
          <div className="overview-information-right">
            <h4>
              {artwork.artist?.name || "Unknown Artist"}
              {artwork.exhibition ? ` — ${artwork.exhibition?.name}` : ""}
              <span className={`status ${artwork.status || "unknown"}`}> — {artwork.status || "unknown"}</span>
            </h4>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding: 60px 80px;
  .go-back { display: flex; align-items: center; gap: 5px; margin-bottom: 20px; }
  .go-back button { background: #333; color: #fff; border: none; border-radius: 6px; padding: 6px 12px; cursor: pointer; }

  .overview-box { display: flex; gap: 30px; margin-top: 20px; }
  .box-overview-left { flex: 1; font-size: 16px; line-height: 1.6; }
  .box-overview-right { flex: 1; text-align: center; }
  .box-overview-right img { width: 100%; max-height: 400px; object-fit: cover; border-radius: 10px; }
  .overview-information-right h4 { margin-top: 12px; font-weight: 600; font-size: 18px; }

  .status.active { color: green; font-weight: 600; }
  .status.inactive { color: gray; font-weight: 600; }
  .status.sold { color: red; font-weight: 600; }
  .status.unknown { color: orange; font-weight: 600; }

  @media (max-width: 900px) { .overview-box { flex-direction: column; } }
`;

export default ArtworkOverview;
