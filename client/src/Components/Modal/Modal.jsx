import style from "./modal.module.css";

const Modal = ({ children, open = false, setClose }) => {
  return (
    <div
      onClick={() => setClose(false)}
      style={{ display: open ? "flex" : "none" }}
      className={style.container}
    >
      <div onClick={(e)=> e?.stopPropagation()} >{children}</div>
    </div>
  );
};

export default Modal;
