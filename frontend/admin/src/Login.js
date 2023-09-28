import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const email = useRef();
  const password = useRef();

  async function handleLogin(ev) {
    ev.preventDefault();

    const authDetail = {
      email: email.current.value,
      password: password.current.value,
    };

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(authDetail),
    };

    try {
      const response = await fetch("http://localhost:8080/admin/login", requestOptions);

      if (response.status === 200) {
        const data = await response.json();
        const accessToken = data.accessToken;
        //console.log(accessToken)

        // Lưu trữ JWT token vào session storage
        sessionStorage.setItem("token", JSON.stringify(accessToken));

        // Chuyển hướng đến trang chủ
        navigate("/");
      } else if (response.status === 400) {
        // Xử lý trường hợp đăng nhập thất bại
        const data = await response.json();
        toast.error(data.message);
      } else {
        // Xử lý trường hợp lỗi không xác định
        toast.error("An error occurred. Please try again later.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("An error occurred. Please try again later.");
    }
  }
  return (
    <main class="d-flex flex-column justify-content-center align-items-center min-vh-100">
      <section>
        <p class="text-center text-2xl font-semibold my-10 underline">
          Đăng nhập
        </p>
      </section>
      <form onSubmit={handleLogin} class="text-center">
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input
            ref={email}
            id="email"
            placeholder="Enter Your Email"
            type="email"
            required
            autoComplete="off"
            class="form-control custom-input"
          />
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Mật khẩu</label>
          <input
            ref={password}
            id="password"
            placeholder="Enter Your Password"
            type="password"
            required
            autoComplete="off"
            class="form-control custom-input"
          />
        </div>
        <br></br>
        <button class="btn btn-primary custom-button">Đăng nhập</button>
      </form>
    </main>
  );
};

export default Login;
