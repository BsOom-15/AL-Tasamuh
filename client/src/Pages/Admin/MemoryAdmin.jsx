// src/Pages/Admin/MemoryAdmin.jsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import FormFileUpload from "../../Components/Modal/FileUploadForm";


const MemoryAdmin = () => {

  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [allArtists, setAllArtists] = useState([]);
  const [allExhibitions, setAllExhibitions] = useState([]);
  const [search, setSearch] = useState("");

  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [year, setYear] = useState(""); // we'll use date input; store full date/string
  const [medium, setMedium] = useState("");
  const [dimensions, setDimensions] = useState("");
  const [available, setAvailable] = useState(true);
  const [artist, setArtist] = useState("");
  const [exhibition, setExhibition] = useState("");
  const [image, setImage] = useState(null); // should be File when uploading
  const [preview, setPreview] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // helper: normalize image URL for display
  const getImageUrl = (src) => {
    if (!src) return null;
    // already absolute
    if (typeof src !== "string") return null;
    if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("data:")) return src;
    // case: '/uploads/filename.jpg' => API_URL + src
    if (src.startsWith("/uploads")) return `${API_URL}${src}`;
    // case: '/filename.jpg' (backend sometimes saves '/filename') => API_URL + '/uploads/filename'
    if (src.startsWith("/")) {
      const filename = src.replace(/^\//, "");
      return `${API_URL}/uploads/${filename}`;
    }
    // otherwise return as is (could be relative path already correct)
    return src;
  };

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemsRes, artistsRes, exhibitionsRes] = await Promise.all([
          axios.get(`${API_URL}/api/memory-items`),
          axios.get(`${API_URL}/api/artists`),
          axios.get(`${API_URL}/api/exhibitions`),
        ]);

        // itemsRes expected shape: { data: items }
        setItems(Array.isArray(itemsRes.data?.data) ? itemsRes.data.data : []);
        setAllArtists(Array.isArray(artistsRes.data) ? artistsRes.data : []);
        setAllExhibitions(Array.isArray(exhibitionsRes.data?.data) ? exhibitionsRes.data.data : []);
      } catch (err) {
        console.error("fetch memory items error:", err);
        toast.error("Error fetching memory items");
      }
    };
    fetchData();
  }, []);

  const resetForm = () => {
    setTitle(""); setType(""); setCategory("");
    setYear(""); setMedium(""); setDimensions("");
    setAvailable(true); setArtist(""); setExhibition("");
    setImage(null); setPreview(""); setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !type) {
      toast.error("Title and Type are required");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("type", type);
      formData.append("category", category);
      // send year as-is (could be 'YYYY' or full date 'YYYY-MM-DD')
      formData.append("year", year || "");
      formData.append("medium", medium);
      formData.append("dimensions", dimensions);
      // backend expects string 'true' / 'false' sometimes
      formData.append("available", status ? "true" : "false");
      if (artist) formData.append("artist", artist);
      if (exhibition) formData.append("exhibition", exhibition);
      if (image instanceof File) formData.append("image", image);

      if (editingId) {
        await axios.put(`${API_URL}/api/memory-items/${editingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Memory item updated!");
      } else {
        await axios.post(`${API_URL}/api/memory-items`, formData, {
  headers: { "Content-Type": "multipart/form-data" },
});

        toast.success("Memory item added!");
      }

      // refresh list
      const res = await axios.get(`${API_URL}/api/memory-items`);
      setItems(Array.isArray(res.data?.data) ? res.data.data : []);
      resetForm();
    } catch (err) {
      console.error("save memory item", err.response || err);
      const msg = err.response?.data?.message || err.message || "Error saving memory item";
      toast.error(msg);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setTitle(item.title || "");
    setType(item.type || "");
    setCategory(item.category || "");
    setYear(item.year || ""); // if the stored value is a date string, it's OK
    setMedium(item.medium || "");
    setDimensions(item.dimensions || "");
    setAvailable(item.status ?? true);
    setArtist(item.artist?._id || (typeof item.artist === "string" ? item.artist : ""));
    setExhibition(item.exhibition?._id || (typeof item.exhibition === "string" ? item.exhibition : ""));
    setImage(null);
    setPreview(item.image ? getImageUrl(item.image) : "");
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await axios.delete(`${API_URL}/api/memory-items/${deleteTarget}`);
      setItems(prev => prev.filter(i => i._id !== deleteTarget));
      toast.success("Memory item deleted!");
    } catch (err) {
      console.error("delete memory item", err);
      toast.error("Error deleting memory item");
    } finally {
      setShowDeleteConfirm(false);
      setDeleteTarget(null);
    }
  };

  const filteredItems = items.filter((i) =>
    (i.title || "").toLowerCase().includes(search.toLowerCase())
  );

  // helper to display year from stored year/date
  const displayYear = (val) => {
    if (!val) return "N/A";
    // if val like "2024-05-01" or "2024-05" -> try to parse year
    if (/\d{4}-\d{2}-\d{2}/.test(val) || /\d{4}-\d{2}/.test(val)) {
      try {
        const d = new Date(val);
        if (!isNaN(d.getFullYear())) return d.getFullYear();
      } catch (e) {}
    }
    // if just '2024' return it
    if (/^\d{4}$/.test(val)) return val;
    // fallback
    return val;
  };

  return (
    <PageContainer>
      <LeftPanel>

        <FormWrapper onSubmit={handleSubmit}>
          <h3>{editingId ? "Edit Memory Item" : "Add Memory Item"}</h3>

          <InputBox>
            <input value={title} onChange={(e) => setTitle(e.target.value)} required />
            <span className={title ? "active" : ""}>Title</span>
          </InputBox>

          <InputBox>
            <select value={type} onChange={(e) => setType(e.target.value)} required>
              <option value="">Select Type</option>
              <option value="artist">Artist</option>
              <option value="artwork">Artwork</option>
              <option value="exhibition">Exhibition</option>
              <option value="card">Card</option>
            </select>
          </InputBox>

          <InputBox>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">Select Category</option>
              <option value="summer">Summer</option>
              <option value="winter">Winter</option>
              <option value="autumn">Autumn</option>
              <option value="spring">Spring</option>
            </select>
          </InputBox>

          {/* date input for year (shows calendar); we display only year in table */}
          <InputBox>
            <input
              type="date"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              aria-label="Year (pick a date, year will be shown)"
            />
            <span className={year ? "active" : ""}>Year</span>
          </InputBox>

          <InputBox>
            <input value={medium} onChange={(e) => setMedium(e.target.value)} />
            <span className={medium ? "active" : ""}>Medium</span>
          </InputBox>

          <InputBox>
            <input value={dimensions} onChange={(e) => setDimensions(e.target.value)} />
            <span className={dimensions ? "active" : ""}>Dimensions</span>
          </InputBox>

          <InputBox>
            <CheckboxLabel>
              <input
                type="checkbox"
                checked={available}
                onChange={(e) => setAvailable(e.target.checked)}
              />
              <span>Available</span>
            </CheckboxLabel>
          </InputBox>

          <InputBox>
            <select value={artist} onChange={(e) => setArtist(e.target.value)}>
              <option value="">Select Artist</option>
              {allArtists.map(ar => <option key={ar._id} value={ar._id}>{ar.name}</option>)}
            </select>
          </InputBox>

          <InputBox>
            <select value={exhibition} onChange={(e) => setExhibition(e.target.value)}>
              <option value="">Select Exhibition</option>
              {allExhibitions.map(ex => <option key={ex._id} value={ex._id}>{ex.title}</option>)}
            </select>
          </InputBox>

          <InputBox>
            <FormFileUpload
              image={image}
              setImage={(fileOrUrl) => {
                // FormFileUpload might give File or data-url or plain URL
                setImage(fileOrUrl);
                // if it gives a preview URL (string), set preview
                if (typeof fileOrUrl === "string") setPreview(fileOrUrl);
                else setPreview("");
              }}
              preview={preview}
              setPreview={setPreview}
            />
          </InputBox>

          <ActionButton type="submit">{editingId ? "Update" : "Add"}</ActionButton>
          {editingId && <ActionButton type="button" onClick={resetForm}>Cancel</ActionButton>}
        </FormWrapper>
      </LeftPanel>

      <RightPanel>
        <SearchBox>
          <input placeholder="Search by title..." value={search} onChange={e => setSearch(e.target.value)} />
        </SearchBox>

        <ItemsTable>
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Type</th>
              <th>Artist</th>
              <th>Exhibition</th>
              <th>Year</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map(i => (
              <tr key={i._id}>
                <td>
                  <img
                    src={getImageUrl(i.image) || "https://via.placeholder.com/80"}
                    alt={i.title}
                    style={{ width: "60px", height: "60px", borderRadius: "6px", objectFit: "cover" }}
                  />
                </td>
                <td>{i.title}</td>
                <td>{i.type}</td>
                <td>{i.artist?.name || "N/A"}</td>
                <td>{i.exhibition?.title || "N/A"}</td>
                <td>{displayYear(i.year)}</td>
                <td>
                  <ActionBtnGreen onClick={() => handleEdit(i)}>Edit</ActionBtnGreen>
                  <ActionBtnRed onClick={() => { setDeleteTarget(i._id); setShowDeleteConfirm(true); }}>Delete</ActionBtnRed>
                </td>
              </tr>
            ))}
          </tbody>
        </ItemsTable>
      </RightPanel>

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <DeleteOverlay>
          <DeleteBox>
            <p>Are you sure you want to delete this item?</p>
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
const CheckboxLabel = styled.label`display: flex; align-items: center; gap: 8px; font-size: 0.95rem; color: #333;`;
const ActionButton = styled.button`padding: 11px 135px; border-radius: 6px; border: none; cursor: pointer; background: #1f8b8d; color: #fff; margin-top: 5px;`;
const ItemsTable = styled.table`width: 100%; border-collapse: collapse; th, td { padding: 8px; border-bottom: 1px solid #ddd; text-align: left; } img { display: block; }`;
const ActionBtnGreen = styled.button`background: #28a745; color: white; padding: 6px 10px; margin-right: 5px; border: none; border-radius: 6px; cursor: pointer;`;
const ActionBtnRed = styled.button`background: #dc3545; color: white; padding: 6px 10px; margin-right: 5px; border: none; border-radius: 6px; cursor: pointer;`;
const ActionBtnGrey = styled.button`background: grey; color: white; padding: 6px 10px; border: none; border-radius: 6px; cursor: pointer;`;
const DeleteOverlay = styled.div`position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center;`;
const DeleteBox = styled.div`background: white; padding: 20px; border-radius: 8px; text-align: center;`;

export default MemoryAdmin;
