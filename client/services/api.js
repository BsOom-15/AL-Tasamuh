import { VITE_API_URL } from "../config";

export const fetchUsers = async () => {
  const res = await fetch(`${VITE_API_URL}/api/users`);
  const data = await res.json();
  return data;
};
