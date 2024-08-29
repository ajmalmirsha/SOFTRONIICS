export const adminLogout = (cb) => {
  localStorage.removeItem("admin-token");
  cb();
};

export const logout = (cb) => {
    localStorage.removeItem("token");
    cb();
  };
  