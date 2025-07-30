import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
    const baseUrl = process.env.REACT_APP_API_BASE_URL;

export const OrderContext = createContext();

const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.id);
      } catch (err) {
        console.error("Invalid token:", err);
      }
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetchCart();
    }
  }, [userId]);

  // Fetch cart on mount

  const fetchCart = async () => {
    const token = localStorage.getItem("accessToken");

    try {
      const res = await axios.get(`${baseUrl}/cart/${userId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      res.data.items.userId = res.data.user;
      setOrders(res.data.items || []);
    } catch (err) {
      console.error("Fetch cart failed:", err);
    }
  };
  // useEffect(() => {
  //       fetchCart();
  //   }, []);

  // Add to cart
  const handleCart = async (product) => {
    try {
      const token = localStorage.getItem("accessToken"); // hoặc sessionStorage nếu bạn lưu ở đó

      await axios.post(
        `${baseUrl}/cart/add`,
        {
          userId,
          productId: product._id,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchCart(); // Refresh cart
    } catch (err) {
      console.error("Add to cart failed:", err);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    const token = localStorage.getItem("accessToken"); // hoặc sessionStorage nếu bạn lưu ở đó

    try {
      await axios.put(
        `${baseUrl}/cart/update`,
        {
          userId,
          productId,
          quantity,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchCart(); // Refresh lại giỏ hàng
    } catch (err) {
      console.error("Update quantity failed:", err);
    }
  };

  // Remove one product
 const removeProduct = async (productId) => {
  const token = localStorage.getItem("accessToken");

  try {
    await axios.delete(`${baseUrl}/cart/remove`, {
      data: {
        userId,
        productId,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    fetchCart(); // Refresh cart
  } catch (err) {
    console.error("Remove product failed:", err);
  }
};

  // Clear entire cart
  const clearCart = async () => {
    try {
      const promises = orders.map((item) => removeProduct(item.product._id));
      await Promise.all(promises);
      setOrders([]);
    } catch (err) {
      console.error("Clear cart failed:", err);
    }
  };

  const value = {
    orders,
    fetchCart, // thêm nếu bạn muốn gọi lại từ bên ngoài
    handleCart,
    removeProduct,
    clearCart,
    updateQuantity,
  };

  return (
    <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
  );
};

export default OrderProvider;
