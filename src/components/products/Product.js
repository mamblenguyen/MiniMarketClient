import React, { useState } from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { BsCart2 } from "react-icons/bs";
import Rating from "react-rating";
import { useNavigate } from "react-router-dom";

import swal from "sweetalert";
import useAuth from "../../hooks/useAuth";
import useOrder from "../../hooks/useOrder";
import Button from "../Form/Button";

const Product = (props) => {
  const [disabled, setDisabled] = useState(false);
  const { name, images, price, slug, _id } = props; // đổi title thành name
  const navigate = useNavigate();
  const { handleCart, orders } = useOrder();
  const { user } = useAuth();
  
  return (
    <div className="flex flex-col justify-center items-center space-y-3 bg-white border border-gray-200 hover:shadow-xl transition duration-700 ease-in-out transform hover:scale-105 p-4 box-border rounded-xl">
      <img className="w-full h-72" src={images[0]} alt={name} />
      <h1 className="text-gray-600 poppins text-lg text-center">
        {name?.slice(0, 69)}
      </h1>

      <h2 className="text-red-900 text-center font-bold poppins text-2xl">
        {price} VNĐ
      </h2>

      <div className="flex items-center space-x-3">
        {user?.displayName && (
          <button
            disabled={disabled}
            className={`${
              disabled ? "opacity-30" : ""
            } w-36 btn-primary py-3 px-4 poppins text-sm flex items-center justify-center space-x-3 text-center`}
            onClick={() => {
              handleCart(props);
              setDisabled(true);
              swal(
                "Chúc mừng!!!",
                "Bạn thêm vào giỏ hàng thành công",
                "success"
              );
            }}
          >
            <BsCart2 />
            <span>
              {orders.find((item) => item._id === _id) || disabled
                ? "Đã thêm"
                : "Thêm"}
            </span>
          </button>
        )
        
        }

        <Button
          className="w-36 btn-primary py-3 px-2 poppins text-sm"
          text="Xem"
          onClick={() => navigate(`/products/${slug}`)}
        />
      </div>
    </div>
  );
};
export default Product;
