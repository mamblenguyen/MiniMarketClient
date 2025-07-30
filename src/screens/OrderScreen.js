import React from "react";
import Bounce from "react-reveal/Bounce";
import OrderCard from "../components/Order/OrderCard";
import useOrder from "../hooks/useOrder";
import OrderSummary from "../components/Order/OrderSummary ";

const OrderScreen = () => {
  const { orders, userId } = useOrder();
  // console.log(orders.userId);

  //   const { orderItems, removeProduct, updateQuantity } = useOrder();
  const UserId = (UserId) => {
    // return userId = orders.userId;
  };
  return (
    <section className="max-w-screen-xl py-24 mx-auto px-6">
      {orders.length === 0 ? (
        <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-24 w-24 text-blue-500 mb-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m5-9v9m4-9v9m1-20h-4a1 1 0 00-1 1v1h6V4a1 1 0 00-1-1z"
            />
          </svg>
          <h1 className="text-2xl font-semibold text-gray-700 mb-2">
            Giỏ hàng của bạn đang trống
          </h1>
          <p className="text-gray-500 text-center mb-6">
            Hiện tại bạn không có sản phẩm nào trong giỏ hàng.
          </p>
          <a
            href="/products"
            className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition duration-300"
          >
            Tiếp tục mua sắm
          </a>
        </div>
      ) : (
        <>
          {/* heading  */}
          <Bounce left>
            <div className="flex flex-col items-center space-x-2 pb-8">
              <h1 className="text-gray-700 poppins text-3xl">
                All{" "}
                <span className="text-blue-600 font-semibold select-none">
                  Orders
                </span>
              </h1>
              <div className="bg-blue-600 flex items-center justify-center w-16 h-1 mt-2 rounded-full"></div>
            </div>
          </Bounce>
          <div className="flex justify-center">
            <div className="flex flex-col space-y-4">
              {orders.map((item) => (
                <OrderCard key={item.id} {...item} />
              ))}
            </div>

            <div className="w-full md:w-1/3">
              <OrderSummary products={orders} onPlaceOrder={orders.userId} />
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default OrderScreen;
