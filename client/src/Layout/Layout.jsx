import React, { useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { getUserDetails } from "../Api/Api";
import { Context } from "../Context/ContextProvider";

const Layout = () => {
  const { setUser } = useContext(Context);
  const navigate = useNavigate();
  const handleFetchUserData = async () => {
    try {
      const result = await getUserDetails();
      setUser(result?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    } else {
      handleFetchUserData();
    }
  }, []);
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default Layout;
