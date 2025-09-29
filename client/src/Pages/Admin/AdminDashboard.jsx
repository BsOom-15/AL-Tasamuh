// src/Pages/Admin/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  FaImages,
  FaUserAlt,
  FaPaintBrush,
  FaBox,
  FaArchive,
  FaBrain,
  FaInfoCircle,
  FaDoorOpen,
  FaLock,
  FaSignOutAlt,
  FaUserCircle,
} from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ArtistsAdmin from "./ArtistsAdmin";
import ArtworksAdmin from "./ArtworksAdmin";
import ExhibitionsAdmin from "./ExhibitionsAdmin";
import ArchiveAdmin from "./ArchiveAdmin";
import CollectibleAdmin from "./CollectibleAdmin";
import AboutAdmin from "./AboutAdmin";
import MemoryAdmin from "./MemoryAdmin";
import OpeningNightAdmin from "./OpeningNightAdmin";
import { VITE_API_URL } from "../../../config";

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState(
    localStorage.getItem("activeSection") || "home"
  );
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [user, setUser] = useState({ name: "", email: "", avatar: "" });
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // ✅ رفع صورة البروفايل
  const [avatarFile, setAvatarFile] = useState(null);

  // ✅ مودال للرسائل
  const [modal, setModal] = useState({ show: false, message: "", type: "info" });

  const navigate = useNavigate();

  // ✅ تحميل بيانات البروفايل
  useEffect(() => {
    // جلب التوكن من localStorage (جرب 'token' أو 'adminToken')
    const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
    if (!token) {
      setModal({ show: true, message: "يجب تسجيل الدخول أولاً", type: "error" });
      setTimeout(() => navigate("/admin/login"), 1500);
      return;
    }
    const headers = { Authorization: `Bearer ${token}` };
    axios
      .get(`${VITE_API_URL}/api/admin/profile`, { headers })
      .then((res) => setUser(res.data.admin))
      .catch((err) => {
        if (err.response?.status === 401) {
          setModal({ show: true, message: "انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى.", type: "error" });
          localStorage.removeItem("adminToken");
          setTimeout(() => navigate("/admin/login"), 1500);
        } else {
          setModal({ show: true, message: "خطأ في تحميل البروفايل", type: "error" });
        }
        console.error("Profile load error:", err);
      });
  }, []);

  // ✅ حفظ القسم النشط
  useEffect(() => {
    localStorage.setItem("activeSection", activeSection);
  }, [activeSection]);

  // ✅ تسجيل الخروج
  const handleLogout = async () => {
    try {
      await axios.post(
        `${VITE_API_URL}/api/admin/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );
    } catch (err) {
      console.error("Logout error:", err);
    }
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  // ✅ تغيير كلمة السر
  const handleChangePassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      setModal({ show: true, message: "Passwords do not match", type: "error" });
      return;
    }
    try {
      await axios.put(
        `${VITE_API_URL}/api/admin/change-password`,
        {
          oldPassword: passwords.oldPassword,
          newPassword: passwords.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
        }
      );
      setModal({ show: true, message: "Password changed successfully ✅", type: "success" });
      setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setShowPasswordForm(false);
    } catch (err) {
      setModal({
        show: true,
        message: err.response?.data?.message || "Error changing password",
        type: "error",
      });
    }
  };

  // ✅ تحديث البروفايل
  const handleUpdateProfile = async () => {
    try {
      const formData = new FormData();
      formData.append("name", user.name);
      formData.append("email", user.email);
      if (avatarFile) formData.append("avatar", avatarFile);

      const res = await axios.put(
        `${VITE_API_URL}/api/admin/update-profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUser(res.data.admin);
      setModal({ show: true, message: "Profile updated ✅", type: "success" });
      setShowProfileForm(false);
      setAvatarFile(null);
    } catch (err) {
      setModal({
        show: true,
        message: err.response?.data?.message || "Error updating profile",
        type: "error",
      });
    }
  };

  const renderContent = () => {
    if (showPasswordForm) {
      return (
        <PasswordForm>
          <h3>Change Password</h3>
          <input
            type="password"
            placeholder="Old Password"
            value={passwords.oldPassword}
            onChange={(e) =>
              setPasswords({ ...passwords, oldPassword: e.target.value })
            }
          />
          <input
            type="password"
            placeholder="New Password"
            value={passwords.newPassword}
            onChange={(e) =>
              setPasswords({ ...passwords, newPassword: e.target.value })
            }
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={passwords.confirmPassword}
            onChange={(e) =>
              setPasswords({ ...passwords, confirmPassword: e.target.value })
            }
          />
          <div className="buttons">
            <button onClick={handleChangePassword}>Save</button>
            <button onClick={() => setShowPasswordForm(false)}>Cancel</button>
          </div>
        </PasswordForm>
      );
    }

    if (showProfileForm) {
      return (
        <ProfileForm>
          <h3>Edit Profile</h3>
          <input
            type="text"
            placeholder="Name"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
          <input type="file" onChange={(e) => setAvatarFile(e.target.files[0])} />
          <div className="buttons">
            <button onClick={handleUpdateProfile}>Save</button>
            <button onClick={() => setShowProfileForm(false)}>Cancel</button>
          </div>
        </ProfileForm>
      );
    }

    switch (activeSection) {
      case "artists":
        return <ArtistsAdmin />;
      case "artworks":
        return <ArtworksAdmin />;
      case "exhibitions":
        return <ExhibitionsAdmin />;
      case "archive":
        return <ArchiveAdmin />;
      case "collectibles":
        return <CollectibleAdmin />;
      case "about":
        return <AboutAdmin />;
      case "memories":
        return <MemoryAdmin />;
      case "opening-night":
        return <OpeningNightAdmin />;
      default:
        return <p>Select a section from the menu.</p>;
    }
  };

  const sections = [
    { title: "Artists", icon: <FaUserAlt />, key: "artists" },
    { title: "Artworks", icon: <FaPaintBrush />, key: "artworks" },
    { title: "Exhibitions", icon: <FaImages />, key: "exhibitions" },
    { title: "Archive", icon: <FaArchive />, key: "archive" },
    { title: "Collectibles", icon: <FaBox />, key: "collectibles" },
    { title: "About", icon: <FaInfoCircle />, key: "about" },
    { title: "Memories", icon: <FaBrain />, key: "memories" },
    { title: "Opening Night", icon: <FaDoorOpen />, key: "opening-night" },
  ];

  return (
    <Wrapper>
      <Sidebar>
<UserBox>
  {user.avatar ? (
    <img
      src={`${user.avatar}${user.avatar.includes("?") ? "&" : "?"}t=${Date.now()}`}
      alt="avatar"
    />
  ) : (
    <FaUserCircle size={60} />
  )}
  <h2>{user.name}</h2>
  <p>{user.email}</p>
</UserBox>






        <Menu>
          {sections.map((sec, i) => (
            <MenuItem
              key={i}
              $active={activeSection === sec.key}
              onClick={() => {
                setActiveSection(sec.key);
                setShowPasswordForm(false);
                setShowProfileForm(false);
              }}
            >
              {sec.icon}
              <span>{sec.title}</span>
            </MenuItem>
          ))}
        </Menu>

        <BottomMenu>
          <PasswordBtn onClick={() => setShowProfileForm(true)}>
            <FaUserAlt /> Edit Profile
          </PasswordBtn>

          <PasswordBtn onClick={() => setShowPasswordForm(true)}>
            <FaLock /> Change Password
          </PasswordBtn>

          <LogoutBtn onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </LogoutBtn>
        </BottomMenu>
      </Sidebar>

      <Content>
        <h1>Admin Dashboard</h1>
        {renderContent()}
      </Content>

      {modal.show && (
        <Modal
          message={modal.message}
          type={modal.type}
          onClose={() => setModal({ ...modal, show: false })}
        />
      )}
    </Wrapper>
  );
};

// 🎨 STYLES
const Wrapper = styled.div`
  display: flex;
  min-height: 100vh;
  background: #f5f6f8;
`;

const Sidebar = styled.div`
  width: 280px;
  background: white;
  color: #1f8b8d;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const UserBox = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
  }
  h2 {
    margin: 0.5rem 0 0.2rem;
    color: #1f8b8d;
  }
  p {
    font-size: 0.9rem;
    color: #555;
  }
`;

const Menu = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
`;

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.3s;
  background: ${({ $active }) => ($active ? "#e0f7f8" : "transparent")};
  color: ${({ $active }) => ($active ? "#1f8b8d" : "#333")};

  &:hover {
    background: #eafcfc;
    color: #1f8b8d;
  }
`;

const BottomMenu = styled.div`
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const PasswordBtn = styled.button`
  background: #1f8b8d;
  border: none;
  padding: 0.75rem;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  display: flex;
  gap: 0.5rem;
  align-items: center;

  &:hover {
    background: #145f61;
  }
`;

const LogoutBtn = styled(PasswordBtn)`
  background: #e74c3c;
  &:hover {
    background: #c0392b;
  }
`;

const Content = styled.div`
  flex: 1;
  padding: 3rem;
  h1 {
    color: #1f8b8d;
    margin-bottom: 2rem;
  }
`;

const PasswordForm = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  max-width: 400px;

  input {
    width: 100%;
    padding: 0.75rem;
    margin-bottom: 1rem;
    border: 1px solid #ccc;
    border-radius: 6px;
  }

  .buttons {
    display: flex;
    gap: 1rem;
  }

  button {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
  }

  button:first-child {
    background: #1f8b8d;
    color: white;
  }

  button:last-child {
    background: #ddd;
  }
`;

const ProfileForm = styled(PasswordForm)``;

// ✅ Modal Styles
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalBox = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  width: 350px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.2);

  p {
    margin-bottom: 1.5rem;
    color: ${({ $type }) =>
      $type === "success" ? "green" :
      $type === "error" ? "red" : "#333"};
    font-size: 1rem;
    font-weight: 500;
  }

  button {
    background: ${({ $type }) =>
      $type === "success" ? "#1f8b8d" :
      $type === "error" ? "#e74c3c" : "#555"};
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    cursor: pointer;
  }

  button:hover {
    opacity: 0.9;
  }
`;

// ✅ Modal Component
const Modal = ({ message, type = "info", onClose }) => {
  return (
    <ModalOverlay>
      <ModalBox $type={type}>
        <p>{message}</p>
        <button onClick={onClose}>OK</button>
      </ModalBox>
    </ModalOverlay>
  );
};

export default AdminDashboard;
