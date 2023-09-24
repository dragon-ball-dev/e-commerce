import React, { useState, useEffect } from "react";
import CartList from "./components/CartList";
import CartEmpty from "./components/CartEmpty";
import CartCard from "./components/CartCard";
import axios from "axios"; // Import axios library for making API requests

const CartPage = () => {
  // State to store the cartListLength
  const [cardListLength, setCardListLength] = useState(0);

  const getTokenFromSessionStorage = () => {
    const token = JSON.parse(sessionStorage.getItem("token"));
    return token;
  };

  useEffect(() => {
    const getCartSize = async () => {
      try {
        const token = getTokenFromSessionStorage();
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        const response = await axios.get("http://localhost:8080/cart-size", { headers });
        
        if (response.status === 200) {
          const cartSize = response.data; // Giả sử kết quả trả về là số cart size, chẳng hạn 4
          setCardListLength(cartSize); // Cập nhật giá trị state cardListLength
        }
      } catch (error) {
        console.error("Failed to get cart size:", error);
      }
    };
  
    getCartSize();
  }, []);

  return <main>{cardListLength ? <CartList /> : <CartEmpty />}</main>;
};

export default CartPage;
