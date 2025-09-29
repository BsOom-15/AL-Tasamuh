import React from 'react'
import './Footer.css';
import CallIcon from '@mui/icons-material/Call';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EmailIcon from '@mui/icons-material/Email';
import { faFacebookF } from "@fortawesome/free-brands-svg-icons"; 
import FmdGoodIcon from '@mui/icons-material/FmdGood';
const Footer = () => {
    const currentYear = new Date().getFullYear();
    return (
        <div className='footer-container'>
            <div className="footer-content">
                <div className="footer-contact">
                    <h3>Contact</h3>
                    <div className="phons">
                    <CallIcon />
                    <p>(+2)023 761 4705</p>
                    </div>
                    <div className="phons">
                    <CallIcon />
                    <p>(+2)010 051 16374</p>
                    </div>
                    <div className="phons">
                    <EmailIcon />
                    <p style={{textTransform: "none"}}>Info@altsamuh.com</p>
                    </div>
                </div>
                <div className="footer-open-time">
                    <h3>Openinig Time</h3>
                    <div className="opens">
                        <span>Open Daily</span>
                        <div className="time-open">
                        <AccessTimeIcon />
                        <span>9:30 AM - 5:00 PM</span>
                        </div>
                    </div>
                </div>
                <div className="footer-Address">
                    <h3>Address</h3>
                    <div className="address-icon">
                        <FmdGoodIcon />
                        <p>Dokki, 3 Abu Bakr Al-Siddiq - Administrative Tower - First Floor</p>
                    </div>

                    <div className="social-footer">

                        
                    </div>
                </div>
                
            </div>
            <div className="footer-reserved">
                <p>Manage Cookies</p>
                <p>&copy; {currentYear} AL-Tasamuh Art Gellary. All rights reserved.</p>
                </div>
        </div>
    )
}

export default Footer