import axios from "axios";

const baseURL = "http://localhost:3000";

const api = axios.create({ baseURL });

const manageInterceptorsAtRequest = (config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
  return config;
};

api.interceptors.request.use(manageInterceptorsAtRequest, (error) => {
  return Promise.reject(error);
});

export async function register(data) {
  return api.post("/auth/register", data);
}

export async function login(data) {
  console.log("on call", api);
  return api.post("/auth/login", data);
}
