// src/Pages/Admin/AboutAdmin.jsx
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { toast } from "react-toastify";
import FormFileUpload from "../../Components/Modal/FileUploadForm";
import Loader from "../../Components/Modal/Loaders";



const getImageUrl = (imgPath) => {
  if (!imgPath || typeof imgPath !== "string") return "";
  imgPath = imgPath.trim();
  if (imgPath.startsWith("data:")) return imgPath;
  if (imgPath.startsWith("http://") || imgPath.startsWith("https://")) return imgPath;
  if (imgPath.startsWith("/uploads/")) return `${API_URL}${imgPath}`;
  if (imgPath.includes("uploads/")) return `${API_URL}/${imgPath.replace(/^\/+/,'')}`;
  return `${API_URL}/uploads/${imgPath}`;
};

const AboutAdmin = () => {

  const API_URL = import.meta.env.VITE_API_URL;

  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);
  // Header
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [introText, setIntroText] = useState("");
  const [headerImage, setHeaderImage] = useState(null);
  // Quote
  const [quoteText, setQuoteText] = useState("");
  const [quoteAuthor, setQuoteAuthor] = useState("");
  const [quoteBg, setQuoteBg] = useState(null);
  // Sections
  const [sections, setSections] = useState([]);
  const [sectionTitle, setSectionTitle] = useState("");
  const [sectionContent, setSectionContent] = useState("");
  const [editingSection, setEditingSection] = useState(null);
  // Galleries
  const [galleries, setGalleries] = useState([]);
  const [galleryName, setGalleryName] = useState("");
  const [galleryImages, setGalleryImages] = useState([]);
  const [editingGallery, setEditingGallery] = useState(null);
  // Founders
  const [founders, setFounders] = useState([]);
  const [founderName, setFounderName] = useState("");
  const [founderTitle, setFounderTitle] = useState("");
  const [founderDesc, setFounderDesc] = useState("");
  const [founderImage, setFounderImage] = useState(null);
  const [editingFounder, setEditingFounder] = useState(null);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/api/about`);
        if (res?.data) {
          const data = res.data;
          setAbout(data);
          setTitle(data.header?.title || "");
          setSubtitle(data.header?.subtitle || "");
          setIntroText(data.header?.introText || "");
          setHeaderImage(data.header?.image || null);
          setQuoteText(data.quote?.text || "");
          setQuoteAuthor(data.quote?.author || "");
          setQuoteBg(data.quote?.backgroundImage || null);
          setSections(data.sections || []);
          setGalleries(data.galleries || []);
          setFounders(data.founders || []);
        }
      } catch {
        toast.error("Error fetching About data");
      } finally {
        setLoading(false);
      }
    };
    fetchAbout();
  }, []);

  // Persist
  const persistAbout = async (payload) => {
    try {
      const res = await axios.put(`${API_URL}/api/about/${about._id}`, payload);
      setAbout(res.data);
      toast.success("Saved successfully");
    } catch {
      toast.error("Error saving About");
    }
  };

  // Header Save
  const saveHeader = (e) => {
    e.preventDefault();
    persistAbout({
      ...about,
      header: { title, subtitle, introText, image: headerImage },
    });
  };

  // Quote Save
  const saveQuote = (e) => {
    e.preventDefault();
    persistAbout({
      ...about,
      quote: { text: quoteText, author: quoteAuthor, backgroundImage: quoteBg },
    });
  };

  // Section Add/Edit
  const handleSectionSubmit = (e) => {
    e.preventDefault();
    let updated = [...sections];
    if (editingSection !== null) {
      updated[editingSection] = { title: sectionTitle, content: sectionContent };
    } else {
      updated.push({ title: sectionTitle, content: sectionContent });
    }
    setSections(updated);
    setSectionTitle(""); setSectionContent(""); setEditingSection(null);
    persistAbout({ ...about, sections: updated });
  };
  const handleSectionEdit = (i) => {
    setSectionTitle(sections[i].title);
    setSectionContent(sections[i].content);
    setEditingSection(i);
  };
  const handleSectionDelete = (i) => {
    const updated = sections.filter((_, idx) => idx !== i);
    setSections(updated);
    persistAbout({ ...about, sections: updated });
  };

  // Gallery Add/Edit
  const handleGallerySubmit = (e) => {
    e.preventDefault();
    let updated = [...galleries];
    if (editingGallery !== null) {
      updated[editingGallery] = { name: galleryName, images: galleryImages };
    } else {
      updated.push({ name: galleryName, images: galleryImages });
    }
    setGalleries(updated);
    setGalleryName(""); setGalleryImages([]); setEditingGallery(null);
    persistAbout({ ...about, galleries: updated });
  };
  const handleGalleryEdit = (i) => {
    setGalleryName(galleries[i].name);
    setGalleryImages(galleries[i].images);
    setEditingGallery(i);
  };
  const handleGalleryDelete = (i) => {
    const updated = galleries.filter((_, idx) => idx !== i);
    setGalleries(updated);
    persistAbout({ ...about, galleries: updated });
  };

  // Founder Add/Edit
  const handleFounderSubmit = async (e) => {
    e.preventDefault();
    let img = founderImage;
    if (founderImage instanceof File) {
      const formData = new FormData();
      formData.append("image", founderImage);
      try {
        const res = await axios.post(`${API_URL}/api/about/upload-founder-image`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        img = res.data.url;
      } catch {
        toast.error("Image upload failed");
        img = null;
      }
    }
    let updated = [...founders];
    if (editingFounder !== null) {
      updated[editingFounder] = { name: founderName, title: founderTitle, description: founderDesc, image: img };
    } else {
      updated.push({ name: founderName, title: founderTitle, description: founderDesc, image: img });
    }
    setFounders(updated);
    setFounderName(""); setFounderTitle(""); setFounderDesc(""); setFounderImage(null); setEditingFounder(null);
    persistAbout({ ...about, founders: updated });
  };
  const handleFounderEdit = (i) => {
    setFounderName(founders[i].name);
    setFounderTitle(founders[i].title);
    setFounderDesc(founders[i].description);
    setFounderImage(founders[i].image);
    setEditingFounder(i);
  };
  const handleFounderDelete = (i) => {
    const updated = founders.filter((_, idx) => idx !== i);
    setFounders(updated);
    persistAbout({ ...about, founders: updated });
  };

  if (loading) return <LoaderWrapper><Loader /></LoaderWrapper>;
  if (!about) return <PageContainer>No About document found.</PageContainer>;

  return (
    <PageContainer>
      <LeftPanel>
        {/* Header */}
        <FormWrapper onSubmit={saveHeader}>
          <h3>Header</h3>
          <InputBox>
            <input value={title} onChange={e => setTitle(e.target.value)} required />
            <span className={title ? "active" : ""}>Title</span>
          </InputBox>
          <InputBox>
            <input value={subtitle} onChange={e => setSubtitle(e.target.value)} />
            <span className={subtitle ? "active" : ""}>Subtitle</span>
          </InputBox>
          <InputBox>
            <textarea rows={2} value={introText} onChange={e => setIntroText(e.target.value)} />
            <span className={introText ? "active" : ""}>Intro Text</span>
          </InputBox>
    {/* لا يوجد صورة للـ Header */}
          <ActionButton type="submit">Save Header</ActionButton>
        </FormWrapper>

        {/* Quote */}
        <FormWrapper onSubmit={saveQuote}>
          <h3>Quote</h3>
          <InputBox>
            <textarea rows={2} value={quoteText} onChange={e => setQuoteText(e.target.value)} />
            <span className={quoteText ? "active" : ""}>Quote Text</span>
          </InputBox>
          <InputBox>
            <input value={quoteAuthor} onChange={e => setQuoteAuthor(e.target.value)} />
            <span className={quoteAuthor ? "active" : ""}>Author</span>
          </InputBox>
    {/* لا يوجد صورة للـ Quote */}
          <ActionButton type="submit">Save Quote</ActionButton>
        </FormWrapper>

        {/* Sections */}
        <FormWrapper onSubmit={handleSectionSubmit}>
          <h3>{editingSection !== null ? "Edit Section" : "Add Section"}</h3>
          <InputBox>
            <input value={sectionTitle} onChange={e => setSectionTitle(e.target.value)} required />
            <span className={sectionTitle ? "active" : ""}>Section Title</span>
          </InputBox>
          <InputBox>
            <textarea rows={3} value={sectionContent} onChange={e => setSectionContent(e.target.value)} required />
            <span className={sectionContent ? "active" : ""}>Section Content</span>
          </InputBox>
          <ActionButton type="submit">{editingSection !== null ? "Update" : "Add"}</ActionButton>
          {editingSection !== null && <ActionButton type="button" onClick={() => { setSectionTitle(""); setSectionContent(""); setEditingSection(null); }}>Cancel</ActionButton>}
        </FormWrapper>

        {/* Galleries */}
        <FormWrapper onSubmit={handleGallerySubmit}>
          <h3>{editingGallery !== null ? "Edit Gallery" : "Add Gallery"}</h3>
          <InputBox>
            <input value={galleryName} onChange={e => setGalleryName(e.target.value)} required />
            <span className={galleryName ? "active" : ""}>Gallery Name</span>
          </InputBox>
          <FormFileUpload image={null} setImage={file => {
            const reader = new FileReader();
            reader.onloadend = () => setGalleryImages([...galleryImages, reader.result]);
            reader.readAsDataURL(file);
          }} />
          <ActionButton type="submit">{editingGallery !== null ? "Update" : "Add"}</ActionButton>
          {editingGallery !== null && <ActionButton type="button" onClick={() => { setGalleryName(""); setGalleryImages([]); setEditingGallery(null); }}>Cancel</ActionButton>}
        </FormWrapper>

        {/* Founders */}
        <FormWrapper onSubmit={handleFounderSubmit}>
          <h3>{editingFounder !== null ? "Edit Founder" : "Add Founder"}</h3>
          <InputBox>
            <input value={founderName} onChange={e => setFounderName(e.target.value)} required />
            <span className={founderName ? "active" : ""}>Name</span>
          </InputBox>
          <InputBox>
            <input value={founderTitle} onChange={e => setFounderTitle(e.target.value)} required />
            <span className={founderTitle ? "active" : ""}>Title</span>
          </InputBox>
          <InputBox>
            <textarea rows={2} value={founderDesc} onChange={e => setFounderDesc(e.target.value)} required />
            <span className={founderDesc ? "active" : ""}>Description</span>
          </InputBox>
          <FormFileUpload image={founderImage} setImage={setFounderImage} />
          <ActionButton type="submit">{editingFounder !== null ? "Update" : "Add"}</ActionButton>
          {editingFounder !== null && <ActionButton type="button" onClick={() => { setFounderName(""); setFounderTitle(""); setFounderDesc(""); setFounderImage(null); setEditingFounder(null); }}>Cancel</ActionButton>}
        </FormWrapper>
      </LeftPanel>

      <RightPanel>
        <SearchBox>
          <h3>About Preview</h3>
        </SearchBox>

        {/* Header Preview */}
        <PreviewBox>
          <h4>Header</h4>
          <p><strong>Title:</strong> {title}</p>
          <p><strong>Subtitle:</strong> {subtitle}</p>
          <p><strong>Intro:</strong> {introText}</p>
        </PreviewBox>

        {/* Quote Preview */}
        <PreviewBox>
          <h4>Quote</h4>
          <p><strong>Text:</strong> {quoteText}</p>
          <p><strong>Author:</strong> {quoteAuthor}</p>
        </PreviewBox>

        {/* Sections Table */}
        <PreviewBox>
          <h4>Sections</h4>
          <PreviewTable>
            <thead>
              <tr><th>Title</th><th>Content</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {sections.map((s, i) => (
                <tr key={i}>
                  <td>{s.title}</td>
                  <td>{s.content}</td>
                  <td>
                    <ActionBtnGreen onClick={() => handleSectionEdit(i)}>Edit</ActionBtnGreen>
                    <ActionBtnRed onClick={() => handleSectionDelete(i)}>Delete</ActionBtnRed>
                  </td>
                </tr>
              ))}
            </tbody>
          </PreviewTable>
        </PreviewBox>

        {/* Galleries Table */}
        <PreviewBox>
          <h4>Galleries</h4>
          <PreviewTable>
            <thead>
              <tr><th>Name</th><th>Images</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {galleries.map((g, i) => (
                <tr key={i}>
                  <td>{g.name}</td>
                  <td>
                    <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                      {(g.images || []).map((img, j) => (
                        <img key={j} src={getImageUrl(img)} alt="Gallery" style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "4px" }} />
                      ))}
                    </div>
                  </td>
                  <td>
                    <ActionBtnGreen onClick={() => handleGalleryEdit(i)}>Edit</ActionBtnGreen>
                    <ActionBtnRed onClick={() => handleGalleryDelete(i)}>Delete</ActionBtnRed>
                  </td>
                </tr>
              ))}
            </tbody>
          </PreviewTable>
        </PreviewBox>

        {/* Founders Table */}
        <PreviewBox>
          <h4>Founders</h4>
          <PreviewTable>
            <thead>
              <tr><th>Image</th><th>Name</th><th>Title</th><th>Description</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {founders.map((f, i) => (
                <tr key={i}>
                  <td><img src={getImageUrl(f.image)} alt={f.name} style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }} /></td>
                  <td>{f.name}</td>
                  <td>{f.title}</td>
                  <td>{f.description}</td>
                  <td>
                    <ActionBtnGreen onClick={() => handleFounderEdit(i)}>Edit</ActionBtnGreen>
                    <ActionBtnRed onClick={() => handleFounderDelete(i)}>Delete</ActionBtnRed>
                  </td>
                </tr>
              ))}
            </tbody>
          </PreviewTable>
        </PreviewBox>
      </RightPanel>
    </PageContainer>
  );
};

// === Styled Components ===
const PageContainer = styled.div`display: flex; gap: 1rem; max-width: 1200px; margin: 2rem auto;`;
const LeftPanel = styled.div`flex: 1;`;
const RightPanel = styled.div`flex: 2;`;
const SearchBox = styled.div`margin-bottom: 1rem;`;
const FormWrapper = styled.form`background: #eee; padding: 1rem; border-radius: 10px; display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1rem;`;
const InputBox = styled.div`position: relative; width: 100%; input, textarea, select { width: 100%; padding: 8px; border: none; border-bottom: 2px solid #616161; outline: none; } span { position: absolute; left: 0; top: 8px; font-size: 0.85em; color: #888; pointer-events: none; transition: 0.3s; } .active { top: -15px; font-size: 0.75em; color: #333; }`;
const ActionButton = styled.button`padding: 11px 135px; border-radius: 6px; border: none; cursor: pointer; background: #1f8b8d; color: #fff; margin-top: 5px;`;
const PreviewBox = styled.div`background: #fff; padding: 1rem; border-radius: 10px; margin-bottom: 1rem; box-shadow: 0 4px 10px rgba(0,0,0,0.05);`;
const PreviewTable = styled.table`width: 100%; border-collapse: collapse; th, td { border: 1px solid #ccc; padding: 8px; text-align: left; } th { background: #f5f5f5; }`;
const ActionBtnGreen = styled.button`background: #4caf50; color: #fff; margin-right: 5px; padding: 6px 12px; border-radius: 6px; border: none; cursor: pointer;`;
const ActionBtnRed = styled.button`background: #f44336; color: #fff; margin-right: 5px; padding: 6px 12px; border-radius: 6px; border: none; cursor: pointer;`;

export default AboutAdmin;
const LoaderWrapper = styled.div`
  display: flex; align-items: center; justify-content: center; min-height: 70vh;
`;
