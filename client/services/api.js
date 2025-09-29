const API_URL = import.meta.env.VITE_API_URL;


export const fetchUsers = async () => {
  const res = await fetch(`${API_URL}/api/users`);
  const data = await res.json();
  return data;
};
