import axios from "axios";

const baseAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

baseAxios.interceptors.response.use((res) => {
  return res.data;
});

export default baseAxios;
