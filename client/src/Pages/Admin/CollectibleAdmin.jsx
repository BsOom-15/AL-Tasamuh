// src/Pages/Admin/CollectiblesAdmin.jsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import FormFileUpload from "../../Components/Modal/FileUploadForm";
import { VITE_VITE_API_URL } from "../../../config";

const CollectiblesAdmin = () => {
  const navigate = useNavigate();

  const [collectibles, setCollectibles] = useState([]);
  const [search, setSearch] = useState("");

  // Form states
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [customCurrency, setCustomCurrency] = useState("");
  const [description, setDescription] = useState("");
  const [cover, setCover] = useState(null);
  const [preview, setPreview] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Fetch data
 const fetchData = async () => {
  try {
    const res = await axios.get(`${VITE_VITE_API_URL}/api/collectibles`);
    console.log("API Response:", res.data); // شوف شكل الداتا
    setCollectibles(Array.isArray(res.data) ? res.data : res.data.data || []);
  } catch (err) {
    console.log(err);
    toast.error("Error fetching collectibles");
  }
};


  useEffect(() => { fetchData(); }, []);

  const resetForm = () => {
  setTitle(""); setPrice(""); setCurrency("USD"); setCustomCurrency(""); setDescription("");
  setCover(null); setPreview(""); setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
  fd.append("title", title);
  fd.append("price", price);
  fd.append("currency", currency === "Other" ? customCurrency : currency);
  fd.append("description", description);
  if (cover instanceof File) fd.append("image", cover);

      if (editingId) {
        await axios.put(`${VITE_VITE_API_URL}/api/collectibles/${editingId}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Collectible updated!");
      } else {
        await axios.post(`${VITE_VITE_API_URL}/api/collectibles`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Collectible added!");
      }
      resetForm();
      fetchData();
    } catch (err) {
      console.log(err);
      toast.error("Error saving collectible");
    }
  };

  const handleEdit = (item) => {
  setEditingId(item._id);
  setTitle(item.title || "");
  setPrice(item.price || "");
    if (item.currency === "SDG" || item.currency === "USD" || item.currency === "EGP") {
      setCurrency(item.currency);
      setCustomCurrency("");
    } else {
      setCurrency("Other");
      setCustomCurrency(item.currency || "");
    }
  setDescription(item.description || "");
  setPreview(item.image || "");
  setCover(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await axios.delete(`${VITE_VITE_API_URL}/api/collectibles/${deleteTarget}`);
      toast.success("Collectible deleted!");
      setCollectibles(prev => prev.filter(e => e._id !== deleteTarget));
    } catch (err) {
      console.log(err);
      toast.error("Error deleting collectible");
    } finally {
      setShowDeleteConfirm(false);
      setDeleteTarget(null);
    }
  };

  const filtered = collectibles.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageContainer>
      <LeftPanel>

        <FormWrapper onSubmit={handleSubmit}>
          <h3>{editingId ? "Edit Collectible" : "Add Collectible"}</h3>

          <InputBox>
            <input value={title} onChange={(e) => setTitle(e.target.value)} required />
            <span className={title ? "active" : ""}>Title</span>
          </InputBox>

          <InputBox>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
            <span className={price ? "active" : ""}>Price</span>
          </InputBox>
          <InputBox>
            <select value={currency} onChange={e => setCurrency(e.target.value)}>
              <option value="SDG">SDG </option>
              <option value="USD">USD </option>
              <option value="EGP">EGP </option>
              <option value="Other">Other</option>
            </select>
            <span className={currency ? "active" : ""}>Currency</span>
          </InputBox>
          {currency === "Other" && (
            <InputBox>
              <input value={customCurrency} onChange={e => setCustomCurrency(e.target.value)}  />
              <span className={customCurrency ? "active" : ""}>Custom Currency</span>
            </InputBox>
          )}

          <InputBox>
            <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
            <span className={description ? "active" : ""}>Description</span>
          </InputBox>

          <InputBox>
            <FormFileUpload image={cover} setImage={setCover} preview={preview} setPreview={setPreview} />
          </InputBox>

          <ActionButton type="submit">{editingId ? "Update" : "Add"}</ActionButton>
          {editingId && <ActionButton type="button" onClick={resetForm}>Cancel</ActionButton>}
        </FormWrapper>
      </LeftPanel>

      <RightPanel>
        <SearchBox>
          <input placeholder="Search by title..." value={search} onChange={e => setSearch(e.target.value)} />
        </SearchBox>

        <ExhibitionsTable>
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Price</th>
              <th>Currency</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(item => (
              <tr key={item._id}>
               <td>
                    <img
                    src={
                      item.image
                        ? item.image.startsWith("http")
                          ? item.image
                          : `${VITE_VITE_API_URL}/uploads/${item.image}`
                        : "https://via.placeholder.com/80"
                    }
                    alt={item.title}
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "6px",
                      objectFit: "cover",
                    }}
                  />

                  </td>



                <td>{item.title}</td>
                <td>{item.price || "—"}</td>
                <td>{item.currency || "—"}</td>
                <td>{item.description?.slice(0, 50) || "—"}</td>
                <td>
                  <ActionBtnGreen onClick={() => handleEdit(item)}>Edit</ActionBtnGreen>
                  <ActionBtnRed onClick={() => { setDeleteTarget(item._id); setShowDeleteConfirm(true); }}>Delete</ActionBtnRed>
                </td>
              </tr>
            ))}
          </tbody>
        </ExhibitionsTable>
      </RightPanel>

      {showDeleteConfirm && (
        <DeleteOverlay>
          <DeleteBox>
            <p>Are you sure you want to delete this collectible?</p>
            <div className="actions">
              <ActionBtnRed onClick={handleDelete}>Yes</ActionBtnRed>
              <ActionBtnGrey onClick={() => setShowDeleteConfirm(false)}>Cancel</ActionBtnGrey>
            </div>
          </DeleteBox>
        </DeleteOverlay>
      )}
    </PageContainer>
  );
};

// === Styled Components ===
const PageContainer = styled.div`display: flex; gap: 1rem; max-width: 1200px; margin: 2rem auto;`;
const LeftPanel = styled.div`flex: 1;`;
const RightPanel = styled.div`flex: 2;`;
const SearchBox = styled.div`margin-bottom: 1rem; input { width: 100%; padding: 8px; font-size: 1rem; }`;
const BackButton = styled.button`margin-bottom: 10px; padding: 8px 12px; background: #555; color: #fff; border: none; border-radius: 6px; cursor: pointer;`;
const FormWrapper = styled.form`background: #eee; padding: 1rem; border-radius: 10px; display: flex; flex-direction: column; gap: 1rem;`;
const InputBox = styled.div`position: relative; width: 100%; input, textarea, select { width: 100%; padding: 8px; border: none; border-bottom: 2px solid #616161; outline: none; } span { position: absolute; left: 0; top: 8px; font-size: 0.85em; color: #888; pointer-events: none; transition: 0.3s; } .active { top: -15px; font-size: 0.75em; color: #333; }`;
const ActionButton = styled.button`padding: 11px 135px; border-radius: 6px; border: none; cursor: pointer; background: #1f8b8d; color: #fff; margin-top: 5px;`;
const ExhibitionsTable = styled.table`width: 100%; border-collapse: collapse; td, th { border: 1px solid #ccc; padding: 8px; text-align: left; }`;
const ActionBtnGreen = styled.button`margin-right: 5px; background: #4caf50; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;`;
const ActionBtnRed = styled.button`margin-right: 5px; background: #e53935; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;`;
const ActionBtnGrey = styled.button`background: #888; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;`;
const DeleteOverlay = styled.div`position: fixed; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center;`;
const DeleteBox = styled.div`background: #fff; padding: 20px; border-radius: 8px; text-align: center;`;

export default CollectiblesAdmin;
