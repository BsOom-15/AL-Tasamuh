// src/Pages/Admin/ArchiveAdmin.jsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import FormFileUpload from "../../Components/Modal/FileUploadForm";

const ArchiveAdmin = () => {

  const API_URL = import.meta.env.VITE_API_URL;
  
  const navigate = useNavigate();

  const [archiveItems, setArchiveItems] = useState([]);
  const [search, setSearch] = useState("");

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [currency, setCurrency] = useState("USD");
  const [sku, setSku] = useState("");
  const [stock, setStock] = useState(0);
  const [available, setAvailable] = useState(true);
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/archive`);
        setArchiveItems(Array.isArray(res.data.data) ? res.data.data : []);
      } catch (err) {
        console.log(err);
        toast.error("Error fetching archive items");
      }
    };
    fetchData();
  }, []);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPrice(0);
    setCurrency("USD");
    setSku("");
    setStock(0);
    setAvailable(true);
    setCategory("");
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
      formData.append("price", price);
      formData.append("currency", currency);
      formData.append("sku", sku);
      formData.append("stock", stock);
      formData.append("available", available);
      formData.append("category", category);
      if (image instanceof File) formData.append("image", image);

      if (editingId) {
        await axios.put(`${API_URL}/api/archive/${editingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Archive item updated!");
      } else {
        await axios.post(`${API_URL}/api/archive`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Archive item added!");
      }

      resetForm();
      const res = await axios.get(`${API_URL}/api/archive`);
      setArchiveItems(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (err) {
      console.log(err);
      toast.error("Error saving archive item");
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setTitle(item.title || "");
    setDescription(item.description || "");
    setPrice(item.price || 0);
    setCurrency(item.currency || "USD");
    setSku(item.sku || "");
    setStock(item.stock || 0);
    setAvailable(item.status ?? true);
    setCategory(item.category || "");
    setImage(null);
    setPreview(item.image || "");
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await axios.delete(`${API_URL}/api/archive/${deleteTarget}`);
      toast.success("Archive item deleted!");
      setArchiveItems(prev => prev.filter(i => i._id !== deleteTarget));
    } catch (err) {
      console.log(err);
      toast.error("Error deleting archive item");
    } finally {
      setShowDeleteConfirm(false);
      setDeleteTarget(null);
    }
  };

  const filteredItems = archiveItems.filter((i) =>
    i.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageContainer>
      <LeftPanel>
        <FormWrapper onSubmit={handleSubmit}>
          <h3>{editingId ? "Edit Archive Item" : "Add Archive Item"}</h3>

          <InputBox>
            <input value={title} onChange={(e) => setTitle(e.target.value)} required />
            <span className={title ? "active" : ""}>Title</span>
          </InputBox>

          <InputBox>
            <textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
            <span className={description ? "active" : ""}>Description</span>
          </InputBox>

          <InputBox>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
            <span className={price ? "active" : ""}>Price</span>
          </InputBox>

          <InputBox>
            <input value={currency} onChange={(e) => setCurrency(e.target.value)} />
            <span className={currency ? "active" : ""}>Currency</span>
          </InputBox>

          <InputBox>
            <input value={sku} onChange={(e) => setSku(e.target.value)} />
            <span className={sku ? "active" : ""}>SKU</span>
          </InputBox>

          <InputBox>
            <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} />
            <span className={stock ? "active" : ""}>Stock</span>
          </InputBox>

          <InputBox>
            <select value={available} onChange={(e) => setAvailable(e.target.value === "true")}>
              <option value="true">Available</option>
              <option value="false">Unavailable</option>
            </select>
          </InputBox>

          <InputBox>
            <input value={category} onChange={(e) => setCategory(e.target.value)} />
            <span className={category ? "active" : ""}>Category</span>
          </InputBox>

          <InputBox>
            <FormFileUpload image={image} setImage={setImage} preview={preview} setPreview={setPreview} />
          </InputBox>

          <ActionButton type="submit">{editingId ? "Update" : "Add"}</ActionButton>
          {editingId && <ActionButton type="button" onClick={resetForm}>Cancel</ActionButton>}
        </FormWrapper>
      </LeftPanel>

      <RightPanel>
        <SearchBox>
          <input placeholder="Search by title..." value={search} onChange={e => setSearch(e.target.value)} />
        </SearchBox>

        <ArchiveTable>
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Available</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map(i => (
              <tr key={i._id}>
                <td><img src={i.image || "https://via.placeholder.com/80"} alt={i.title} style={{ width: "60px", height: "60px", borderRadius: "6px", objectFit: "cover" }} /></td>
                <td>{i.title}</td>
                <td>{i.price} {i.currency}</td>
                <td>{i.stock}</td>
                <td>{i.status ? "Yes" : "No"}</td>
                <td>{i.category || "N/A"}</td>
                <td>
                  <ActionBtnGreen onClick={() => handleEdit(i)}>Edit</ActionBtnGreen>
                  <ActionBtnRed onClick={() => { setDeleteTarget(i._id); setShowDeleteConfirm(true); }}>Delete</ActionBtnRed>
                </td>
              </tr>
            ))}
          </tbody>
        </ArchiveTable>
      </RightPanel>

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <DeleteOverlay>
          <DeleteBox>
            <p>Are you sure you want to delete this archive item?</p>
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
const ArchiveTable = styled.table`width: 100%; border-collapse: collapse; th, td { border: 1px solid #ccc; padding: 8px; text-align: left; } th { background: #f5f5f5; }`;
const ActionBtnGreen = styled.button`background: #4caf50; color: #fff; margin-right: 5px; padding: 6px 12px; border-radius: 6px; border: none; cursor: pointer;`;
const ActionBtnRed = styled.button`background: #f44336; color: #fff; margin-right: 5px; padding: 6px 12px; border-radius: 6px; border: none; cursor: pointer;`;
const ActionBtnGrey = styled.button`background: #6c757d; color: #fff; padding: 6px 12px; border-radius: 6px; border: none; cursor: pointer;`;
const DeleteOverlay = styled.div`position: fixed; top: 0; left:0; right:0; bottom:0; background: rgba(0,0,0,0.6); display: flex; justify-content: center; align-items: center; z-index: 1000;`;
const DeleteBox = styled.div`background: #fff; padding: 20px; border-radius: 10px; text-align: center; p { margin-bottom: 15px; } .actions { display: flex; justify-content: center; gap: 10px; }`;

export default ArchiveAdmin;
