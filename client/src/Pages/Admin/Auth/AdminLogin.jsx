import style from "./auth.module.css";
import lockImg from "../../../assets/LockImg.svg";
import { useEffect, useState } from "react";
import { adminLogin } from "../../../Api/Api";
import { Link, useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [err, setErr] = useState("");

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setUser((prev) => ({ ...prev, [e?.target?.name]: e?.target?.value }));
    if (err) setErr("");
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    try {
      if (!user?.email) throw "Email is Required !";
      if (!user?.password) throw "Password is Required !";
      const result = await adminLogin(user);
      if (result) {
        localStorage.setItem("admin-token", result.data?.data?.token);
        navigate("/admin");
      }
    } catch (error) {
      setErr(error?.response?.data?.error || error?.message || error);
      console.log(error);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("admin-token")) {
      navigate("/admin");
    }
  }, []);
  return (
    <div className={style.container}>
      <div className={style.left}>
        <div className={style.formWrapper}>
          <h3>Admin Login</h3>
          <p>Login to access your account</p>
          <br />
          <form onSubmit={handleSubmit}>
            <div className={style.inputWrapper}>
              <label htmlFor="email">Email</label>
              <input
                value={user.email}
                onChange={handleInputChange}
                type="email"
                name="email"
                id="email"
              />
            </div>
            <div className={style.inputWrapper}>
              <label htmlFor="password">Password</label>
              <input
                value={user.password}
                onChange={handleInputChange}
                type="password"
                name="password"
                id="password"
              />
            </div>
            <p className={style.error}>{err}</p>
            <br />
            <button type="submit">Login</button>
          </form>
        </div>
      </div>
      <div className={style.right}>
        <img src={lockImg} />
      </div>
    </div>
  );
};

export default AdminLogin;
