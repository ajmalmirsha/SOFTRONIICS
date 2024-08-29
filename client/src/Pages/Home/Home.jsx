import style from "./home.module.css";
import navImg from "../../assets/navImg.svg";
import logoutIcon from "../../assets/logoutIcon.svg";
import cardImg from "../../assets/cardImg.svg";
import upIcon from "../../assets/upIcon.svg";
import upIconWhite from "../../assets/upIconWhite.svg";
import closeIcon from "../../assets/closeIcon.svg";
import Modal from "../../Components/Modal/Modal";
import { useContext, useEffect, useState } from "react";
import { Context } from "../../Context/ContextProvider";
import { depositMoney, getDetails, withdrawMoney } from "../../Api/Api";
import { useNavigate } from "react-router-dom";
import { logout } from "../../Utils/admin";

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

const Home = () => {
  const [depositModal, setDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState(null);

  const [refetch, setRefetch] = useState(false);

  const [withdrawModal, setWithdrawModal] = useState(false);
  const [withdraw, setWithdraw] = useState({ amount: null, password: "" });
  const [data, setData] = useState({
    WithdrawTotal: null,
    DepositTotal: null,
    transactions: [],
    balance: null,
  });

  const [err, setErr] = useState("");

  const { user } = useContext(Context);

  const navigate = useNavigate();

  const handleDepositMoney = async (e) => {
    e?.preventDefault();

    try {
      if (!depositAmount) throw "Enter deposit amount";
      if (depositAmount <= 0) throw "Enter a valid amount";
      const result = await depositMoney(depositAmount);
      if (result) {
        setDepositModal(false);
        setRefetch((prev) => !prev);
      }
    } catch (error) {
      setErr(error?.response?.data?.error || error?.message || error);
      console.log(error);
    }
  };

  const handleWithdrawMoney = async (e) => {
    e?.preventDefault();

    try {
      if (!withdraw.amount) throw "Enter deposit amount";
      if (withdraw.amount <= 0) throw "Enter a valid amount";
      if (!withdraw.password) throw "Enter the password";
      const result = await withdrawMoney(withdraw);
      if (result) {
        setRefetch((prev) => !prev);
        setWithdrawModal(false);
      }
    } catch (error) {
      setErr(error?.response?.data?.error || error?.message || error);
      console.log(error);
    }
  };

  const handleFetchData = async () => {
    try {
      const result = await getDetails();
      setData(result?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    logout(() => {
      navigate("/login");
    });
  };

  useEffect(() => {
    handleFetchData();
  }, [refetch]);

  useEffect(() => {
    if (err) setErr("");

    setDepositAmount(0);
    setWithdraw({ amount: 0, password: "" });
  }, [withdrawModal, depositModal]);

  return (
    <div className={style.container}>
      <div className={style.box}>
        <header>
          <div className={style.welcomeContainer} >
            <h1 className={style.welcomeText}>Welcome Back, {user.username}</h1>
            <p>Here’s what’s happening with your Bank app today.</p>
          </div>
          <img className={style.navImg} src={navImg} />
          <img
            onClick={handleLogout}
            className={style.logoutIcon}
            src={logoutIcon}
          />
        </header>

        <div className={style.infoWrapper}>
          <div className={style.balanceWrapper}>
            <br />
            <h3 className={style.balance}>${data?.balance}</h3>
            <p>Total Balance</p>
          </div>

          <div className={style.cardWrapper}>
            <div className={style.incomeWrapper}>
              <div className={style.cardHeader}>
                <div className={style.iconWrapper}>
                  <img src={upIcon} />
                </div>
                <h3>Total Income</h3>
              </div>
              <h3 className={style.amount}>$ {data?.DepositTotal}</h3>
            </div>

            <div className={style.outcomeWrapper}>
              <div className={style.cardHeader}>
                <div className={style.iconWrapper}>
                  <img src={upIcon} />
                </div>
                <h3>Total Outcome</h3>
              </div>
              <h3 className={style.amount}>$ {data?.WithdrawTotal}</h3>
            </div>
          </div>
        </div>

        <div className={style.btnWrapper}>
          <button
            onClick={() => {
              setWithdrawModal(true);
            }}
            className={style.withdrawBtn}
          >
            Withdraw Money
          </button>
          <button
            onClick={() => {
              setDepositModal(true);
            }}
            className={style.addBtn}
          >
            Add Money
          </button>
        </div>
        <div className={style.footerWrapper}>
          <div className={style.textBox}>
            <img src={cardImg} />
            <h4>Check your bank daily transaction!</h4>
          </div>
          <div className={style.transactionWrapper}>
            <h3>Transaction History</h3>

            <div className={style.itemsWrapper}>
              {data?.transactions?.length ? (
                data?.transactions?.map((x) => {
                  if (x.method === "Deposit") {
                    return <DepositCard item={x} />;
                  } else {
                    return <WithdrawCard item={x} />;
                  }
                })
              ) : (
                <div style={{ textAlign: "center" }}>it looks empty here</div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Modal setClose={setDepositModal} open={depositModal}>
        <div className={style.depositModal}>
          <div className={style.modalHeader}>
            <h3>Deposit Money</h3>
            <img
              onClick={() => {
                setDepositModal(false);
              }}
              className={style.closeIcon}
              src={closeIcon}
            />
          </div>
          <form onSubmit={handleDepositMoney}>
            <div className={style.inputWrapper}>
              <label htmlFor="amount">Enter amount :</label>
              <input
                value={depositAmount}
                onChange={(e) => {
                  if (err) setErr("");
                  const num = e?.target?.valueAsNumber || 0;
                  if (num >= 0) {
                    setDepositAmount(num);
                  } else {
                    setDepositAmount(0);
                  }
                }}
                type="number"
                id="amount"
                name="amount"
              />
            </div>
            <p className={style.error}>{err}</p>
            <button className={style.depositButton}>Deposit</button>
          </form>
        </div>
      </Modal>

      <Modal setClose={setWithdrawModal} open={withdrawModal}>
        <div className={style.withdrawModal}>
          <div className={style.modalHeader}>
            <h3>Withdraw Money</h3>
            <img
              onClick={() => {
                setWithdrawModal(false);
              }}
              className={style.closeIcon}
              src={closeIcon}
            />
          </div>
          <form onSubmit={handleWithdrawMoney}>
            <div className={style.inputWrapper}>
              <label htmlFor="amount">Enter amount :</label>
              <input
                value={withdraw.amount}
                onChange={(e) => {
                  if (err) setErr("");
                  const num = e?.target?.valueAsNumber || 0;
                  if (num >= 0) {
                    setWithdraw((prev) => ({ ...prev, amount: num }));
                  } else {
                    setWithdraw((prev) => ({ ...prev, amount: 0 }));
                  }
                }}
                type="number"
                id="amount"
                name="amount"
              />
            </div>
            <div className={style.inputWrapper}>
              <label htmlFor="password">Enter Password :</label>
              <input
                value={withdraw?.password}
                onChange={(e) => {
                  if (err) setErr("");
                  setWithdraw((prev) => ({
                    ...prev,
                    password: e?.target?.value,
                  }));
                }}
                type="password"
                id="password"
                name="password"
              />
            </div>
            <p className={style.error}>{err}</p>
            <button className={style.depositButton}>Withdraw</button>
          </form>
        </div>
      </Modal>
    </div>
  );
};

function DepositCard({ item }) {
  return (
    <div className={style.depositWrapper}>
      <div className={style.iconWrapper}>
        <img src={upIconWhite} />
      </div>
      <div className={style.contentWrapper}>
        <div>
          <h3>Deposited</h3>
          <p>{formateDate(item?.createdAt)}</p>
        </div>
        <h3>
          {" "}
          <span style={{ color: "#0a5f59" }}>+</span> ${item.amount}
        </h3>
      </div>
    </div>
  );
}

function WithdrawCard({ item }) {
  return (
    <div className={style.withdrawWrapper}>
      <div className={style.iconWrapper}>
        <img src={upIcon} />
      </div>
      <div className={style.contentWrapper}>
        <div>
          <h3>Withdraw</h3>
          <p>{formateDate(item.createdAt)}</p>
        </div>
        <h3>
          {" "}
          <span style={{ color: "#FDCF6F" }}>-</span> ${item.amount}
        </h3>
      </div>
    </div>
  );
}

export default Home;
