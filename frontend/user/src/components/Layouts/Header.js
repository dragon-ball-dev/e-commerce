import React, { useEffect, useState } from "react";
import Logo from "../../asset/logo.png";
import { Link } from "react-router-dom";
import Search from "../Section/Search";
import DropdownLoggedOut from "../Elements/DropdownLoggedOut";
import DropdownLoggedIn from "../Elements/DropdownLoggedIn";
//import axios from "axios";
const Header = () => {
  const [show, setshow] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [darkMode, setDarkMode] = useState(
    JSON.parse(localStorage.getItem("darkMode")) || false
  );
  const token = JSON.parse(sessionStorage.getItem("token"));

  //const [cardListLength, setCardListLength] = useState(0);

  // const getTokenFromSessionStorage = () => {
  //   const token = JSON.parse(sessionStorage.getItem("token"));
  //   return token;
  // };

  // useEffect(() => {
  //   const getCartSize = async () => {
  //     try {
  //       const token = getTokenFromSessionStorage();
  //       const headers = {
  //         Authorization: `Bearer ${token}`,
  //       };
  //       const response = await axios.get("http://localhost:8080/cart-size", { headers });
        
  //       if (response.status === 200) {
  //         const cartSize = response.data; // Giả sử kết quả trả về là số cart size, chẳng hạn 4
  //         setCardListLength(cartSize); // Cập nhật giá trị state cardListLength
  //       }
  //     } catch (error) {
  //       console.error("Failed to get cart size:", error);
  //     }
  //   };
  
  //   getCartSize();
  // }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);
  return (
    <>
      <nav className="bg-white border-gray-200 dark:bg-gray-800">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-4">
          <Link to="/" className="flex items-center">
            <img src={Logo} className="h-8 mr-2" alt="Frontendgyaan Logo" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              E-commerce Website
            </span>
          </Link>
          <div className="flex items-center ">
            <span
              onClick={() => setDarkMode(!darkMode)}
              className="cursor-pointer text-xl text-gray-700 dark:text-white mr-5 bi bi-gear-wide-connected"
            ></span>
            <span
              onClick={() => setshow(!show)}
              className="cursor-pointer text-xl text-gray-700 dark:text-white mr-5 bi bi-search"
            ></span>
            <Link to="/cart" className="text-gray-700 dark:text-white mr-5">
              <span className="text-2xl bi bi-cart-fill relative">
                <span className="text-white text-sm absolute -top-1 left-2.5 bg-rose-500 px-1 rounded-full">
                  
                </span>
              </span>
            </Link>
            <span
              onClick={() => setDropdown(!dropdown)}
              className="cursor-pointer text-xl text-gray-700 dark:text-white mr-5 bi bi-person-circle"
            >
              {dropdown &&
                (token ? (
                  <DropdownLoggedIn setDropdown={setDropdown} />
                ) : (
                  <DropdownLoggedOut setDropdown={setDropdown} />
                ))}
            </span>
          </div>
        </div>
      </nav>

      {show && <Search setshow={setshow} />}
    </>
  );
};

export default Header;
