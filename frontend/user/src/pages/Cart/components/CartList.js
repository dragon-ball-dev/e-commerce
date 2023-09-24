import React, { useState, useEffect } from "react";
import axios from "axios";
import CartCard from "./CartCard";

const ProductList = () => {
  const [productList, setProductList] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const token = JSON.parse(sessionStorage.getItem("token"));
        const response = await axios.get("http://localhost:8080/user/product", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data;
        setProductList(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    }
    fetchProducts();
  }, []);

  const total = productList.reduce(
    (acc, product) => acc + product.price * product.quantityStock,
    0
  );


  return (
    <>
      <section>
        <p className="text-2xl text-center font-semibold dark:text-slate-100 my-10 underline underline-offset-8">
          Danh sách sản phẩm
        </p>
      </section>
      <section>
        {productList.map((product) => (
          <CartCard key={product.id} product={product} />
        ))}
      </section>
      <section className="max-w-4xl m-auto">
        <div className="flex flex-col p-2 border-b dark:border-slate-700 text-lg dark:text-slate-100">
          <p className="flex justify-between my-2">
            <span className="font-semibold">Tổng tiền:</span>
            <span>{total} VNĐ</span>
          </p>
        </div>
        <div className="text-right my-5">
        <a href="/check-out">
          <button
            onClick // Gọi hàm handlePlaceOrderClick khi người dùng nhấn nút
            type="button"
            className="bg-blue-700 text-white px-4 py-2.5 rounded-lg hover:bg-blue-900 focus-"
          >
            Đặt hàng<i className="ml-2 bi bi-arrow-right"></i>
          </button>
        </a>
        </div>
      </section>
      
    </>
  );
};

export default ProductList;
