// src/components/modals/GalleryModal.jsx
import React from "react";
import styled from "styled-components";

const Overlay = styled.div`
  position: fixed; inset: 0; background: rgba(0,0,0,0.5);
  display:flex; justify-content:center; align-items:center; z-index:1000;
`;
const Box = styled.div`
  background:#fff; padding:18px; border-radius:10px; width:720px; max-height:80vh; overflow:auto;
`;
const Grid = styled.div`
  display:grid; grid-template-columns: repeat(2,1fr); gap:12px;
`;
const Item = styled.label`
  display:flex; gap:10px; align-items:center; padding:8px; border-radius:8px;
  border:1px solid #eee; cursor:pointer;
  img{ width:72px; height:72px; object-fit:cover; border-radius:6px; }
  .meta{ font-size:14px; }
  input[type="checkbox"]{ margin-right:6px; }
`;
const NoFound = styled.p`color:#666;`;

const getImage = (it) => it?.image || it?.imageUrl || it?.cover || "https://via.placeholder.com/120";
const getTitle = (it) => it?.title || it?.name || "Untitled";
const getSubtitle = (it) => it?.artist?.name || it?.subtitle || "";

export default function GalleryModal({
  title = "Items",
  items = [],        // array of IDs or objects — used for view mode
  allItems = [],     // full list to map IDs -> objects
  selection = false, // if true: selection mode (show allItems with checkboxes)
  selectedIds = [],  // array of selected ids (when selection=true)
  onToggle = () => {}, // (id) => toggle
  onClose = () => {}
}) {
  // normalize helper
  const normalize = (list) =>
    (list || [])
      .map(i => (typeof i === "string" ? allItems.find(a => String(a._id) === String(i)) : i))
      .filter(Boolean);

  const viewList = normalize(items);

  return (
    <Overlay>
      <Box>
        <h3 style={{marginTop:0}}>{title}</h3>

        {selection ? (
          <>
            <Grid>
              {allItems.length === 0 ? <NoFound>No items to select.</NoFound> :
                allItems.map(it => (
                  <Item key={it._id}>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(String(it._id))}
                      onChange={() => onToggle(String(it._id))}
                    />
                    <img src={getImage(it)} alt={getTitle(it)} />
                    <div className="meta">
                      <div style={{fontWeight:600}}>{getTitle(it)}</div>
                      <div style={{fontSize:12,color:"#666"}}>{getSubtitle(it)}</div>
                    </div>
                  </Item>
                ))
              }
            </Grid>
          </>
        ) : (
          <>
            <Grid>
              {viewList.length > 0 ? viewList.map(it => (
                <div key={it._id} style={{textAlign:"center"}}>
                  <img src={getImage(it)} alt={getTitle(it)} style={{width:110,height:110,objectFit:"cover",borderRadius:8}} />
                  <div style={{marginTop:6,fontWeight:600}}>{getTitle(it)}</div>
                  {it.artist?.name && <div style={{fontSize:12,color:"#666"}}>{it.artist.name}</div>}
                </div>
              )) : <NoFound>No items found.</NoFound>}
            </Grid>
          </>
        )}

        <div style={{display:"flex", justifyContent:"flex-end", marginTop:12}}>
          <button onClick={onClose} style={{padding:"8px 12px", borderRadius:6, border:"none", background:"#e53e3e", color:"#fff", cursor:"pointer"}}>
            Close
          </button>
        </div>
      </Box>
    </Overlay>
  );
}
