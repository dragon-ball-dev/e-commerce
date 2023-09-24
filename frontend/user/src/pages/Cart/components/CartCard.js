import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const CartCard = ({ product }) => {
  const handleDeleteProduct = async () => {
    try {
      const token = JSON.parse(sessionStorage.getItem("token"));
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      // Gọi API DELETE với đoạn jwt token kèm theo
      const response = await axios.delete(
        `http://localhost:8080/user/product/${product.id}`,
        { headers: headers }
      );

      // Xử lý kết quả từ server (nếu cần)

       // Hiển thị thông báo xóa thành công
       toast.success("Xóa sản phẩm thành công!");

       // Reload lại trang
       setTimeout(() => {
        window.location.reload();
      }, 1000);

      // Thực hiện các hành động khác sau khi xóa sản phẩm thành công (nếu cần)

    } catch (error) {
      toast.error("Xóa sản phẩm thất bại. Vui lòng thử lại sau.");
    }
  };

  return (
    <div className="flex flex-wrap justify-between border-b dark:border-slate-700 max-w-4xl m-auto p-2 mb-5">
      <div className="flex">
        <Link to={`/products/${product.id}`}>
          <img className="w-32" src={product.image} alt={product.name} />
        </Link>
        <div className="">
          <Link to={`/products/${product.id}`}>
            <p className="text-lg ml-2 dark:text-slate-200">{product.name}</p>
          </Link>
          <button className="text-base ml-2 text-red-400" onClick={handleDeleteProduct}>
            Xóa sản phẩm
          </button>
        </div>
      </div>
      <div className="text-lg m-2 dark:text-slate-200">
        <span>{product.quantityStock} sản phẩm</span>
      </div>
      <div className="text-lg m-2 dark:text-slate-200">
        <span>{product.price} VNĐ</span>
      </div>
    </div>
  );
};

export default CartCard;
