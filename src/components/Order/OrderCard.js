import React, { useState } from 'react';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { MdDeleteOutline } from 'react-icons/md';
import Rating from 'react-rating';
import Bounce from 'react-reveal/Bounce';
import useOrder from '../../hooks/useOrder';

const OrderCard = ({ product, quantity }) => {
  const { removeProduct, updateQuantity } = useOrder(); 
  const { name, images, price, _id, rating = 4, reviews = 0, userId } = product;
  
  const [localQuantity, setLocalQuantity] = useState(quantity);

  const handleIncrease = () => setLocalQuantity(prev => prev + 1);
  const handleDecrease = () => setLocalQuantity(prev => (prev > 1 ? prev - 1 : 1));
  const handleUpdate = () => {
    updateQuantity(_id, localQuantity);
  };

  return (
    <Bounce left>
      <div className="space-y-4 bg-gray-50 rounded-xl p-4 transition hover:scale-105 hover:shadow-xl duration-700">
        <div className="flex space-x-5">
          <div>
            <img className="w-40" src={images[0]} alt={name} />
          </div>
          <div className="flex flex-col justify-between flex-grow">
            <h1 className="text-lg poppins text-gray-700">{name}</h1>
            <h2 className="text-gray-900 font-bold poppins text-2xl">{price} VNĐ</h2>

            <div className="flex items-center space-x-2">
              <button onClick={handleDecrease} className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300">-</button>
              <span>{localQuantity}</span>
              <button onClick={handleIncrease} className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300">+</button>
              <button onClick={handleUpdate} className="ml-4 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">Cập nhật</button>
            </div>

            <div className="flex items-center space-x-2 mt-2">
              <Rating emptySymbol={<AiOutlineStar className="text-gray-600 text-xl" />} fullSymbol={<AiFillStar className="text-yellow-400 text-xl" />} initialRating={rating} readonly />
              <span className="text-gray-600">({reviews})</span>
            </div>
          </div>
          <div>
            <MdDeleteOutline className="text-2xl text-gray-600 cursor-pointer" onClick={() => removeProduct(_id)} />
          </div>
        </div>
      </div>
    </Bounce>
  );
};

export default OrderCard;
