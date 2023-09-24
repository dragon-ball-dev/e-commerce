import React from "react";
import { Link } from "react-router-dom";
import Rating from "./Rating";
import axios from "axios";
import { toast } from "react-toastify";

const ProductCard = ({ product }) => {
  const { id, name, description, image, categoryName, price, quantityStock } = product;

  const handleAddToCart = async () => {
    try {
      // Get token from session storage
      const token = JSON.parse(sessionStorage.getItem("token"));

      // Set headers with the JWT token
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      // Make the POST request to the API
      const response = await axios.post(
        `http://localhost:8080/user/add-product/${id}`,
        {},
        { headers }
      );

      // Check if the request is successful (status code 200)
      if (response.status === 200) {
        // Handle success (You can show a success message or update the cart state)
        toast.success("Thêm sản phẩm vào giỏ hàng thành công!!!");
      } else {
        // Handle other status codes or errors
        toast.error("Thêm sản phẩm vào giỏ hàng thất bại!!!")
      }
    } catch (error) {
      // Handle any errors that occur during the API call
      toast.error("Thêm sản phẩm vào giỏ hàng thất bại!!!")
    }
  };

  return (
    <div className=" m-3 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
      <Link to={`/products/${id}`} className="relative">
        {description && (
          <span className="absolute top-4 left-2 px-2 bg-orange-500 bg-opacity-90 text-white rounded">
            Bán chạy nhất
          </span>
        )}

        <img className="rounded-t-lg w-full h-64" src={image} alt={name} />
      </Link>
      <div className="p-5">
        <Link to={`/products/${id}`}>
          <h5 className="dark:text-slate-100 text-gray-900 font-bold text-2xl mb-2">
            {name}
          </h5>
        </Link>
        <p className="dark:text-slate-100 text-gray-700 font-normal mb-3">
          {price}
        </p>
        <div className="flex items-center my-2">
          <Rating rating={"4STARSABOVE"} />
          {/* <i className="text-lg bi-star-fill text-yellow-500 mr-1"></i>
          <i className="text-lg bi-star-fill text-yellow-500 mr-1"></i>
          <i className="text-lg bi-star-fill text-yellow-500 mr-1"></i>
          <i className="text-lg bi-star-fill text-yellow-500 mr-1"></i>
          <i className="text-lg bi-star-fill text-yellow-500 mr-1"></i> */}
        </div>
        <p className="flex justify-between items-center">
          <span className="text-2xl dark:text-gray-200">
            <span>{price}</span>
            <span>$</span>
          </span>
          <button
            className="inline-flex items-center py-2 px-3 text-sm font-medium text-center bg-blue-700 text-white rounded hover:bg-blue-900"
            onClick={handleAddToCart} // Attach the click event handler
          >
            Thêm vào giỏ hàng <i className="text-2xl font-medium bi-plus"></i>
          </button>
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
