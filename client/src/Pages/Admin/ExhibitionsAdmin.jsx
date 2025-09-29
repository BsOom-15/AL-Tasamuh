// src/Pages/Admin/ExhibitionsAdmin.jsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import FormFileUpload from "../../Components/Modal/FileUploadForm";
import { VITE_VITE_API_URL } from "../../../config";

const ExhibitionsAdmin = () => {
  const navigate = useNavigate();

  const [exhibitions, setExhibitions] = useState([]);
  const [allArtists, setAllArtists] = useState([]);
  const [allWorks, setAllWorks] = useState([]);
  const [filteredWorks, setFilteredWorks] = useState([]);
  const [search, setSearch] = useState("");

  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [artists, setArtists] = useState([]);
  const [date, setDate] = useState("");
  const [overview, setOverview] = useState("");
  const [description, setDescription] = useState("");
  const [works, setWorks] = useState([]);
  const [press, setPress] = useState([]);
  const [pressInput, setPressInput] = useState("");
  const [cover, setCover] = useState(null);
  const [preview, setPreview] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showArtistsModal, setShowArtistsModal] = useState(false);
  const [showWorksModal, setShowWorksModal] = useState(false);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [exRes, artistsRes, worksRes] = await Promise.all([
          axios.get(`${VITE_VITE_API_URL}/api/exhibitions`),
          axios.get(`${VITE_VITE_API_URL}/api/artists`),
          axios.get(`${VITE_VITE_API_URL}/api/artworks`),
        ]);
        setExhibitions(Array.isArray(exRes.data.data) ? exRes.data.data : []);
        setAllArtists(Array.isArray(artistsRes.data) ? artistsRes.data : []);
        setAllWorks(Array.isArray(worksRes.data.data) ? worksRes.data.data : []);
        setFilteredWorks(Array.isArray(worksRes.data.data) ? worksRes.data.data : []);
      } catch (err) {
        console.log(err);
        toast.error("Error fetching data");
      }
    };
    fetchData();
  }, []);

  // Update filtered works when main artist changes
  useEffect(() => {
    if (artist) {
      setFilteredWorks(allWorks.filter(w => w.artist?._id === artist || w.artist === artist));
    } else {
      setFilteredWorks(allWorks);
    }
  }, [artist, allWorks]);

  const resetForm = () => {
    setTitle(""); setArtist(""); setArtists([]);
    setDate(""); setOverview(""); setDescription("");
    setWorks([]); setPress([]); setPressInput("");
    setCover(null); setPreview(""); setEditingId(null);
  };

  const addPress = () => {
    if (pressInput.trim() && !press.includes(pressInput.trim())) {
      setPress([...press, pressInput.trim()]);
      setPressInput("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("artist", artist);
      formData.append("date", date);
      formData.append("overview", overview);
      formData.append("description", description);
      formData.append("works", JSON.stringify(works));
      formData.append("press", JSON.stringify(press));
      formData.append("artists", JSON.stringify(artists));
      if (cover instanceof File) formData.append("cover", cover);

      if (editingId) {
        await axios.put(`${VITE_VITE_API_URL}/api/exhibitions/${editingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Exhibition updated!");
      } else {
        await axios.post(`${VITE_VITE_API_URL}/api/exhibitions/addexhibtions`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Exhibition added!");
      }
      resetForm();
      const res = await axios.get(`${VITE_VITE_API_URL}/api/exhibitions`);
      setExhibitions(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (err) {
      console.log(err);
      toast.error("Error saving exhibition");
    }
  };

  const handleEdit = (ex) => {
    setEditingId(ex._id);
    setTitle(ex.title || "");
    setArtist(ex.artist?._id || "");
    setArtists(ex.artists?.map(a => a._id) || []);
    setDate(ex.date || "");
    setOverview(ex.overview || "");
    setDescription(ex.description || "");
    setWorks(ex.works?.map(w => w._id) || []);
    setPress(ex.press || []);
    setCover(null);
    setPreview(ex.cover || "");
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await axios.delete(`${VITE_VITE_API_URL}/api/exhibitions/${deleteTarget}`);
      toast.success("Exhibition deleted!");
      setExhibitions(prev => prev.filter(e => e._id !== deleteTarget));
    } catch (err) {
      console.log(err);
      toast.error("Error deleting exhibition");
    } finally {
      setShowDeleteConfirm(false);
      setDeleteTarget(null);
    }
  };

  const filteredExhibitions = exhibitions.filter((e) =>
    e.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageContainer>
      <LeftPanel>

        <FormWrapper onSubmit={handleSubmit}>
          <h3>{editingId ? "Edit Exhibition" : "Add Exhibition"}</h3>

          <InputBox>
            <input value={title} onChange={(e) => setTitle(e.target.value)} required />
            <span className={title ? "active" : ""}>Title</span>
          </InputBox>

          <InputBox>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </InputBox>

          <InputBox>
            <select value={artist} onChange={(e) => setArtist(e.target.value)} required>
              <option value="">Select Main Artist</option>
              {allArtists.map(ar => <option key={ar._id} value={ar._id}>{ar.name}</option>)}
            </select>
          </InputBox>

          {/* Additional Artists */}
          <InputBox>
            <label>Additional Artists</label>
            <FullWidthButton type="button" onClick={() => setShowArtistsModal(true)}>
              {artists.length > 0 ? "Update Artists" : "Select Artists"}
            </FullWidthButton>

            {artists.length > 0 && (
              <PressTable>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Artist Name</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {artists.map((aId, i) => {
                    const artistObj = allArtists.find(ar => ar._id === aId);
                    return artistObj ? (
                      <tr key={aId}>
                        <td>{i + 1}</td>
                        <td>{artistObj.name}</td>
                        <td>
                          <ActionBtnRed onClick={() => setArtists(artists.filter(id => id !== aId))}>
                            Delete
                          </ActionBtnRed>
                        </td>
                      </tr>
                    ) : null;
                  })}
                </tbody>
              </PressTable>
            )}
          </InputBox>

          {/* Works */}
          <InputBox>
            <label>Works</label>
            <FullWidthButton type="button" onClick={() => setShowWorksModal(true)}>
              {works.length > 0 ? "Update Works" : "Select Works"}
            </FullWidthButton>

            {works.length > 0 && (
              <PressTable>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Work Title</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {works.map((wId, i) => {
                    const workObj = allWorks.find(w => w._id === wId);
                    return workObj ? (
                      <tr key={wId}>
                        <td>{i + 1}</td>
                        <td>{workObj.title}</td>
                        <td>
                          <ActionBtnRed onClick={() => setWorks(works.filter(id => id !== wId))}>
                            Delete
                          </ActionBtnRed>
                        </td>
                      </tr>
                    ) : null;
                  })}
                </tbody>
              </PressTable>
            )}
          </InputBox>

          {/* Overview */}
          <InputBox>
            <textarea rows={2} value={overview} onChange={(e) => setOverview(e.target.value)} />
            <span className={overview ? "active" : ""}>Overview</span>
          </InputBox>

          {/* Description */}
          <InputBox>
            <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
            <span className={description ? "active" : ""}>Description</span>
          </InputBox>

          {/* Press */}
          <InputBox>
            <label>Press</label>
            <PressInputWrapper>
              <input type="text" className="input" value={pressInput} onChange={e => setPressInput(e.target.value)} placeholder="Add press link" />
              <SmallButton type="button" onClick={addPress}>Add</SmallButton>
            </PressInputWrapper>

            {press.length > 0 && (
              <PressTable>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Link</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {press.map((p, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{p}</td>
                      <td>
                        <ActionBtnRed onClick={() => setPress(press.filter(pl => pl !== p))}>
                          Delete
                        </ActionBtnRed>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </PressTable>
            )}
          </InputBox>

          {/* Cover */}
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
              <th>Cover</th>
              <th>Title</th>
              <th>Main Artist</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredExhibitions.map(ex => (
              <tr key={ex._id}>
                <td><img src={ex.cover || "https://via.placeholder.com/80"} alt={ex.title} style={{ width: "60px", height: "60px", borderRadius: "6px", objectFit: "cover" }} /></td>
                <td>{ex.title}</td>
                <td>{ex.artist?.name || "N/A"}</td>
                <td>{ex.date || "N/A"}</td>
                <td>
                  <ActionBtnGreen onClick={() => handleEdit(ex)}>Edit</ActionBtnGreen>
                  <ActionBtnRed onClick={() => { setDeleteTarget(ex._id); setShowDeleteConfirm(true); }}>Delete</ActionBtnRed>
                </td>
              </tr>
            ))}
          </tbody>
        </ExhibitionsTable>
      </RightPanel>

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <DeleteOverlay>
          <DeleteBox>
            <p>Are you sure you want to delete this exhibition?</p>
            <div className="actions">
              <ActionBtnRed onClick={handleDelete}>Yes</ActionBtnRed>
              <ActionBtnGrey onClick={() => setShowDeleteConfirm(false)}>Cancel</ActionBtnGrey>
            </div>
          </DeleteBox>
        </DeleteOverlay>
      )}

      {/* Artists Modal */}
      {showArtistsModal && (
        <ModalOverlay>
          <ModalBox>
            <h4>Select Artists</h4>
            <ArtistsList>
              {allArtists.map(a => (
                <ArtistItem key={a._id}>
                  <label>
                    <input type="checkbox" checked={artists.includes(a._id)} onChange={e => {
                      if (e.target.checked) setArtists([...artists, a._id]);
                      else setArtists(artists.filter(id => id !== a._id));
                    }} />
                    {a.name}
                  </label>
                </ArtistItem>
              ))}
            </ArtistsList>
            <FullWidthButton onClick={() => setShowArtistsModal(false)}>Done</FullWidthButton>
          </ModalBox>
        </ModalOverlay>
      )}

      {/* Works Modal */}
      {showWorksModal && (
        <ModalOverlay>
          <ModalBox>
            <h4>Select Works</h4>
            <WorksList>
              {filteredWorks.map(w => (
                <WorkItem key={w._id}>
                  <label>
                    <input type="checkbox" checked={works.includes(w._id)} onChange={e => {
                      if (e.target.checked) setWorks([...works, w._id]);
                      else setWorks(works.filter(id => id !== w._id));
                    }} />
                    {w.title}
                  </label>
                </WorkItem>
              ))}
            </WorksList>
            <FullWidthButton onClick={() => setShowWorksModal(false)}>Done</FullWidthButton>
          </ModalBox>
        </ModalOverlay>
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
const FullWidthButton = styled.button`width: 100%; padding: 10px; border-radius: 6px; border: none; cursor: pointer; background: #1f8b8d; color: #fff; margin-top:5px;`;
const SmallButton = styled.button`padding: 5px 15px; border-radius: 4px; border: none; cursor: pointer; background: #1f8b8d; color: #fff;`;
const TagsContainer = styled.div`display: flex; flex-wrap: wrap; gap: 5px; margin-top: 5px;`;
const Tag = styled.span`background: #ccc; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem;`;
const PressInputWrapper = styled.div`display: flex; gap: 5px;`;
const PressTable = styled.table`width: 100%; border-collapse: collapse; margin-top: 5px; th, td { border: 1px solid #ccc; padding: 6px 8px; text-align: left; } th { background: #f5f5f5; }`;
const ExhibitionsTable = styled.table`width: 100%; border-collapse: collapse; th, td { border: 1px solid #ccc; padding: 8px; text-align: left; } th { background: #f5f5f5; }`;
const ActionBtnGreen = styled.button`background: #4caf50; color: #fff; margin-right: 5px; padding: 6px 12px; border-radius: 6px; border: none; cursor: pointer;`;
const ActionBtnRed = styled.button`background: #f44336; color: #fff; margin-right: 5px; padding: 6px 12px; border-radius: 6px; border: none; cursor: pointer;`;
const ActionBtnGrey = styled.button`background: #6c757d; color: #fff; padding: 6px 12px; border-radius: 6px; border: none; cursor: pointer;`;
const ModalOverlay = styled.div`position: fixed; top: 0; left:0; right:0; bottom:0; background: rgba(0,0,0,0.6); display: flex; justify-content: center; align-items: center; z-index: 1000;`;
const ModalBox = styled.div`background: #fff; padding: 20px; border-radius: 10px; max-height: 80vh; overflow-y: auto; width: 400px; display: flex; flex-direction: column; gap: 10px;`;
const ArtistsList = styled.div`display: flex; flex-direction: column; gap: 5px;`;
const ArtistItem = styled.div``;
const WorksList = styled.div`display: flex; flex-direction: column; gap: 5px;`;
const WorkItem = styled.div``;
const DeleteOverlay = styled(ModalOverlay)`justify-content: center; align-items: center;`;
const DeleteBox = styled.div`background: #fff; padding: 20px; border-radius: 10px; text-align: center; p { margin-bottom: 15px; } .actions { display: flex; justify-content: center; gap: 10px; }`;

export default ExhibitionsAdmin;
