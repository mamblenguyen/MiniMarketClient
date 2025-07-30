import { useState, useEffect } from "react";
import useFetch from "../../hooks/useFetch";
import {jwtDecode} from "jwt-decode";
    const baseUrl = process.env.REACT_APP_API_BASE_URL;

const InfoForm = () => {

  const token = localStorage.getItem("accessToken");
  let decoded = null;
  try {
    decoded = token ? jwtDecode(token) : null;
  } catch (error) {
    console.error("Token decode error:", error);
  }

  const data = useFetch(
    decoded ? `auth/${decoded.id}` : null,
    {
      asArray: false,
      hasDataKey: true,
    }
  );

  const [fullname, setFullname] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(
    "https://cdn-icons-png.flaticon.com/512/236/236832.png"
  );
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [typeLogin, setTypeLogin] = useState("");

  useEffect(() => {
    if (data?.data) {
      setFullname(data.data.fullname || "");
      setPhone(data.data.phone || "");
      setAddress(data.data.address || "");
      setAvatarUrl(
        data.data.avatar ||
          "https://cdn-icons-png.flaticon.com/512/236/236832.png"
      );
      setTypeLogin(data.data.typeLogin || "");
    }
  }, [data?.data]);

  useEffect(() => {
    return () => {
      if (avatarUrl && avatarUrl.startsWith("blob:")) {
        URL.revokeObjectURL(avatarUrl);
      }
    };
  }, [avatarUrl]);

  const handleAvatarChange = (e) => {
    // Nếu đăng nhập bằng google thì không cho đổi ảnh
    if (typeLogin === "google") {
      alert("Không thể đổi ảnh khi đăng nhập bằng Google.");
      return;
    }

    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const imageUrl = URL.createObjectURL(file);
      setAvatarUrl(imageUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!decoded) {
      alert("Token không hợp lệ hoặc hết hạn.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("fullname", fullname);
    formData.append("phone", phone);
    formData.append("address", address);
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }
  const token = localStorage.getItem("accessToken");

    try {
      const response = await fetch(`${baseUrl}/auth/${decoded.id}`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,

        },
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        alert("Cập nhật thành công!");
        setAvatarUrl(result.avatar || avatarUrl);
        setAvatarFile(null);
      } else {
        const errorData = await response.json();
        alert("Cập nhật thất bại: " + (errorData.message || "Lỗi không xác định"));
      }
    } catch (error) {
      alert("Lỗi khi cập nhật: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">
        Cập nhật thông tin
      </h2>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="block mb-1">Tên</label>
          <input
            type="text"
            className="w-full border px-4 py-2 rounded"
            placeholder="Nhập tên"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1">Số điện thoại</label>
          <input
            type="text"
            className="w-full border px-4 py-2 rounded"
            placeholder="Nhập số điện thoại"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1">Địa chỉ</label>
          <input
            type="text"
            className="w-full border px-4 py-2 rounded"
            placeholder="Nhập địa chỉ"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1">Ảnh đại diện</label>
          <img
            src={avatarUrl}
            alt="Avatar Preview"
            className="w-24 h-24 object-cover rounded-full mb-2"
          />
          {typeLogin === "google" ? (
            <p className="text-red-600 text-sm">
              Bạn không thể đổi ảnh khi đăng nhập bằng Google.
            </p>
          ) : (
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="w-full"
            />
          )}
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Đang cập nhật..." : "Cập nhật"}
        </button>
      </form>
    </>
  );
};

export default InfoForm;
