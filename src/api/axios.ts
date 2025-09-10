import { PREDICTION_API_URL } from "@/config";
import axios from "axios";

const api = axios.create({
  baseURL: PREDICTION_API_URL, // URL base de tu backend
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // opcional: 10s
});

export default api;