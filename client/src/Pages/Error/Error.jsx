import { Link } from "react-router-dom";
import style from "./error.module.css";

const Error = () => {
  return (
    <div className={style.container}>
      <h3>Something went wrong</h3>
      <Link to={"/"}>Back to Home</Link>
    </div>
  );
};

export default Error;
