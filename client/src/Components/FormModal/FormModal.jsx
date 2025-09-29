import React from 'react'
import './FormModal.css'
import CloseIcon from '@mui/icons-material/Close';
const FormModal = ({onClose}) => {
    return (
        <div className="message-modal">
                    <div className="close-btn" onClick={onClose}>
                    <CloseIcon />
                    </div>
                    <div className="message-modal-content" >
                        <h1 >Enquire ...</h1>
                        <div className="message-form">
                        <div className="input-form">
                            <span>Name *</span>
                            <input type="text" placeholder="Enter Your Name" required/>
                            </div>

                            <div className="input-form">
                            <span>Email *</span>
                            <input type="email" placeholder="Enter Your Email" required/>
                            </div>

                            <div className="input-form">
                            <span>Phone</span>
                            <input type="tel" placeholder="Enter Your Phone" />
                            </div>

                            <div className="input-form">
                            <span>Message</span>
                            <textarea name="message" placeholder='Enter Your Message...'></textarea>
                            </div>
                        </div>
                        <p>You will be added to our mailing list upon submission of this form.</p>
                        <button className='enquire-btn btn-form-modal'>
                            Submit Enquire
                        </button>
                        <div className="note-enquire">
                        * denotes required fields

In order to respond to your enquiry, we will process the personal data you have supplied in accordance with our privacy policy (status on request). You can unsubscribe or change your preferences at any time by clicking the link in our emails.
                        </div>
                    </div>
                </div>
    )
}

export default FormModal