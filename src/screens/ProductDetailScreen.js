import React, { useState, useEffect } from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { BsArrowLeft, BsCart2 } from "react-icons/bs";
import Rating from "react-rating";
import Fade from "react-reveal/Fade";
import { Link, useParams } from "react-router-dom";
import swal from "sweetalert";
import useFetch from "../hooks/useFetch";
import useOrder from "../hooks/useOrder";
import { jwtDecode } from "jwt-decode"; // sửa import jwtDecode đúng
import CommentSection from "../components/Comment/CommentSection";
import RelatedProductsCarousel from "../components/products/RelatedProductsCarousel";

const ProductDetailScreen = () => {
  const [disabled, setDisabled] = useState(false);
  const { slug } = useParams();
  const [selectedImage, setSelectedImage] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const { data } = useFetch(`product/slug/${slug}`, {
    asArray: false,
    hasDataKey: true,
  });
  const {
    data: fetchedRelatedProducts,
    loading,
    error,
  } = useFetch(`product/related/${slug}`, {
    asArray: true,
    hasDataKey: true,
  });

  useEffect(() => {
    if (fetchedRelatedProducts?.length) {
      setRelatedProducts(fetchedRelatedProducts);
    }
  }, [fetchedRelatedProducts]);

  const token = localStorage.getItem("accessToken");
  let decoded = null;
  try {
    decoded = token ? jwtDecode(token) : null;
  } catch (error) {
    console.error("Token decode error:", error);
  }

  const userId = decoded.id;

  const { handleCart, orders } = useOrder();

  return (
    <section className="max-w-screen-xl py-24 mx-auto px-6  overflow-y-hidden">
      <div className="flex flex-col justify-center items-center pt-24">
        {data && (
          <div className="p-6 box-border grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10">
            {/* image  */}
            <div>
              <Fade left>
                <img
                  style={{
                    width: "400px",
                    height: "300px",
                  }}
                  className="mx-auto rounded-lg"
                  src={selectedImage || data?.images?.[0]}
                  alt="coverimg"
                />

                {/* Thumbnail image list */}
                <div className="flex space-x-2 mt-4">
                  {data?.images?.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`thumbnail-${index}`}
                      className={`w-20 h-20 object-cover rounded cursor-pointer border ${
                        selectedImage === img
                          ? "border-blue-500"
                          : "border-gray-300"
                      }`}
                      onClick={() => setSelectedImage(img)}
                    />
                  ))}
                </div>
              </Fade>
            </div>

            {/* details  */}
            <div className="flex flex-col justify-center h-full">
              <Fade left>
                <div className="border-b border-gray-400 pb-4">
                  <h1 className="poppins text-gray-800 text-3xl">
                    {data.name}
                  </h1>

                  <div className="flex items-center space-x-3 mt-4">
                    <Rating
                      emptySymbol={
                        <AiOutlineStar className="text-gray-600 text-xl" />
                      }
                      fullSymbol={
                        <AiFillStar className="text-yellow-400 text-xl" />
                      }
                      initialRating={4} // hardcoded vì không có rating trong response
                      readonly
                    />
                    <span className="text-gray-600">(100 reviews)</span>{" "}
                    {/* hardcoded luôn nếu chưa có reviews */}
                  </div>

                  <div
                    className="text-gray-400 my-4"
                    dangerouslySetInnerHTML={{ __html: data.description }}
                  />
                </div>

                <div className="flex items-center justify-between py-6">
                  <h2 className="text-3xl text-red-900 font-bold poppins">
                    {Number(data.price).toLocaleString("vi-VN")} VNĐ
                  </h2>
                  <button
                    disabled={disabled}
                    className={`w-36 btn-primary py-3 px-6 poppins text-sm flex items-center space-x-3 text-center justify-center ${
                      disabled ? "opacity-30" : ""
                    }`}
                    onClick={() => {
                      handleCart(data);
                      setDisabled(true);
                      swal(
                        "Xin chúc mừng!!!",
                        "Sản phẩm đã được thêm vào giỏ hàng thành công",
                        "success"
                      );
                    }}
                  >
                    <BsCart2 />
                    <span>
                      {orders.some((item) => item._id === data._id) || disabled
                        ? "Đã thêm"
                        : "Thêm"}
                    </span>
                  </button>
                </div>
              </Fade>
            </div>

            <Link
              to="/products"
              className="pt-4 text-blue-500 text-sm hover:underline flex items-center space-x-3"
            >
              <BsArrowLeft /> <span>Back</span>
            </Link>
          </div>
        )}
      </div>
      {relatedProducts?.length > 0 && (
        <RelatedProductsCarousel products={relatedProducts} />
      )}
      {data && (
        <>
          {/* Các phần trước như ảnh, mô tả... */}
          <CommentSection productId={data._id} />
        </>
      )}
    </section>
  );
};

export default ProductDetailScreen;
