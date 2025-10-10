import { MEDIAPIPE_API_URL } from "@/config";
import axios from "axios";


const apiMediapipe = axios.create({
  baseURL: MEDIAPIPE_API_URL, // URL base de tu backend
  headers: {
    "Content-Type": "application/json",
  },
  // timeout: 60000, // opcional: 10s
});

export default apiMediapipe;