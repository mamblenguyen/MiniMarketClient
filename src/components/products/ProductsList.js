// components/products/ProductsList.js
import React from "react";
import useFetch from "../../hooks/useFetch";
import ProductCard from "./ProductCard";

const ProductsList = () => {
const {data}  = useFetch(`product`, {
  asArray: true,
  hasDataKey: true
});   
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4 py-8">
      {data.map((product) => (
        <ProductCard key={product._id} {...product} />
      ))}
    </div>
  );
};

export default ProductsList;
