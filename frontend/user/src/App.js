import "./App.css";
import Footer from "./components/Layouts/Footer";
import Header from "./components/Layouts/Header";
import AllRoutes from "./routes/AllRoutes";
import React, { useEffect } from "react";
import { isTokenExpired } from "./Hooks/ValidJWT";
import { toast } from "react-toastify";

function App() {

  const token = sessionStorage.getItem("token");

  useEffect(() => {
    // Kiểm tra ngày hết hạn của token khi thành phần được tạo và mỗi khi token thay đổi
    if(token){
      if (isTokenExpired(token)) {
        // Thực hiện hành động đăng xuất (ví dụ, xóa token khỏi lưu trữ, đặt lại trạng thái người dùng)
        // Ví dụ, nếu bạn lưu trữ token trong sessionStorage:
        sessionStorage.removeItem("token");
        toast.success("Phiên đăng nhập của bạn đã hết hạn! Vui lòng đăng nhập lại!!!")

        // Chuyển hướng người dùng đến trang đăng nhập hoặc trang thông báo họ đã bị đăng xuất
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      }
    }
  }, [token]);

  return (
    <div className="dark:bg-dark">
      <Header />
      <AllRoutes />
      <Footer />
    </div>
  );
}

export default App;
