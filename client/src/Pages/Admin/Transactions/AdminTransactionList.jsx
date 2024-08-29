import { useEffect, useState } from "react";
import style from "./transactionList.module.css";
import { useNavigate } from "react-router-dom";
import { fetchAllTransactions } from "../../../Api/Api";
import arrow from "../../../assets/upIcon.svg";
import whiteArrow from "../../../assets/upIconWhite.svg";
import logOutIcon from "../../../assets/logoutIcon.svg";
import { adminLogout } from "../../../Utils/admin";

const AdminTransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [refetch, setRefetch] = useState(false);

  const navigate = useNavigate();

  const getUserList = async () => {
    try {
      const result = await fetchAllTransactions();
      setTransactions(result?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const formateDate = (dateString) => {
    const date = new Date(dateString);

    const options = {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };

    return new Intl.DateTimeFormat("en-US", options).format(date);
  };

  useEffect(() => {
    getUserList();
  }, [refetch]);

  return (
    <div className={style.container}>
      <div className={style.header}>
        <h1>Hey admin</h1>

        <div className={style.navRightWrapper}>
          <button
            onClick={() => {
              navigate("/admin");
            }}
          >
            User List
          </button>

          <div className={style.logOutWrapper}>
            <img onClick={()=>{
              adminLogout(()=>{
                navigate("/admin/login")
              })
            }} className={style.logOutBtn} src={logOutIcon} />
          </div>
        </div>
      </div>

      <div className={style.userListContainer}>
        <h2>Transactions</h2>

        <div className={style.userTable}>
          {transactions.map((x, i) => (
            <div key={i} className={style.userRowContainer}>
              <div className={style.wrapper}>
                <div className={style?.[x.method]}>
                  <img src={x?.method === "Deposit" ? whiteArrow : arrow} />
                </div>
                <div>
                  <h4 className={style.headText}>
                    {x?.userData?.username} - {x?.method}
                  </h4>
                  <p>{x?.userData?.email}</p>
                </div>
              </div>
              <div className={style.rightWrapper}>
                <h3>
                  {x?.method === "Deposit" ? "+" : "-"} ${x?.amount}
                </h3>
                <p>{formateDate(x?.date)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminTransactionList;
