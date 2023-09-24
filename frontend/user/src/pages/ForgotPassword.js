import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { useLocation } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [verifyToken, setVerifyToken] = useState(""); // State để lưu giá trị mã xác nhận
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get("email");

  const handleSendConfirmationCode = async () => {
    try {
      const token = JSON.parse(sessionStorage.getItem("token"));
      // Gọi API GET localhost:8080/send-confirmation
      const response = await axios.get(
        `http://localhost:8080/send-confirmation`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Gửi mã xác nhận thành công!");
      } else {
        toast.error("Gửi mã xác nhận thất bại");
      }
    } catch (error) {
      toast.error("Gửi mã xác nhận thất bại");
    }
  };

  const handleChangePassword = async (ev) => {
    ev.preventDefault();
    if (newPassword !== confirmNewPassword) {
      toast.error("Mật khẩu không khớp. Vui lòng nhập lại");
      return;
    }

    try {
      const token = JSON.parse(sessionStorage.getItem("token"));
      // Gọi API POST localhost:8080/change-password
      const response = await axios.post(
        `http://localhost:8080/change-password`,
        {
          "newPassword": newPassword,
          "confirmNewPassword": confirmNewPassword,
          "confirmToken": verifyToken,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Đổi mật khẩu thành công!");
        sessionStorage.removeItem("token");
        // Redirect to /login after successful password change
        navigate("/login");
      } else {
        toast.error("Đổi mật khẩu thất bại");
      }
    } catch (error) {
      toast.error("Đổi mật khẩu thất bại");
    }
  };

  return (
    <main>
      <section>
        <p className="text-2xl text-center font-semibold dark:text-slate-100 my-10 underline underline-offset-8">
          Đổi mật khẩu
        </p>
      </section>
      <form>
        <div className="mb-6">
          <label
            htmlFor="newPassword"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Mật khẩu mới
          </label>
          <input
            type="password"
            id="newPassword"
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
            placeholder="Nhập mật khẩu mới của bạn tại đây"
            value={newPassword}
            onChange={(ev) => setNewPassword(ev.target.value)}
            required
            autoComplete="off"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="confirmNewPassword"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Xác nhận lại mật khẩu
          </label>
          <input
            type="password"
            id="confirmNewPassword"
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
            placeholder="Xác nhận mật khẩu mới của bạn"
            value={confirmNewPassword}
            onChange={(ev) => setConfirmNewPassword(ev.target.value)}
            required
            autoComplete="off"
          />
        </div>

        <label
          htmlFor="verifyToken"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
        >
          Mã xác nhận
        </label>

        <div className="mb-6" style={{ display: "table" }}>
          <div style={{ display: "table-cell" }}>
            <input
              type="text"
              id="verifyToken"
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
              placeholder="Nhập mã xác nhận tại đây"
              value={verifyToken}
              onChange={(ev) => setVerifyToken(ev.target.value)}
              required
              autoComplete="off"
            />
          </div>

          <button
            style={{ display: "flex" }}
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={handleSendConfirmationCode}
          >
            Gửi mã xác nhận
          </button>
        </div>

        <button
          type="button"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          onClick={handleChangePassword}
        >
          Đổi mật khẩu
        </button>
      </form>
    </main>
  );
};

export default ForgotPassword;
