// src/Pages/Admin/OpeningNightAdmin.jsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { toast } from "react-toastify";

const OpeningNightAdmin = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [nights, setNights] = useState([]);
  const [name, setName] = useState("");
  const [images, setImages] = useState([]); // صور جديدة
  const [preview, setPreview] = useState([]); // معاينة صور جديدة
  const [oldImages, setOldImages] = useState([]); // صور قديمة من السيرفر
  const [editingId, setEditingId] = useState(null);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    fetchNights();
  }, []);

  const fetchNights = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/opening-night`);
      setNights(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (err) {
      console.log(err);
      toast.error("Error fetching Opening Nights");
    }
  };

  const resetForm = () => {
    setName("");
    setImages([]);
    setPreview([]);
    setOldImages([]);
    setEditingId(null);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
    setPreview((prev) => [...prev, ...files.map((file) => URL.createObjectURL(file))]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);

      // صور جديدة
      images.forEach((file) => formData.append("images", file));

      // صور قديمة (لو في تعديل)
      if (editingId) {
        oldImages.forEach((img) => formData.append("oldImages", img));
        await axios.put(`${API_URL}/api/opening-night/${editingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Opening Night updated!");
      } else {
        await axios.post(`${API_URL}/api/opening-night`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Opening Night added!");
      }

      resetForm();
      fetchNights();
    } catch (err) {
      console.log(err);
      toast.error("Error saving Opening Night");
    }
  };

  const handleEdit = (night) => {
    setEditingId(night._id);
    setName(night.name);
    setOldImages(night.images); // الصور القديمة
    setPreview([]);
    setImages([]);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await axios.delete(`${API_URL}/api/opening-night/${deleteTarget}`);
      toast.success("Opening Night deleted!");
      setNights((prev) => prev.filter((n) => n._id !== deleteTarget));
    } catch (err) {
      console.log(err);
      toast.error("Error deleting Opening Night");
    } finally {
      setShowDeleteConfirm(false);
      setDeleteTarget(null);
    }
  };

  return (
    <PageContainer>
      {/* Left Form */}
      <LeftPanel>
        <FormWrapper onSubmit={handleSubmit}>
          <h3>{editingId ? "Edit Opening Night" : "Add Opening Night"}</h3>

          <InputBox>
            <input value={name} onChange={(e) => setName(e.target.value)} required />
            <span className={name ? "active" : ""}>Name</span>
          </InputBox>

          <InputBox>
            <FileUploadLabel htmlFor="fileUpload">Choose Images</FileUploadLabel>
            <HiddenFileInput
              id="fileUpload"
              type="file"
              multiple
              onChange={handleFileChange}
            />
          </InputBox>

          {/* صور قديمة */}
          {oldImages.length > 0 && (
            <PreviewGrid>
              {oldImages.map((img, idx) => (
                <div key={idx} style={{ position: "relative" }}>
                  <img src={`${API_URL}/uploads/${img}`} alt="old" />
                  <button
                    type="button"
                    onClick={() =>
                      setOldImages(oldImages.filter((_, i) => i !== idx))
                    }
                    style={deleteBtnStyle}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </PreviewGrid>
          )}

          {/* صور جديدة */}
          {preview.length > 0 && (
            <PreviewGrid>
              {preview.map((src, idx) => (
                <div key={idx} style={{ position: "relative" }}>
                  <img src={src} alt="preview" />
                  <button
                    type="button"
                    onClick={() => {
                      setPreview(preview.filter((_, i) => i !== idx));
                      setImages(images.filter((_, i) => i !== idx));
                    }}
                    style={deleteBtnStyle}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </PreviewGrid>
          )}

          <ActionButton type="submit">{editingId ? "Update" : "Add"}</ActionButton>
          {editingId && (
            <ActionButton type="button" onClick={resetForm}>
              Cancel
            </ActionButton>
          )}
        </FormWrapper>
      </LeftPanel>

      {/* Right Table */}
      <RightPanel>
        <TableWrapper>
          <OpeningNightTable>
            <thead>
              <tr>
                <th>Name</th>
                <th>Images</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {nights.map((n) => (
                <tr key={n._id}>
                  <td>{n.name}</td>
                  <td>
                    <ImageList>
                      {n.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={`${API_URL}/uploads/${img}`}
                          alt="night"
                        />
                      ))}
                    </ImageList>
                  </td>
                  <td>
                    <ActionBtnGreen onClick={() => handleEdit(n)}>Edit</ActionBtnGreen>
                    <ActionBtnRed
                      onClick={() => {
                        setDeleteTarget(n._id);
                        setShowDeleteConfirm(true);
                      }}
                    >
                      Delete
                    </ActionBtnRed>
                  </td>
                </tr>
              ))}
            </tbody>
          </OpeningNightTable>
        </TableWrapper>
      </RightPanel>

      {/* Delete Modal */}
      {showDeleteConfirm && (
        <DeleteOverlay>
          <DeleteBox>
            <p>Are you sure you want to delete this Opening Night?</p>
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
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 1200px;
  margin: 2rem auto;
  padding: 1rem;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;
const LeftPanel = styled.div`flex: 1;`;
const RightPanel = styled.div`flex: 2; overflow-x: auto;`;
const FormWrapper = styled.form`
  background: #eee;
  padding: 1rem;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
const InputBox = styled.div`
  position: relative;
  width: 100%;
  input {
    width: 100%;
    padding: 8px;
    border: none;
    border-bottom: 2px solid #616161;
    outline: none;
  }
  span {
    position: absolute;
    left: 0;
    top: 8px;
    font-size: 0.85em;
    color: #888;
    pointer-events: none;
    transition: 0.3s;
  }
  .active {
    top: -15px;
    font-size: 0.75em;
    color: #333;
  }
`;
const FileUploadLabel = styled.label`
  display: inline-block;
  padding: 10px 15px;
  background: #1f8b8d;
  color: #fff;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  &:hover {
    background: #166768;
  }
`;
const HiddenFileInput = styled.input`display: none;`;
const PreviewGrid = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;
  img {
    width: 60px;
    height: 60px;
    border-radius: 6px;
    object-fit: cover;
  }
`;
const deleteBtnStyle = {
  position: "absolute",
  top: 0,
  right: 0,
  background: "red",
  color: "white",
  border: "none",
  borderRadius: "50%",
  width: "20px",
  height: "20px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
};
const ActionButton = styled.button`
  padding: 11px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  background: #1f8b8d;
  color: #fff;
`;
const TableWrapper = styled.div`overflow-x: auto;`;
const OpeningNightTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  th, td {
    border: 1px solid #ccc;
    padding: 8px;
    text-align: left;
    vertical-align: middle;
  }
  th { background: #f5f5f5; }
`;
const ImageList = styled.div`
  display: flex;
  gap: 0.25rem;
  flex-wrap: wrap;
  img {
    width: 40px;
    height: 40px;
    border-radius: 6px;
    object-fit: cover;
  }
`;
const ActionBtnGreen = styled.button`background: #4caf50; color: #fff; margin-right: 5px; padding: 6px 12px; border-radius: 6px; border: none; cursor: pointer;`;
const ActionBtnRed = styled.button`background: #f44336; color: #fff; margin-right: 5px; padding: 6px 12px; border-radius: 6px; border: none; cursor: pointer;`;
const ActionBtnGrey = styled.button`background: #6c757d; color: #fff; padding: 6px 12px; border-radius: 6px; border: none; cursor: pointer;`;
const DeleteOverlay = styled.div`position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 999;`;
const DeleteBox = styled.div`
  background: #fff;
  padding: 2rem;
  border-radius: 10px;
  text-align: center;
  .actions { margin-top: 1rem; display: flex; justify-content: center; gap: 1rem; }
`;

export default OpeningNightAdmin;
