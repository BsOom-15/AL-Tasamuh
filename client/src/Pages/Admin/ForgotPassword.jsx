import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { VITE_VITE_API_URL } from "../../../config";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${VITE_VITE_API_URL}/api/admin/forgot-password`, { email });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error sending reset link");
    }
  };

  return (
    <StyledWrapper>
      <div className="container">
        <div className="login-box">
          <h2>Forgot Password</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-box">
              <input
                required
                type="email"
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label>Email</label>
            </div>
            <button className="btn" type="submit">Send Reset Link</button>
            {message && <p style={{ marginTop: "10px", textAlign: "center", color: "#0ef" }}>{message}</p>}
          </form>
        </div>
        {Array.from({ length: 50 }).map((_, i) => (
          <span key={i} style={{ '--i': i }} />
        ))}
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: transparent;

  .container {
    position: relative;
    width: 500px;
    height: 500px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    overflow: hidden;
  }

  .container span {
    position: absolute;
    left: 0;
    width: 32px;
    height: 6px;
    background: #2c4766;
    border-radius: 80px;
    transform-origin: 250px;
    transform: rotate(calc(var(--i) * (360deg / 50)));
    animation: blink 3s linear infinite;
    animation-delay: calc(var(--i) * (3s / 50));
  }

  @keyframes blink { 0% { background: #0ef; } 25% { background: #2c4766; } }

  .login-box {
    position: absolute;
    width: 80%;
    max-width: 350px;
    z-index: 1;
    padding: 25px;
    border-radius: 20px;
    background: transparent;
  }

  form { width: 100%; padding: 0 10px; }

  h2 {
    font-size: 2em;
    color: #0ef;
    text-align: center;
    margin-bottom: 15px;
  }

  .input-box { position: relative; margin: 18px 0; }

  input {
    width: 100%;
    height: 45px;
    background: transparent;
    border: 2px solid #2c4766;
    outline: none;
    border-radius: 40px;
    font-size: 1em;
    color: #000;
    padding: 0 15px;
    transition: 0.5s ease;
  }

  input:focus { border-color: #0ef; }

  input:not(:placeholder-shown) ~ label,
  input:focus ~ label { top: -10px; font-size: 0.8em; background: transparent; padding: 0 6px; color: #0ef; }

  label { position: absolute; top: 50%; left: 15px; transform: translateY(-50%); font-size: 1em; pointer-events: none; transition: 0.5s ease; color: #000; }

  .btn {
    width: 100%;
    height: 45px;
    background: #0ef;
    border: none;
    border-radius: 40px;
    cursor: pointer;
    font-size: 1em;
    color: #1f293a;
    font-weight: 600;
  }
`;

export default ForgotPassword;
