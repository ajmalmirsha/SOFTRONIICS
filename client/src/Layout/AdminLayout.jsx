import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const AdminLayout = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("admin-token")) {
      navigate("/admin/login");
    }
  }, []);
  return (
    <>
      <Outlet />
    </>
  );
};

export default AdminLayout;
