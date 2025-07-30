import React, { useState, useEffect } from "react";
import swal from "sweetalert";
import { jwtDecode } from "jwt-decode"; // sửa import jwtDecode đúng
import useFetch from "../../hooks/useFetch";
    const baseUrl = process.env.REACT_APP_API_BASE_URL;

const OrderSummary = ({ products, onPlaceOrder }) => {
  const token = localStorage.getItem("accessToken");
  let decoded = null;
  try {
    decoded = token ? jwtDecode(token) : null;
  } catch (error) {
    console.error("Token decode error:", error);
  }

  const data = useFetch(decoded ? `auth/${decoded.id}` : null, {
    asArray: false,
    hasDataKey: true,
  });

  // Duy trì 1 state cho form shippingAddress
  const [shippingAddress, setShippingAddress] = useState({
    recipientName: "",
    phone: "",
    address: "",
  });

  // Khi data từ API load về, cập nhật luôn vào shippingAddress
  useEffect(() => {
    if (data?.data) {
      setShippingAddress({
        recipientName: data.data.fullname || "",
        phone: data.data.phone || "",
        address: data.data.address || "",
      });
    }
  }, [data?.data]);

  const totalPrice = products.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [note, setNote] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAddressChange = (field, value) => {
    setShippingAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (
      !shippingAddress.recipientName ||
      !shippingAddress.phone ||
      !shippingAddress.address
    ) {
      alert("Vui lòng nhập đầy đủ thông tin người nhận");
      return;
    }

    const orderData = {
      orderType: "delivery",
      items: products.map(({ product, quantity }) => ({
        product: product._id,
        quantity,
      })),
      recipientName: shippingAddress.recipientName,
      phone: shippingAddress.phone,
      paymentMethod,
      status: "pending",
      note,
      shippingAddress,
      user: decoded.id,
    };

    setLoading(true);

    try {
      let response;
      if (paymentMethod === "card") {
        response = await fetch(
          `${baseUrl}/orders/create-order-and-generate-qr`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },

            body: JSON.stringify(orderData),
          }
        );
        swal({
          title: "Xin cảm ơn",
          text: "Đặt hàng thành công , xin vui lòng chuyển khoản",
          icon: "success",
          buttons: ["Không", "Có, tôi đồng ý!"],
        }).then((willDelete) => {
          if (willDelete) {
            console.log("Người dùng đã xác nhận.");
          } else {
            console.log("Người dùng đã hủy.");
          }
        });
      } else {
        response = await fetch(`${baseUrl}/orders`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(orderData),
        });

        swal({
          title: "Xin chúc mừng",
          text: "Bạn đã đặt hàng thành công",
          icon: "success",
          buttons: {
            confirm: "OK",
          },
        }).then((willDelete) => {
          if (willDelete) {
            window.location.href = "/";
          }
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Đặt hàng thất bại: ${errorData.message || response.statusText}`);
        setLoading(false);
        return;
      }

      const data = await response.json();

      if (paymentMethod === "card") {
        setQrCodeUrl(data.qrCodeUrl);
      }

      await fetch(`${baseUrl}/cart/clear`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: onPlaceOrder }),
      });
    } catch (error) {
      alert("Lỗi mạng hoặc server: " + error.message);
    }

    setLoading(false);
  };

  return (
    <div className="bg-white p-6 rounded shadow-md max-w-md mx-auto mt-6">
      {qrCodeUrl && (
        <div className="mt-6 text-center">
          <h3 className="text-lg font-semibold mb-2">
            Quét mã QR để thanh toán
          </h3>
          <img
            src={qrCodeUrl}
            alt="QR Code Thanh Toán"
            className="mx-auto w-64 h-64 object-contain border p-2 rounded"
          />
        </div>
      )}
      <h2 className="text-xl font-semibold mb-4">Thông tin đơn hàng</h2>

      <div className="mb-4">
        <label className="block font-medium mb-1">Phương thức thanh toán</label>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="border rounded px-3 py-2 w-full"
        >
          <option value="card">Chuyển khoản</option>
          <option value="cash">Thanh toán trực tiếp</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Tên người nhận</label>
        <input
          type="text"
          value={shippingAddress.recipientName}
          onChange={(e) => handleAddressChange("recipientName", e.target.value)}
          className="border rounded px-3 py-2 w-full"
          placeholder="Nguyễn Văn A"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Số điện thoại</label>
        <input
          type="text"
          value={shippingAddress.phone}
          onChange={(e) => handleAddressChange("phone", e.target.value)}
          className="border rounded px-3 py-2 w-full"
          placeholder="0912345678"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Địa chỉ</label>
        <input
          type="text"
          value={shippingAddress.address}
          onChange={(e) => handleAddressChange("address", e.target.value)}
          className="border rounded px-3 py-2 w-full"
          placeholder="123 Trần Hưng Đạo, Quận 1, TP.HCM"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Ghi chú</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="border rounded px-3 py-2 w-full"
          placeholder="Giao trong giờ hành chính"
          rows={3}
        />
      </div>

      <div className="text-right font-bold text-xl mb-4">
        Tổng tiền: {totalPrice.toLocaleString()} VNĐ
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`w-full py-3 rounded font-semibold text-white ${
          loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {loading ? "Đang xử lý..." : "Đặt hàng"}
      </button>
    </div>
  );
};

export default OrderSummary;
