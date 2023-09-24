import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Rating from "../components/Elements/Rating";
import useTitle from "../Hooks/useTitle";
import axios from "axios";
import { toast } from "react-toastify";

const ProductsDetails = () => {
  const { id } = useParams();
  const [product, setproduct] = useState([]);
  useTitle(product.name);
  useEffect(() => {
    async function fetchProduct() {
      const response = await fetch(`http://localhost:8080/product/${id}`);
      const data = await response.json();
      setproduct(data);
      console.log(data);
    }
    fetchProduct();
  }, [id]);

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
    <main>
      <section>
        <h1 className="mt-10 mb-5 text-4xl text-center font-bold text-gray-900 dark:text-slate-200">
          {product.name}
        </h1>
        <p className=" mb-5 text-center text-lg text-gray-900 dark:text-slate-200">
          {product.overview}
        </p>
        <div className="flex flex-wrap justify-around">
          <div className="max-w-xl my-3">
            <img className="rounded" src={product.poster} alt={product.name} />
          </div>
          <div className="max-w-xl my-3">
            <p className="text-3xl font-bold text-gray-900 dark:text-slate-200">
              <span className="mr-1">₹</span>
              <span>{product.price}</span>
            </p>
            <p className="my-3">
              <span>
                {product.description}
              </span>
            </p>
            <p className="my-4 select-none">
              {product.best_seller && (
                <span className="font-semibold text-amber-500 border bg-amber-50 rounde-lg px-3 py-1 mr-2">
                  Bán chạy
                </span>
              )}

              {product.in_stock && (
                <span className="font-semibold text-emerald-600 border bg-slate-100 rounded-lg px-3 py-1 mr-2">
                  Còn hàng
                </span>
              )}
              {!product.in_stock && (
                <span className="font-semibold text-emerald-600 border bg-slate-100 rounded-lg px-3 py-1 mr-2">
                  
                </span>
              )}
              <span className="font-semibold text-blue-500 border bg-slate-100 rounded-lg px-3 py-1 mr-2">
                {product.size} MB
              </span>
            </p>
            <p className="my-3">
              <button onClick={handleAddToCart} className="inline-flex items-center py-2 px-5 text-lg font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800">
                Thêm vào giỏ hàng<i className="ml-1 bi bi-plus-lg"></i>
              </button>
            </p>
            <p className="text-lg text-gray-900 dark:text-slate-200">
              {product.long_description}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ProductsDetails;
