import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

import Layout from "../Layout/Layout";
import Home from "../Pages/Home/Home";
import AdminLogin from "../Pages/Admin/Auth/AdminLogin";
import AdminHome from "../Pages/Admin/Home/AdminHome";
import AdminTransactionList from "../Pages/Admin/Transactions/AdminTransactionList";
import AdminLayout from "../Layout/AdminLayout";

const Login = lazy(() => import("../Pages/Auth/Login"));
const Register = lazy(() => import("../Pages/Auth/Register"));
const Error = lazy(() => import("../Pages/Error/Error"));

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <Error />,
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
    ],
  },
  {
    path: "/admin",
    errorElement: <Error />,
    element: <AdminLayout />,
    children: [
      {
        path: "transactions",
        errorElement: <Error />,
        element: <AdminTransactionList />,
      },
      {
        path: "",
        element: <AdminHome />,
      },
    ],
  },
  {
    path: "/admin/login",
    errorElement: <Error />,
    element: <AdminLogin />,
  },
  {
    path: "/login",
    errorElement: <Error />,
    element: <Login />,
  },
  {
    path: "/register",
    errorElement: <Error />,
    element: <Register />,
  },
  {
    path: "/error",
    element: <Error />,
  },
]);

export default router;
