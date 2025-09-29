// src/Pages/Contact/ContactForm.jsx
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faPhone, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faFacebook, faInstagram, faTwitter, faLinkedin } from "@fortawesome/free-brands-svg-icons";


const ContactForm = () => {

  const API_URL = import.meta.env.VITE_API_URL;
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/api/contact`, form);
      if (res.data.success) {
        toast.success(" The Message Was Sent Successfully ✅");
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        toast.error(res.data.msg || " Failed To Send Message ❌");
      }
    } catch (err) {
      toast.error(" Error Sending Message, Please Try Again ❌");
    }
  };

  return (
    <Wrapper>
      <Grid>
        {/* Form */}
        <FormCard as="form" onSubmit={handleSubmit}>
          <h4>Send Message Us</h4>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            id="subject"
            name="subject"
            placeholder="Your Subject"
            value={form.subject}
            onChange={handleChange}
          />
          <textarea
            id="message"
            name="message"
            rows="4"
            placeholder="Message"
            value={form.message}
            onChange={handleChange}
            required
          ></textarea>
          <button type="submit">Send Message</button>
        </FormCard>

        {/* Info */}
<InfoCard>
  <h4>Get In Touch</h4>
  <p>
    We’d love to hear from you! Whether you have questions about our exhibitions,
    artworks, or upcoming events, feel free to reach out to us.
  </p>

  <ContactInfo>
    <FontAwesomeIcon icon={faLocationDot} /> Altasamuh Art Gallery
  </ContactInfo>
  <ContactInfo>
    <FontAwesomeIcon icon={faPhone} /> (+2) 023 761 4705
  </ContactInfo>
  <ContactInfo>
    <FontAwesomeIcon icon={faPhone} /> (+2) 010 051 16374
  </ContactInfo>
  <ContactInfo>
    <FontAwesomeIcon icon={faEnvelope} /> altsamuht@gmail.com
  </ContactInfo>

  <SocialIcons>
    <SocialIcon as="a" href="https://www.facebook.com/people/%D8%A7%D9%84%D8%AA%D8%B3%D8%A7%D9%85%D8%AD/61563813774896/" target="_blank" rel="noopener noreferrer">
      <FontAwesomeIcon icon={faFacebook} />
    </SocialIcon>
    <SocialIcon as="a" href="https://www.instagram.com/altsamuh" target="_blank" rel="noopener noreferrer">
      <FontAwesomeIcon icon={faInstagram} />
    </SocialIcon>
  </SocialIcons>
</InfoCard>

      </Grid>
    </Wrapper>
  );
};

export default ContactForm;

// ================= Styled-components ==================
const Wrapper = styled.section`
  padding: 60px 20px;
  background: linear-gradient(180deg, #e0f7fa 0%, #f0f8ff 100%);
  font-family: 'Arial', sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  max-width: 1000px;
  margin: 0 auto;
  align-items: center;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
    text-align: center;
  }
`;

const FormCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  background: #ffffffcc;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.1);
  align-items: center;

  h4 { 
    margin-bottom: 15px; 
    color: #0e3a3a; 
    text-align: center;
  }

  input, textarea {
    padding: 12px;
    border-radius: 8px;
    border: 1px solid #ccc;
    font-size: 14px;
    width: 100%;
    resize: none;
    transition: border 0.3s ease;

    &:focus {
      border-color: #0e3a3a;
      outline: none;
    }
  }

  button {
    padding: 12px 25px;
    border: none;
    border-radius: 30px;
    background-color: #0e3a3a;
    color: #fff;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background-color: #145f5f;
    }
  }
`;

const InfoCard = styled.div`
  background: #ffffffcc;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.1);
  text-align: center;

  h4 { 
    margin-bottom: 15px; 
    color: #0e3a3a; 
  }

  p { 
    color: #333; 
    font-size: 14px; 
    margin-bottom: 15px; 
    line-height: 1.5; 
  }
`;

const ContactInfo = styled.p`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #333;
  margin-bottom: 10px;
  justify-content: center;
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;
  justify-content: center;
`;

const SocialIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #0e3a3a;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #145f5f;
  }
`;