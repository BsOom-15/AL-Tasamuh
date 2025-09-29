// src/Pages/Admin/ArtworksAdmin.jsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import FormFileUpload from "../../Components/Modal/FileUploadForm";

const ArtworksAdmin = () => {

  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const [artworks, setArtworks] = useState([]);
  const [allArtists, setAllArtists] = useState([]);
  const [search, setSearch] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [artist, setArtist] = useState("");
  const [status, setStatus] = useState("active"); // حقل الحالة
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [artworksRes, artistsRes] = await Promise.all([
          axios.get(`${API_URL}/api/artworks`),
          axios.get(`${API_URL}/api/artists`),
        ]);

        setArtworks(Array.isArray(artworksRes.data.data) ? artworksRes.data.data : []);
        setAllArtists(Array.isArray(artistsRes.data) ? artistsRes.data : []);
      } catch (err) {
        console.log(err);
        toast.error("Error fetching data");
      }
    };
    fetchData();
  }, []);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setArtist("");
    setStatus("active");
    setImage(null);
    setPreview("");
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("artist", artist);
      formData.append("status", status);
      if (image instanceof File) formData.append("image", image);

      if (editingId) {
        await axios.put(`${API_URL}/api/artworks/${editingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Artwork updated!");
      } else {
        await axios.post(`${API_URL}/api/artworks`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Artwork added!");
      }
      resetForm();
      const res = await axios.get(`${API_URL}/api/artworks`);
      setArtworks(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (err) {
      console.log(err);
      toast.error("Error saving artwork");
    }
  };

  const handleEdit = (artwork) => {
    setEditingId(artwork._id);
    setTitle(artwork.title || "");
    setDescription(artwork.description || "");
    setArtist(typeof artwork.artist === "string" ? artwork.artist : artwork.artist?._id || "");
    setStatus(artwork.status || "active");
    setImage(null);
    setPreview(artwork.image || "");
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await axios.delete(`${API_URL}/api/artworks/${deleteTarget}`);
      toast.success("Artwork deleted!");
      setArtworks((prev) => prev.filter((a) => a._id !== deleteTarget));
    } catch (err) {
      console.log(err);
      toast.error("Error deleting artwork");
    } finally {
      setShowDeleteConfirm(false);
      setDeleteTarget(null);
    }
  };

  const filteredArtworks = artworks.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageContainer>
      <LeftPanel>

        <FormWrapper onSubmit={handleSubmit}>
          <h3>{editingId ? "Edit Artwork" : "Add Artwork"}</h3>

          <div className="inputbox">
            <input value={title} onChange={(e) => setTitle(e.target.value)} required />
            <span>Title</span>
          </div>

          <div className="inputbox">
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
            />
          </div>

          <div className="inputbox">
            <select value={artist} onChange={(e) => setArtist(e.target.value)} required>
              <option value="">Select Artist</option>
              {allArtists.map((ar) => (
                <option key={ar._id} value={ar._id}>
                  {ar.name}
                </option>
              ))}
            </select>
          </div>

          <div className="inputbox">
  <select value={status} onChange={(e) => setStatus(e.target.value)}>
    <option value="active">Active</option>
    <option value="sold">Sold</option>
  </select>
</div>


          <div className="inputbox">
            <FormFileUpload image={image} setImage={setImage} preview={preview} setPreview={setPreview} />
          </div>

          <button type="submit">{editingId ? "Update" : "Add"}</button>
          {editingId && (
            <button type="button" onClick={resetForm}>
              Cancel
            </button>
          )}
        </FormWrapper>
      </LeftPanel>

      <RightPanel>
        <SearchBox>
          <input
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </SearchBox>

        <ArtworksTable>
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Artist</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredArtworks.map((a) => (
              <tr key={a._id}>
                <td>
                  <img
                    src={a.image || "https://via.placeholder.com/80"}
                    alt={a.title}
                    style={{ width: "60px", height: "60px", borderRadius: "6px", objectFit: "cover" }}
                  />
                </td>
                <td>{a.title}</td>
                <td>{a.artist?.name || "N/A"}</td>
                <td>{a.status}</td>
                <td>
                  <button className="editBtn" onClick={() => handleEdit(a)}>Edit</button>
                  <button
                    className="deleteBtn"
                    onClick={() => {
                      setDeleteTarget(a._id);
                      setShowDeleteConfirm(true);
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </ArtworksTable>
      </RightPanel>

      {showDeleteConfirm && (
        <DeleteOverlay>
          <DeleteBox>
            <p>Are you sure you want to delete this artwork?</p>
            <div className="actions">
              <button onClick={handleDelete}>Yes</button>
              <button onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
            </div>
          </DeleteBox>
        </DeleteOverlay>
      )}
    </PageContainer>
  );
};

// === Styled Components ===
const PageContainer = styled.div`
  display: flex;
  gap: 1rem;
  max-width: 1200px;
  margin: 2rem auto;
`;
const LeftPanel = styled.div`flex: 1;`;
const RightPanel = styled.div`flex: 2;`;
const SearchBox = styled.div`
  margin-bottom: 1rem;
  input {
    width: 100%;
    padding: 8px;
    font-size: 1rem;
  }
`;
const BackButton = styled.button`
  margin-bottom: 10px;
  padding: 8px 12px;
  background: #555;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
`;
const FormWrapper = styled.form`
  background: #eee;
  padding: 1rem;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  .inputbox { position: relative; width: 100%; }
  .inputbox input,
  .inputbox textarea,
  .inputbox select {
    width: 100%;
    padding: 8px;
    border: none;
    border-bottom: 2px solid #616161;
    outline: none;
  }
  .inputbox span {
    position: absolute;
    left: 0;
    top: 8px;
    font-size: 0.85em;
    color: #888;
    pointer-events: none;
    transition: 0.3s;
  }
  button {
    padding: 10px;
    border: none;
    background: #1f8b8d;
    color: #fff;
    border-radius: 6px;
    cursor: pointer;
  }
`;
const ArtworksTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
  th { background: #f5f5f5; }
  button {
    margin-right: 5px;
    padding: 6px 12px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    font-size: 0.85rem;
  }
  .editBtn { background: linear-gradient(to right, #4caf50, #43a047); color: #fff; }
  .editBtn:hover { background: linear-gradient(to right, #43a047, #388e3c); }
  .deleteBtn { background: linear-gradient(to right, #f44336, #e53935); color: #fff; }
  .deleteBtn:hover { background: linear-gradient(to right, #e53935, #c62828); }
`;
const DeleteOverlay = styled.div`
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 999;
`;
const DeleteBox = styled.div`
  background: #fff; padding: 2rem; border-radius: 10px; text-align: center;
  .actions { margin-top: 1rem; display: flex; justify-content: center; gap: 1rem; }
  button { padding: 8px 12px; border: none; border-radius: 6px; cursor: pointer; }
  button:first-child { background: #d9534f; color: #fff; }
  button:last-child { background: #6c757d; color: #fff; }
`;

export default ArtworksAdmin;
