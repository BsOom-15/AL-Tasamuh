// src/Components/Modal/AboutItemModal.jsx
import React from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import FormFileUpload from "../Modal/FileUploadForm";

const AboutItemModal = ({ type, data, setData, onSave, onClose }) => {
  const updateField = (field, value) => setData(prev => ({ ...prev, [field]: value }));

  const addGalleryImage = () => {
    if (!data._newImage) return toast.warn("Image URL required");
    const images = [...(data.images || []), data._newImage];
    updateField("images", images);
    updateField("_newImage", "");
  };

  const removeGalleryImage = (idx) => {
    const images = (data.images || []).filter((_, i) => i !== idx);
    updateField("images", images);
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalBox onClick={e => e.stopPropagation()}>
        <h4>Edit {type}</h4>

        {type === "section" && (
          <>
            <InputBox>
              <input value={data.title || ""} onChange={e => updateField("title", e.target.value)} />
              <span className={data.title ? "active" : ""}>Title</span>
            </InputBox>
            <InputBox>
              <textarea rows={4} value={data.content || ""} onChange={e => updateField("content", e.target.value)} />
              <span className={data.content ? "active" : ""}>Content</span>
            </InputBox>
          </>
        )}

        {type === "gallery" && (
          <>
            <InputBox>
              <input value={data.name || ""} onChange={e => updateField("name", e.target.value)} />
              <span className={data.name ? "active" : ""}>Gallery name</span>
            </InputBox>

            <InputBox>
              <input placeholder="Add image URL" value={data._newImage || ""} onChange={e => updateField("_newImage", e.target.value)} />
              <SmallButton onClick={addGalleryImage}>Add</SmallButton>
            </InputBox>

            <ImagesPreview>
              {(data.images || []).map((img, idx) => (
                <ImageThumb key={idx}>
                  <img src={img} alt={`g-${idx}`} onError={e=>e.currentTarget.src="/default-archive.jpg"} />
                  <SmallBtnX onClick={() => removeGalleryImage(idx)}>x</SmallBtnX>
                </ImageThumb>
              ))}
            </ImagesPreview>
          </>
        )}

        {type === "founder" && (
          <>
            <InputBox>
              <input value={data.name || ""} onChange={e => updateField("name", e.target.value)} />
              <span className={data.name ? "active" : ""}>Name</span>
            </InputBox>
            <InputBox>
              <input value={data.title || ""} onChange={e => updateField("title", e.target.value)} />
              <span className={data.title ? "active" : ""}>Title</span>
            </InputBox>
            <InputBox>
              <textarea rows={3} value={data.description || ""} onChange={e => updateField("description", e.target.value)} />
              <span className={data.description ? "active" : ""}>Description</span>
            </InputBox>
            <FormFileUpload image={data.image || ""} setImage={file => updateField("image", file)} />
          </>
        )}

        {type === "quote" && (
          <>
            <InputBox>
              <input value={data.text || ""} onChange={e => updateField("text", e.target.value)} />
              <span className={data.text ? "active" : ""}>Quote Text</span>
            </InputBox>
            <InputBox>
              <input value={data.author || ""} onChange={e => updateField("author", e.target.value)} />
              <span className={data.author ? "active" : ""}>Author</span>
            </InputBox>
            <FormFileUpload image={data.backgroundImage || ""} setImage={file => updateField("backgroundImage", file)} />
          </>
        )}

        <ModalActions>
          <FullWidthButton onClick={onSave}>Save</FullWidthButton>
          <FullWidthButton variant="grey" onClick={onClose}>Cancel</FullWidthButton>
        </ModalActions>
      </ModalBox>
    </ModalOverlay>
  );
};

// ========== Styled Components ==========
const ModalOverlay = styled.div`
  position: fixed; top:0; left:0; right:0; bottom:0;
  background: rgba(0,0,0,0.5);
  display:flex; justify-content:center; align-items:center;
  z-index:1000;
`;
const ModalBox = styled.div`
  background:#fff; padding:20px; border-radius:10px;
  max-width:500px; width:100%;
`;
const InputBox = styled.div`
  position: relative; margin-bottom: 10px;
  input, textarea { width: 100%; padding: 8px; border: none; border-bottom: 2px solid #616161; outline: none; resize: vertical; }
  span { position: absolute; left: 6px; top: 8px; font-size: 0.85em; color: #888; pointer-events: none; transition: 0.2s; }
  .active { top: -14px; font-size: 0.75em; color: #333; }
`;
const SmallButton = styled.button`
  padding:6px 10px; border-radius:6px; border:none; background:#1f8b8d; color:#fff; cursor:pointer; margin-left:8px;
`;
const ImagesPreview = styled.div`display:flex; gap:8px; flex-wrap:wrap; margin:6px 0;`;
const ImageThumb = styled.div`
  position:relative; width:80px; height:60px;
  img{ width:100%; height:100%; object-fit:cover; border-radius:6px; }
`;
const SmallBtnX = styled.button`
  position:absolute; top:-6px; right:-6px; background:#f44336;
  border:none; color:white; border-radius:50%;
  width:20px; height:20px; cursor:pointer;
`;
const ModalActions = styled.div`margin-top: 20px; display:flex; flex-direction:column; gap:10px;`;
const FullWidthButton = styled.button`
  width:100%; padding:10px; border:none; border-radius:6px; cursor:pointer;
  background:${p => p.variant === "grey" ? "#aaa" : "#1f8b8d"}; color:#fff;
`;

export default AboutItemModal;
