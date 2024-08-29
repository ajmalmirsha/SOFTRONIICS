import axios from "axios";

const baseURL = "http://localhost:3000";

const api = axios.create({ baseURL });

api.interceptors.request.use(
  (config) => {
    const requestType = config.headers["X-Request-Type"];

    if (requestType === "admin") {
      config.headers.Authorization = `Bearer ${localStorage.getItem(
        "admin-token"
      )}`;
    } else {
      config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
    }

    delete config.headers["X-Request-Type"];
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export async function register(data) {
  return api.post("/auth/register", data);
}

export async function login(data) {
  return api.post("/auth/login", data);
}

export async function getUserDetails() {
  return api.get("/user");
}

export async function depositMoney(amount) {
  return api.post("/transaction/deposit", { amount });
}

export async function withdrawMoney(data) {
  return api.post("/transaction/withdraw", data);
}

export async function getDetails() {
  return api.get("/transaction/details");
}

const manageAdminInterceptorsAtRequest = (config) => {
  const token = `AdminBearer ${localStorage.getItem("admin-token")}`;
  config.headers.Authorization = token;
  return config;
};

api.interceptors.request.use(manageAdminInterceptorsAtRequest, (error) => {
  return Promise.reject(error);
});

export async function adminLogin(data) {
  return api.post("/admin/login", data, {
    headers: { "X-Request-Type": "admin" },
  });
}

export async function ListAllUsers() {
  return api.get("/admin/list/users", {
    headers: { "X-Request-Type": "admin" },
  });
}

export async function blockUser(userId) {
  return api.put(
    "/admin/block-user",
    { userId },
    {
      headers: { "X-Request-Type": "admin" },
    }
  );
}

export async function unBlockUser(userId) {
  return api.put(
    "/admin/unblock-user",
    { userId },
    {
      headers: { "X-Request-Type": "admin" },
    }
  );
}

export async function fetchAllTransactions() {
  return api.get("/admin/transactions", {
    headers: { "X-Request-Type": "admin" },
  });
}
