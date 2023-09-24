import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import * as yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";

const CheckOut = () => {
  const [shippingMethod, setShippingMethod] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [touched, setTouched] = useState({ address: false, phoneNumber: false });
  const [errors, setErrors] = useState({ address: "", phoneNumber: "" });

  const checkoutSchema = yup.object().shape({
    shippingMethod: yup.string().required("Please select a shipping method"),
    paymentMethod: yup.string().required("Please select a payment method"),
    phoneNumber: yup
      .string()
      .test("is-numbers", "Phone number must be between 10 and 11 digits", (value) => {
        return /^[0-9]{10,11}$/.test(value);
      })
      .required("Phone number is required"),
    address: yup.string().required("Address is required"),
  });

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const isValid = await validateForm();
    if (!isValid) {
      return;
    }

    try {
      const token = JSON.parse(sessionStorage.getItem("token"));
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const cartDTO = {
        address: address,
        phonenumber: phoneNumber,
        shippingMethod: shippingMethod,
        paymentMethod: paymentMethod,
      };

      const response = await axios.post(
        "http://localhost:8080/user/check-out",
        cartDTO,
        {
          headers: headers,
        }
      );
      
      //console.log(response.data.)

      if (response.status === 200) {
        if (paymentMethod === "cash") {
          //alert("Checkout successful! Redirecting to homepage.");
          // Thực hiện chuyển hướng người dùng về trang chủ
          // (Chuyển hướng bằng cách thay đổi window.location.href)
          toast.success("Checkout thành công!!!")

          setTimeout(() => {
            window.location.replace("/");
          }, 4200);
        } else if (paymentMethod === "vnpay") {
          // Gọi tới phương thức GET localhost:8080/create-payment
          
          const createPaymentResponse = await axios.get(
            "http://localhost:8080/create_payment",
            {
              headers: headers,
            }
          );
          toast.success("Checkout thành công!!!")
          // Lấy đường link từ trường URL của kết quả trả về
          //console.log(createPaymentResponse.data)
          const paymentUrl = createPaymentResponse.data.url;
          //console.log(paymentUrl)
          // Thực hiện chuyển hướng người dùng đến đường link thanh toán
          window.location.href = paymentUrl;
        }
      } else if (response.status === 400) {
          toast.error("Checkout thất bại. Vui lòng thử lại!!!");
      }

      // Thực hiện các hành động khác sau khi submit thành công
    } catch (error) {
      console.error(error);
      // Xử lý lỗi nếu gặp vấn đề khi gửi yêu cầu
    }
  };

  const validateForm = async () => {
    const validationSchema = yup.object().shape({
      address: yup.string().required("Address is required"),
      phoneNumber: yup
        .string()
        .test("is-numbers", "Phone number must be between 10 and 11 digits", (value) => {
          return /^[0-9]{10,11}$/.test(value);
        })
        .required("Phone number is required"),
    });

    try {
      await validationSchema.validate({ address, phoneNumber }, { abortEarly: false });
      setErrors({ address: "", phoneNumber: "" });
      return true;
    } catch (error) {
      const newErrors = {};
      error.inner.forEach((e) => {
        newErrors[e.path] = e.message;
      });
      setErrors(newErrors);
      return false;
    }
  };

  return (
    <Box m="20px">
      <form onSubmit={handleFormSubmit}>
            <Box mt={2} mb={2}>
              <Typography variant="h6" sx={{ gridColumn: "span 4" }}>
                Địa chỉ
              </Typography>
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label=""
                onChange={(event) => setAddress(event.target.value)}
                name="address"
                value={address}
                error={touched.address && !!errors.address}
                helperText={touched.address && errors.address}
                sx={{ gridColumn: "span 2" }}
              />
            </Box>

            <Box mt={2} mb={2}>
              <Typography variant="h6" sx={{ gridColumn: "span 4" }}>
                Số điện thoại
              </Typography>
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label=""
                onChange={(event) => {
                  const value = event.target.value.replace(/\D/g, ""); // Loại bỏ ký tự không phải số
                  setPhoneNumber(value);
                }}
                name="phoneNumber"
                value={phoneNumber}
                error={touched.phoneNumber && !!errors.phoneNumber}
                helperText={touched.phoneNumber && errors.phoneNumber}
                sx={{ gridColumn: "span 2" }}
              />
            </Box>

            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: "span 4" },
              }}
            >
              <Typography variant="h6" sx={{ gridColumn: "span 4" }}>
                Phương thức vận chuyển
              </Typography>
              <Box display="flex" sx={{ gridColumn: "span 4" }}>
                <Button
                  variant={shippingMethod === "express shipping" ? "contained" : "outlined"}
                  onClick={() => setShippingMethod("express shipping")}
                >
                  Express Shipping
                </Button>
                <Button
                  variant={shippingMethod === "standard shipping" ? "contained" : "outlined"}
                  onClick={() => setShippingMethod("standard shipping")}
                >
                  Standard Shipping
                </Button>
              </Box>
              <Typography variant="h6" sx={{ gridColumn: "span 4" }}>
                Phương thức thanh toán
              </Typography>
              <Box display="flex" sx={{ gridColumn: "span 4" }}>
                <Button
                  variant={paymentMethod === "cash" ? "contained" : "outlined"}
                  onClick={() => setPaymentMethod("cash")}
                >
                  Cash on Delivery
                </Button>
                <Button
                  variant={paymentMethod === "vnpay" ? "contained" : "outlined"}
                  onClick={() => setPaymentMethod("vnpay")}
                >
                  VNPAY
                </Button>
              </Box>
            </Box>
            <Box display="flex" justifyContent="end" mt={4}>
              <Button type="submit" color="secondary" variant="contained">
                Xác nhận đặt hàng
              </Button>
            </Box>
          </form>
    </Box>
  );
};

export default CheckOut;
