import React from "react";
import "swiper/components/navigation/navigation.min.css";
import "swiper/components/pagination/pagination.min.css";
import SwiperCore, { Autoplay, Navigation, Pagination } from 'swiper/core';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper.min.css";
import { Link } from "react-router-dom";

const RelatedProductsCarousel = ({ products }) => {
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Sản phẩm tương tự</h2>
      <Swiper
        modules={[Navigation, Pagination]}
        slidesPerView={1}
        spaceBetween={20}
        navigation
        pagination={{ clickable: true }}
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }}
      >
        {products.map((product) => (
          <SwiperSlide key={product._id}>
            <Link to={`/products/${product.slug}`}>
              <div className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition">
                <img
                  src={product.images?.[0]}
                  alt={product.name}
                  className="h-40 w-full object-cover rounded mb-3"
                />
                <h3 className="font-semibold text-lg truncate">{product.name}</h3>
                <p className="text-red-700 font-bold mt-2">
                  {Number(product.price).toLocaleString("vi-VN")} VNĐ
                </p>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default RelatedProductsCarousel;
