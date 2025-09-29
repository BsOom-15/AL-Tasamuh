import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import './Overview.css';
import axios from 'axios';
import CloseIcon from '@mui/icons-material/Close';
import CircleIcon from '@mui/icons-material/Circle';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faInstagram, faPinterestP, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import {
    FacebookShareButton,
    InstapaperShareButton,
    PinterestShareButton,
    TwitterShareButton,
} from "react-share";
import Loader from "../../Components/Modal/Loaders";
import { VITE_API_URL } from '../../../config';

const Overview = () => {
    const [view, setView] = useState('overview');
    const [isOpen, setIsOpen] = useState(false);
    const [selectedArtwork, setSelectedArtwork] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [exhibition, setExhibition] = useState(null);
    const [allWorks, setAllWorks] = useState([]); // كل أعمال الفنان

    const { id } = useParams();
    const navigate = useNavigate();

    // جلب بيانات المعرض
    useEffect(() => {
        const fetchExhibition = async () => {
            try {
                const res = await axios.get(`${VITE_API_URL}/api/exhibitions/${id}`);

                setExhibition(res.data);
            } catch (err) {
                console.error("Error fetching exhibition:", err);
            }
        };
        fetchExhibition();
    }, [id]);

    // عند الضغط على زر Works نجيب كل أعمال الفنان
    const handleViewWorks = async () => {
        if (!exhibition?.artist?._id) return;
        try {
            const res = await axios.get(`${VITE_API_URL}/api/artworks?artistId=${exhibition.artist._id}`);

            setAllWorks(Array.isArray(res.data.data) ? res.data.data : []);
            setView('work');
        } catch (err) {
            console.error("Error fetching artist's works:", err);
        }
    };

    const handleBack = () => {
        navigate('/exhibitions');
    };

    const handleOpen = (workIndex) => {
        setIsOpen(true);
        setSelectedArtwork(workIndex);
        setCurrentIndex(workIndex);
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    const handlePrev = () => {
        if (!allWorks.length) return;
        setCurrentIndex((prevIndex) =>
            prevIndex > 0 ? prevIndex - 1 : allWorks.length - 1
        );
    };

    const handleNext = () => {
        if (!allWorks.length) return;
        setCurrentIndex((prevIndex) =>
            prevIndex < allWorks.length - 1 ? prevIndex + 1 : 0
        );
    };

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
    }, [isOpen]);

    if (!exhibition) {
                return (
                    <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'70vh'}}>
                        <Loader />
                    </div>
                );
    }

    return (
        <div className="overview-header">
            <div className="go-back">
                <ArrowBackIosIcon />
                <button onClick={handleBack}>Go To Exhibition</button>
            </div>
            <h1>{exhibition.title}</h1>
            <div className="overview-header-nav">
                <div className="overview-left">
                    <p>{exhibition.artist?.name}</p>
                    <p>{exhibition.date}</p>
                </div>
                <div className="overview-right">
                    <button
                        className={view === "overview" ? "active" : ""}
                        onClick={() => setView("overview")}
                    >
                        Overview
                    </button>
                    <button
                        className={view === "work" ? "active" : ""}
                        onClick={() => navigate('/artworks')}
                    >
                        Works
                    </button>
                </div>
            </div>

            <div className="overview-content">
                {view === 'overview' ? (
                    <div className="overview-container">
                        <div className="overview-box">
                            <div className="box-overview-left">
                                <h1>{exhibition.description}</h1>
                            </div>

                            <div className="box-overview-right">
                                <img src={exhibition.cover} alt="" />
                                <div className="overview-information-right">
                                    {exhibition.works.slice(0, 1).map((work, index) => (
                                        <div className="overview-list" key={index} onClick={() => handleOpen(index)}>
                                            <h4>{exhibition.artist?.name}, <span>{work.title}</span>, <span>{work.medium}</span>, <span>{work.dimensions}</span>, <span>{work.notes}</span>.</h4>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    className='view-works'
                                    onClick={handleViewWorks}
                                >
                                    View Works
                                </button>
                            </div>
                        </div>
                        <div className="overview-description">
                            <p>{exhibition.overview}</p>
                        </div>
                    </div>
                ) : (
                    <div className="work-list">
                        {allWorks.length === 0 && <p>No works found for this artist.</p>}
                        {allWorks.map((work, index) => (
                            <div key={index} className="work-item" onClick={() => handleOpen(index)}>
                                <div className="work-img">
                                    <img src={work.image} alt={work.title} />
                                </div>
                                <div className="work-details">
                                    <div className="artist-name">
                                        <h2>{work.artist?.name}</h2>
                                        <span>{work.status ? <CircleIcon style={{ color: '#4E9C1F', fontSize: '10px' }} /> : <CircleIcon style={{ color: '#CC0000', fontSize: '10px' }} />}</span>
                                    </div>
                                    <h3>{work.title}</h3>
                                    <p>{work.medium}</p>
                                    <p>{work.dimensions}</p>
                                    <p>{work.notes}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {isOpen && allWorks.length > 0 && (
                <div className='modal-background'>
                    <div className="modal-container">
                        <button className='close-modal'>
                            <CloseIcon className='close-icon' onClick={handleClose} />
                        </button>
                        <div className="left-modal">
                            <Link to={`/exhibitions`}>
                                <div className="modal-name">
                                    <h1>{allWorks[currentIndex].artist?.name}</h1>
                                    <span className='available-modal'>
                                        {allWorks[currentIndex].status ? <CircleIcon style={{ color: '#4E9C1F', fontSize: '10px' }} /> : <CircleIcon style={{ color: '#CC0000', fontSize: '10px' }} />}
                                    </span>
                                </div>
                            </Link>
                            <div className="title-modal">
                                <p>{allWorks[currentIndex].year}, <span>{allWorks[currentIndex].title}</span></p>
                                <p>{allWorks[currentIndex].medium}</p>
                                <p>{allWorks[currentIndex].dimensions}</p>
                                <p>signed & dated</p>
                                <p>{allWorks[currentIndex].status ? "" : "Sold"}</p>
                            </div>
                            <div className="share-wrapper">
                                <div className="share-btn">
                                    <div className="share-icon">
                                        <FacebookShareButton url={window.location.href}>
                                            <FontAwesomeIcon className='icon' icon={faFacebookF} />
                                        </FacebookShareButton>
                                    </div>
                                    <span>Facebook</span>
                                </div>
                                <div className="share-btn">
                                    <div className="share-icon">
                                        <InstapaperShareButton url={window.location.href}>
                                            <FontAwesomeIcon className='icon' icon={faInstagram} />
                                        </InstapaperShareButton>
                                    </div>
                                    <span>Instagram</span>
                                </div>
                                <div className="share-btn">
                                    <div className="share-icon">
                                        <TwitterShareButton url={window.location.href}>
                                            <FontAwesomeIcon className='icon' icon={faXTwitter} />
                                        </TwitterShareButton>
                                    </div>
                                    <span>Twitter</span>
                                </div>
                                <div className="share-btn">
                                    <div className="share-icon">
                                        <PinterestShareButton url={window.location.href} media={allWorks[currentIndex].imageUrl}>
                                            <FontAwesomeIcon className='icon' icon={faPinterestP} />
                                        </PinterestShareButton>
                                    </div>
                                    <span>Pinterest</span>
                                </div>
                            </div>
                        </div>

                        <div className="right-modal">
                            <div className="image-modal">
                                <img src={allWorks[currentIndex].imageUrl} alt="" />
                            </div>
                        </div>
                        <div className="prev-next">
                            <div className="prev" onClick={handlePrev}><ArrowBackIosNewIcon /></div>
                            <div className="next" onClick={handleNext}><ArrowForwardIosIcon className='next-icon' /></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Overview;
