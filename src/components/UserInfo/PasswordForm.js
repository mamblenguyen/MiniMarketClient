import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
    const baseUrl = process.env.REACT_APP_API_BASE_URL;

const PasswordForm = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const validate = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("Vui lòng nhập đầy đủ thông tin");
      return false;
    }
    if (newPassword.length < 6) {
      setError("Mật khẩu mới phải có ít nhất 6 ký tự");
      return false;
    }
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu mới và xác nhận không khớp");
      return false;
    }
    setError(null);
    return true;
  };
  const token = localStorage.getItem("accessToken");
  let decoded = null;
  try {
    decoded = token ? jwtDecode(token) : null;
  } catch (error) {
    console.error("Token decode error:", error);
  }
  useEffect(() => {
    if (decoded) {
      setUserId(decoded.id);
    }
  }, [decoded]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setMessage(null);
    setError(null);

    const dataForm = {
      userId,
      oldPassword,
      newPassword,
      confirmPassword,
    };

    try {
      const res = await fetch(`${baseUrl}/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(dataForm),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Đã xảy ra lỗi");
      }

      // ✅ Nếu backend trả về { message: "Đổi mật khẩu thành công" }
      setMessage(data.message || data);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra, vui lòng thử lại sau");
    } finally {
      setLoading(false);
    }
  };
useEffect(() => {
  if (message || error) {
    const timer = setTimeout(() => {
      setMessage(null);
      setError(null);
    }, 5000);
    return () => clearTimeout(timer);
  }
}, [message, error]);
  return (
    <>
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">
        Đổi mật khẩu
      </h2>

      {message && (
        <div className="mb-4 p-3 text-green-800 bg-green-200 rounded">
          {message}
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 text-red-800 bg-red-200 rounded">{error}</div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="block mb-1">Mật khẩu hiện tại</label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full border px-4 py-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Mật khẩu mới</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border px-4 py-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Xác nhận mật khẩu mới</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border px-4 py-2 rounded"
          />
        </div>
        <button
          type="submit"
          className={`bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 `}
        >
          Đổi mật khẩu
        </button>
      </form>
    </>
  );
};

export default PasswordForm;
