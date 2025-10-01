import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL; // رابط الـ backend كامل

const API = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const getExhibitions = (params) => API.get("/exhibitions", { params });
export const getRandomExhibitions = (limit = 3) =>
  API.get("/exhibitions/random", { params: { limit } });
export const getArtists = (params) => API.get("/artists", { params });
export const getArtworks = (params) => API.get("/artworks", { params });
export const getOpeningNight = (params) => API.get("/opening-night", { params });

export default API;
