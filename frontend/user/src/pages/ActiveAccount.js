import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { useLocation } from "react-router-dom";

const ActiveAccount = () => {
  const navigate = useNavigate();
  const [verifyToken, setVerifyToken] = useState(""); // State để lưu giá trị mã xác nhận
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get("email");
  async function handleRegister(ev) {
    ev.preventDefault();

    try {
      const response = await axios.get(`http://localhost:8080/active/${email}/${verifyToken}`);
      await wait(2000);
      if (response.status === 200) {
        toast.success("Kích hoạt tài khoản thành công!!!");
        // Redirect to /login after successful activation
        navigate("/login");
      } else {
        toast.error("Kích hoạt tài khoản thất bại");
      }
    } catch (error) {
      toast.error("Kích hoạt tài khoản thất bại");
    }
  }

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  return (
    <main>
      <section>
        <p className="text-2xl text-center font-semibold dark:text-slate-100 my-10 underline underline-offset-8">
          Xác thực tài khoản
        </p>
      </section>
      <form onSubmit={handleRegister}>
        <div className="mb-6">
          <label
            htmlFor="verifyToken"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Mã xác nhận
          </label>
          <input
            type="text"
            id="verifyToken"
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
            placeholder="Enter your verify token here"
            value={verifyToken}
            onChange={(ev) => setVerifyToken(ev.target.value)}
            required
            autoComplete="off"
          />
        </div>

        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Xác nhận
        </button>
      </form>
    </main>
  );
};

export default ActiveAccount;
