import { useEffect, useState } from "react";
import { blockUser, ListAllUsers, unBlockUser } from "../../../Api/Api";
import style from "./adminHome.module.css";
import { useNavigate } from "react-router-dom";
import logOutIcon from "../../../assets/logoutIcon.svg";
import { adminLogout } from "../../../Utils/admin";

const AdminHome = () => {
  const [users, setUsers] = useState([]);
  const [refetch, setRefetch] = useState(false);

  const navigate = useNavigate();

  const getUserList = async () => {
    try {
      const result = await ListAllUsers();
      setUsers(result?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleBlock = async (userId) => {
    try {
      const result = await blockUser(userId);
      if (result) {
        setRefetch((prev) => !prev);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUnBlock = async (userId) => {
    try {
      const result = await unBlockUser(userId);
      if (result) {
        setRefetch((prev) => !prev);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserList();
  }, [refetch]);

  return (
    <div className={style.container}>
      <div className={style.header}>
        <h1>Hey Admin</h1>
        <div className={style.navRightWrapper}>
          <button
            onClick={() => {
              navigate("/admin/transactions");
            }}
          >
            Transactions
          </button>

          <div className={style.logOutWrapper}>
            <img
              onClick={() => {
                adminLogout(() => {
                  navigate("/admin/login");
                });
              }}
              className={style.logOutBtn}
              src={logOutIcon}
            />
          </div>
        </div>
      </div>

      <div className={style.userListContainer}>
        <h2>User List</h2>

        <div className={style.userTable}>
          {users.map((x, i) => (
            <div key={i} className={style.userRowContainer}>
              <div>
                <h4>{x?.username}</h4>
                <p>{x?.email}</p>
              </div>
              <button
                onClick={() => {
                  if (x?.blocked) {
                    handleUnBlock(x?._id);
                  } else {
                    handleBlock(x?._id);
                  }
                }}
                className={style?.[x?.blocked ? "unBlockBtn" : "blockBtn"]}
              >
                {x?.blocked ? "UnBlock" : "Block"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
