import React, { useState, useEffect } from "react";
import Bounce from "react-reveal/Bounce";
import InfoForm from "./InfoForm";
import PasswordForm from "./PasswordForm";
import Orders from "./OrdersList";
import useFetch from "../../hooks/useFetch";
import { jwtDecode } from "jwt-decode";
const CustomerUpdateScreen = () => {
  const [selectedTab, setSelectedTab] = useState("info");
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

  console.log(data.data.typeLogin);
useEffect(() => {
  if (data.data?.typeLogin === 'google' && selectedTab === 'password') {
    setSelectedTab('info');
  }
}, [data.data, selectedTab]);
  const renderContent = () => {
    switch (selectedTab) {
      case "info":
        return <InfoForm />;
      case "password":
        return <PasswordForm />;
      case "orders":
        return <Orders />;
      default:
        return null;
    }
  };

  return (
    <section className="max-w-screen-xl mx-auto py-16 px-6">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Menu bên trái */}
        <aside className="w-full md:w-1/4">
          <div className="bg-white shadow-md rounded-lg p-4 space-y-2">
            <button
              onClick={() => setSelectedTab("info")}
              className="block w-full text-left px-4 py-2 hover:bg-blue-100 rounded"
            >
              Cập nhật thông tin
            </button>
            {data.data?.typeLogin !== "google" && (
              <button
                onClick={() => setSelectedTab("password")}
                className="block w-full text-left px-4 py-2 hover:bg-blue-100 rounded"
              >
                Đổi mật khẩu
              </button>
            )}
            <button
              onClick={() => setSelectedTab("orders")}
              className="block w-full text-left px-4 py-2 hover:bg-blue-100 rounded"
            >
              Đơn hàng của bạn
            </button>
          </div>
        </aside>

        {/* Nội dung bên phải */}
        <main className="w-full md:w-3/4 bg-white shadow-md rounded-lg p-6">
          <Bounce bottom>{renderContent()}</Bounce>
        </main>
      </div>
    </section>
  );
};

export default CustomerUpdateScreen;
