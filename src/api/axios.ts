import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/", // URL base de tu backend
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // opcional: 10s
});

export default api;