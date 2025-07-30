import React from "react";
import { BsCart2 } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import useUser from "../../hooks/useUser"; // lấy user từ token
import useAuth from "../../hooks/useAuth"; // firebase signOut
import useOrder from "../../hooks/useOrder";

const AuthorizeUser = () => {
  const user = useUser();
  const { signOutUser } = useAuth();
  const navigate = useNavigate();
  const { orders } = useOrder();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    signOutUser();
    navigate("/");
    window.location.reload();
  };

  return (
    <>
      {user ? (
        <div className="flex items-center justify-end space-x-4">
          <div
            className="relative flex cursor-pointer"
            onClick={() => navigate("/orders")}
          >
            <span className="bg-blue-600 w-6 h-6 rounded-full flex items-center justify-center text-white poppins absolute -right-2 -top-2">
              {orders.length}
            </span>
            <BsCart2 className="cursor-pointer w-6 h-6 text-gray-700" />
          </div>
          {user.picture ? (
            <img
              src={user.picture}
              alt={user.displayName}
              className="w-10 h-10 rounded-full"
            />
          ) : (
            <img
              src="https://cdn-icons-png.flaticon.com/512/236/236832.png"
              alt={user.displayName}
              className="w-10 h-10 rounded-full"
            />
          )}

          <span
            onClick={() => navigate(`/UserInfo`)}
            className="text-black-600 cursor-pointer"
            style={{ textDecoration: "none" }}
          >
            {user.displayName}
          </span>
          <FiLogOut
            className="cursor-pointer w-6 h-6 text-gray-700"
            onClick={handleLogout}
          />
        </div>
      ) : (
        <div className="flex items-center justify-end space-x-6">
          <button className="poppins" onClick={() => navigate("/signin")}>
            Đăng nhập
          </button>
          <button
            className="btn-primary px-6 py-3  rounded-full"
            onClick={() => navigate("/signup")}
          >
            Đăng kí
          </button>
        </div>
      )}
    </>
  );
};

export default AuthorizeUser;
