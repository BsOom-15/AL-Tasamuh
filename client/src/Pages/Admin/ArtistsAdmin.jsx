// src/Pages/Admin/ArtistsAdmin.jsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { toast } from "react-toastify";

const ArtistsAdmin = () => {

  const API_URL = import.meta.env.VITE_API_URL;
  
  const [artists, setArtists] = useState([]);
  const [allArtworks, setAllArtworks] = useState([]);
  const [allExhibitions, setAllExhibitions] = useState([]);
  const [search, setSearch] = useState("");

  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [nationality, setNationality] = useState("");
  const [bio, setBio] = useState("");
  const [featured, setFeatured] = useState(false);
  const [artworks, setArtworks] = useState([]);
  const [exhibitions, setExhibitions] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [showArtworkModal, setShowArtworkModal] = useState(false);
  const [showExhibitionModal, setShowExhibitionModal] = useState(false);

  const [showViewArtworksModal, setShowViewArtworksModal] = useState(false);
  const [showViewExhibitionsModal, setShowViewExhibitionsModal] = useState(false);
  const [viewArtworksModal, setViewArtworksModal] = useState([]);
  const [viewExhibitionsModal, setViewExhibitionsModal] = useState([]);

  // ===== Fetch Data =====
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [artistsRes, artworksRes, exhibitionsRes] = await Promise.all([
          axios.get(`${API_URL}/api/artists`),
          axios.get(`${API_URL}/api/artworks`),
          axios.get(`${API_URL}/api/exhibitions`),
        ]);

        // Debug
        console.log("artistsRes:", artistsRes.data);
        console.log("artworksRes:", artworksRes.data);
        console.log("exhibitionsRes:", exhibitionsRes.data);

        setArtists(Array.isArray(artistsRes.data) ? artistsRes.data : artistsRes.data.data || []);
        setAllArtworks(Array.isArray(artworksRes.data) ? artworksRes.data : artworksRes.data.data || []);
        setAllExhibitions(Array.isArray(exhibitionsRes.data) ? exhibitionsRes.data : exhibitionsRes.data.data || []);
      } catch (err) {
        console.log(err);
        toast.error("Error fetching data");
      }
    };
    fetchData();
  }, []);

  // ===== Reset =====
  const resetForm = () => {
    setName("");
    setBirthDate("");
    setNationality("");
    setBio("");
    setFeatured(false);
    setArtworks([]);
    setExhibitions([]);
    setEditingId(null);
  };

  // ===== Submit =====
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name,
        birthDate,
        nationality,
        bio,
        featured,
        artworks: artworks.map(id => String(id)),
        exhibitions: exhibitions.map(id => String(id)),
      };

      if (editingId) {
        await axios.put(`${API_URL}/api/artists/${editingId}`, payload);
        toast.success("Artist updated!");
      } else {
        await axios.post(`${API_URL}/api/artists/addArtist`, payload);
        toast.success("Artist added!");
      }

      resetForm();
      const res = await axios.get(`${API_URL}/api/artists`);
      setArtists(Array.isArray(res.data) ? res.data : res.data.data || []);
    } catch (err) {
      console.log(err);
      toast.error("Error saving artist");
    }
  };

  // ===== Edit =====
  const handleEdit = (artist) => {
    setEditingId(artist._id);
    setName(artist.name || "");
    setBirthDate(artist.birthDate ? artist.birthDate.split("T")[0] : "");
    setNationality(artist.nationality || "");
    setBio(artist.bio || "");
    setFeatured(artist.featured || false);

    setArtworks(artist.artworks?.map(a => (typeof a === "string" ? a : a._id)) || []);
    setExhibitions(artist.exhibitions?.map(e => (typeof e === "string" ? e : e._id)) || []);
  };

  // ===== Delete =====
  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await axios.delete(`${API_URL}/api/artists/${deleteTarget}`);
      toast.success("Artist deleted!");
      setArtists(prev => prev.filter(a => a._id !== deleteTarget));
    } catch (err) {
      console.log(err);
      toast.error("Error deleting artist");
    } finally {
      setShowDeleteConfirm(false);
      setDeleteTarget(null);
    }
  };

  // ===== Toggle =====
  const toggleArtwork = (id) => {
    setArtworks(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
  };
  const toggleExhibition = (id) => {
    setExhibitions(prev => prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]);
  };

  // ===== Search =====
  const filteredArtists = artists.filter(a =>
    a.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageContainer>
      {/* ==== LEFT FORM ==== */}
      <LeftPanel>
        <FormWrapper onSubmit={handleSubmit}>
          <h3>{editingId ? "Edit Artist" : "Add Artist"}</h3>

          <InputBox>
            <input value={name} onChange={(e) => setName(e.target.value)} required />
            <span className={name ? "active" : ""}>Name</span>
          </InputBox>

          <InputBox>
            <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
          </InputBox>

          <InputBox>
            <input value={nationality} onChange={(e) => setNationality(e.target.value)} />
            <span className={nationality ? "active" : ""}>Nationality</span>
          </InputBox>

          <InputBox>
            <textarea rows={3} value={bio} onChange={(e) => setBio(e.target.value)} />
            <span className={bio ? "active" : ""}>Bio</span>
          </InputBox>

          <CheckboxWrapper>
            <label>
              <input type="checkbox" checked={featured} onChange={e => setFeatured(e.target.checked)} />
              Featured Artist
            </label>
          </CheckboxWrapper>

          <FullWidthButton type="button" onClick={() => setShowArtworkModal(true)}>
            {editingId ? "Update Artworks" : "Select Artworks"}
          </FullWidthButton>

          <FullWidthButton type="button" onClick={() => setShowExhibitionModal(true)}>
            {editingId ? "Update Exhibitions" : "Select Exhibitions"}
          </FullWidthButton>

          <ActionButton type="submit">{editingId ? "Update" : "Add"}</ActionButton>
          {editingId && <ActionButton type="button" onClick={resetForm}>Cancel</ActionButton>}
        </FormWrapper>
      </LeftPanel>

      {/* ==== RIGHT TABLE ==== */}
      <RightPanel>
        <SearchBox>
          <input placeholder="Search by name..." value={search} onChange={e => setSearch(e.target.value)} />
        </SearchBox>

        <ArtistsTable>
          <thead>
            <tr>
              <th>Name</th>
              <th>Birth</th>
              <th>Nationality</th>
              <th>Featured</th>
              <th>Artworks</th>
              <th>Exhibitions</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredArtists.map(a => (
              <tr key={a._id}>
                <td>{a.name}</td>
                <td>{a.birthDate ? a.birthDate.split("T")[0] : "-"}</td>
                <td>{a.nationality || "-"}</td>
                <td>{a.featured ? "Yes" : "No"}</td>
                <td>
                  <ActionBtnGrey onClick={() => {
                    const selectedIds = (a.artworks || []).map(item =>
                      typeof item === "string" ? item : item._id
                    );
                    const found = allArtworks.filter(aw =>
                      selectedIds.some(id => String(id) === String(aw._id))
                    );
                    setViewArtworksModal(found);
                    setShowViewArtworksModal(true);
                  }}>View</ActionBtnGrey>
                </td>
                <td>
                  <ActionBtnGrey onClick={() => {
                    const selectedIds = (a.exhibitions || []).map(item =>
                      typeof item === "string" ? item : item._id
                    );
                    const found = allExhibitions.filter(ex =>
                      selectedIds.some(id => String(id) === String(ex._id))
                    );
                    setViewExhibitionsModal(found);
                    setShowViewExhibitionsModal(true);
                  }}>View</ActionBtnGrey>
                </td>
                <td>
                  <ActionBtnGreen onClick={() => handleEdit(a)}>Edit</ActionBtnGreen>
                  <ActionBtnRed onClick={() => { setDeleteTarget(a._id); setShowDeleteConfirm(true); }}>Delete</ActionBtnRed>
                </td>
              </tr>
            ))}
          </tbody>
        </ArtistsTable>
      </RightPanel>

      {/* ==== Delete Confirm ==== */}
      {showDeleteConfirm && (
        <DeleteOverlay>
          <DeleteBox>
            <p>Are you sure you want to delete this artist?</p>
            <div className="actions">
              <ActionBtnRed onClick={handleDelete}>Yes</ActionBtnRed>
              <ActionBtnGrey onClick={() => setShowDeleteConfirm(false)}>Cancel</ActionBtnGrey>
            </div>
          </DeleteBox>
        </DeleteOverlay>
      )}

      {/* ==== Artwork Modal ==== */}
      {showArtworkModal && (
        <ModalOverlay>
          <ModalBox>
            <h4>Select Artworks</h4>
            <div className="list">
              {allArtworks.map(a => (
                <label key={a._id}>
                  <input
                    type="checkbox"
                    checked={artworks.includes(a._id)}
                    onChange={() => toggleArtwork(a._id)}
                  />
                  {a.title}
                </label>
              ))}
            </div>
            <FullWidthButton onClick={() => setShowArtworkModal(false)}>Done</FullWidthButton>
          </ModalBox>
        </ModalOverlay>
      )}

      {/* ==== Exhibition Modal ==== */}
      {showExhibitionModal && (
        <ModalOverlay>
          <ModalBox>
            <h4>Select Exhibitions</h4>
            <div className="list">
              {allExhibitions.map(e => (
                <label key={e._id}>
                  <input
                    type="checkbox"
                    checked={exhibitions.includes(e._id)}
                    onChange={() => toggleExhibition(e._id)}
                  />
                  {e.title}
                </label>
              ))}
            </div>
            <FullWidthButton onClick={() => setShowExhibitionModal(false)}>Done</FullWidthButton>
          </ModalBox>
        </ModalOverlay>
      )}

      {/* ==== View Artworks Modal ==== */}
      {showViewArtworksModal && (
        <ModalOverlay>
          <ModalBox>
            <h4>Artworks</h4>
            <CardsWrapper>
              {viewArtworksModal.length > 0 ? viewArtworksModal.map(a => (
                <Card key={a._id}>
                  <img src={a.image || "https://via.placeholder.com/120"} alt={a.title} />
                  <span>{a.title}</span>
                </Card>
              )) : <p>No artworks found.</p>}
            </CardsWrapper>
            <FullWidthButton onClick={() => setShowViewArtworksModal(false)}>Close</FullWidthButton>
          </ModalBox>
        </ModalOverlay>
      )}

      {/* ==== View Exhibitions Modal ==== */}
      {showViewExhibitionsModal && (
        <ModalOverlay>
          <ModalBox>
            <h4>Exhibitions</h4>
            <CardsWrapper>
              {viewExhibitionsModal.length > 0 ? viewExhibitionsModal.map(e => (
                <Card key={e._id}>
                  <img src={e.cover || "https://via.placeholder.com/120"} alt={e.title} />
                  <span>{e.title}</span>
                </Card>
              )) : <p>No exhibitions found.</p>}
            </CardsWrapper>
            <FullWidthButton onClick={() => setShowViewExhibitionsModal(false)}>Close</FullWidthButton>
          </ModalBox>
        </ModalOverlay>
      )}
    </PageContainer>
  );
};

// === Styled Components ===
const PageContainer = styled.div`display:flex; gap:1rem; max-width:1200px; margin:2rem auto;`;
const LeftPanel = styled.div`flex:1;`;
const RightPanel = styled.div`flex:2;`;
const SearchBox = styled.div`margin-bottom:1rem; input{width:100%;padding:8px;font-size:1rem;}`;
const FormWrapper = styled.form`background:#eee; padding:1rem; border-radius:10px; display:flex; flex-direction:column; gap:1rem;`;
const InputBox = styled.div`position:relative;width:100%;
  input, textarea{width:100%;padding:8px;border:none;border-bottom:2px solid #616161;outline:none;}
  span{position:absolute;left:0;top:8px;font-size:0.85em;color:#888;pointer-events:none;transition:0.3s;}
  .active{top:-15px;font-size:0.75em;color:#333;}
`;
const CheckboxWrapper = styled.div`font-size:0.9em;`;
const ActionButton = styled.button`padding:11px 135px; border-radius:6px; border:none; cursor:pointer; background:#1f8b8d; color:#fff; margin-top:5px;`;
const FullWidthButton = styled.button`width:100%; padding:10px; border-radius:6px; border:none; cursor:pointer; background:#1f8b8d; color:#fff; margin-top:5px;`;
const ArtistsTable = styled.table`width:100%; border-collapse:collapse;
  th, td{border:1px solid #ccc; padding:8px; text-align:left;}
  th{background:#f5f5f5;}
`;
const ActionBtnGreen = styled.button`background:#4caf50; color:#fff; margin-right:5px; padding:6px 12px; border-radius:6px; border:none; cursor:pointer;`;
const ActionBtnRed = styled.button`background:#f44336; color:#fff; margin-right:5px; padding:6px 12px; border-radius:6px; border:none; cursor:pointer;`;
const ActionBtnGrey = styled.button`background:#6c757d; color:#fff; margin-right:5px; padding:6px 12px; border-radius:6px; border:none; cursor:pointer;`;
const ModalOverlay = styled.div`position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,0.6); display:flex; justify-content:center; align-items:center; z-index:1000;`;
const ModalBox = styled.div`background:#fff; padding:20px; border-radius:10px; max-height:80vh; overflow-y:auto; width:400px; display:flex; flex-direction:column; gap:10px; .list{display:flex;flex-direction:column;gap:5px;}`;
const CardsWrapper = styled.div`display:grid; grid-template-columns:repeat(auto-fill,minmax(120px,1fr)); gap:10px;`;
const Card = styled.div`display:flex; flex-direction:column; align-items:center;
  img{width:100px; height:100px; object-fit:cover; border-radius:6px; margin-bottom:5px;}
  span{text-align:center; font-size:0.8em;}
`;
const DeleteOverlay = styled(ModalOverlay)``;
const DeleteBox = styled.div`background:#fff; padding:20px; border-radius:10px; text-align:center; p{margin-bottom:15px;} .actions{display:flex; justify-content:center; gap:10px;}`;

export default ArtistsAdmin;
