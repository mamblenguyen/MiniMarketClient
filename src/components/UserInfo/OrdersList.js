import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
    const baseUrl = process.env.REACT_APP_API_BASE_URL;

const getStatusBadge = (status) => {
  const base = "inline-block px-3 py-1 text-xs font-semibold rounded-full";

  switch (status) {
    case "pending":
      return (
        <span className={`${base} bg-yellow-100 text-yellow-800`}>
          Đang xử lý
        </span>
      );
    case "purched":
      return (
        <span className={`${base} bg-green-100 text-green-800`}>
          Đã thanh toán
        </span>
      );
    case "processing":
      return (
        <span className={`${base} bg-blue-100 text-blue-800`}>Đang xử lý</span>
      );
    case "shipped":
      return (
        <span className={`${base} bg-cyan-100 text-cyan-800`}>Đã gửi hàng</span>
      );
    case "delivered":
      return (
        <span className={`${base} bg-green-100 text-green-800`}>Đã giao</span>
      );
    case "cancelled":
      return <span className={`${base} bg-red-100 text-red-800`}>Đã hủy</span>;
    case "completed":
      return (
        <span className={`${base} bg-emerald-100 text-emerald-800`}>
          Hoàn thành
        </span>
      );
    default:
      return (
        <span className={`${base} bg-gray-100 text-gray-800`}>{status}</span>
      );
  }
};

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const token = localStorage.getItem("accessToken");
  let decoded = null;
  try {
    decoded = token ? jwtDecode(token) : null;
  } catch (error) {
    console.error("Token decode error:", error);
  }

  useEffect(() => {
      const token = localStorage.getItem("accessToken");

    const fetchOrders = async () => {
      const res = await fetch(
        `${baseUrl}/orders/user/${decoded.id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      setOrders(data);
    };
    fetchOrders();
  }, []);

  const toggleCollapse = (orderId) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">
        🧾 Đơn hàng của bạn
      </h2>

      {orders.length === 0 ? (
        <p className="text-gray-500">Bạn chưa có đơn hàng nào.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            className="bg-white shadow-md rounded-xl p-5 mb-6 border hover:shadow-lg transition"
          >
            <div
              className="flex justify-between items-center mb-4 cursor-pointer"
              onClick={() => toggleCollapse(order._id)}
            >
              <div>
                <p className="font-semibold text-lg">
                  Mã đơn: {order.orderCode}
                </p>
                <p className="text-sm text-gray-600">
                  Ngày tạo: {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
              <div>{getStatusBadge(order.status)}</div>
            </div>

            {expandedOrderId === order._id && (
              <div className="mt-4 space-y-4 text-sm text-gray-700">
                <div>
                  <p className="font-medium text-gray-800">🛍️ Sản phẩm:</p>
                  <ul className="mt-2 space-y-2 pl-4 list-disc">
                    {order.items.map((item) => (
                      <li key={item._id}>
                        <div className="flex items-center space-x-2">
                          <img
                            src={item.product.images?.[0]}
                            alt={item.product.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div>
                            <p className="font-medium">{item.product.name}</p>
                            <p>Số lượng: {item.quantity}</p>
                            <p>Giá: {item.price.toLocaleString()}₫</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="font-medium text-gray-800">
                    📦 Địa chỉ giao hàng:
                  </p>
                  <p>{order.shippingAddress.recipientName}</p>
                  <p>{order.shippingAddress.phone}</p>
                  <p>{order.shippingAddress.address}</p>
                </div>

                <div>
                  <p className="font-medium text-gray-800">
                    💳 Phương thức thanh toán:
                  </p>
                  <p>
                    {order.paymentMethod === "card"
                      ? "Thẻ ngân hàng"
                      : "Thanh toán trực tiếp"}
                  </p>
                </div>

                <div className="font-semibold text-right text-lg text-blue-700">
                  Tổng tiền: {order.totalAmount.toLocaleString()}₫
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default OrdersList;
