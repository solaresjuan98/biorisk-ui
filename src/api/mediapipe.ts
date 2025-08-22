import axios from "axios";

const apiMediapipe = axios.create({
  baseURL: "http://localhost:8080/", // URL base de tu backend
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // opcional: 10s
});

export default apiMediapipe;