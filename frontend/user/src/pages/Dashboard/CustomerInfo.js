import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Button, TextField} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Link } from "react-router-dom";

const CustomerInfo = () => {
  const [customerInfo, setCustomerInfo] = useState(null);

  const token = JSON.parse(sessionStorage.getItem("token"));
  const decodedToken = token ? JSON.parse(atob(token.split(".")[1])) : null;
  const email = decodedToken ? decodedToken.sub : null;

  useEffect(() => {
    fetchCustomerInfo();
  }, []);

  const fetchCustomerInfo = async () => {
    try {
      if (email) {
        const token = JSON.parse(sessionStorage.getItem("token"));
        const headers = {
          Authorization: `Bearer ${token}`, // Thêm token vào header
        };
        const response = await axios.get(`http://localhost:8080/user/${email}`, {
          headers: headers,
        });
        console.log(response.data);
        setCustomerInfo(response.data);
      }
    } catch (error) {
      console.error("Error fetching customer info:", error);
    }
  };

  const isNonMobile = useMediaQuery("(min-width:600px)");

  

  const handleCreateUserClick = () => {
    
  };

  // Hàm xử lý khi nhấn nút "Create New User" để chuyển trạng thái các trường sang chỉnh sửa


  return (
    <Box m="20px">
      <Formik
        onSubmit={handleCreateUserClick}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="First Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={customerInfo?.firstName}
                name="firstName"
                error={!!touched.firstName && !!errors.firstName}
                helperText={touched.firstName && errors.firstName}
                disabled
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Last Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={customerInfo?.lastName}
                name="lastName"
                error={!!touched.lastName && !!errors.lastName}
                helperText={touched.lastName && errors.lastName}
                disabled
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={customerInfo?.email}
                name="email"
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                disabled
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Contact Number"
                onBlur={handleBlur}
                onChange={handleChange}
                value={customerInfo?.phoneNumber}
                name="phoneNumber" 
                error={!!touched.phoneNumber && !!errors.phoneNumber} 
                helperText={touched.phoneNumber && errors.phoneNumber}
                disabled 
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Password" 
                onBlur={handleBlur}
                onChange={handleChange}
                value={customerInfo?.password} 
                name="password" 
                error={!!touched.password && !!errors.password} 
                helperText={touched.password && errors.password}
                disabled 
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Address" 
                onBlur={handleBlur}
                onChange={handleChange}
                value={customerInfo?.address}
                name="address" 
                error={!!touched.address && !!errors.address} 
                helperText={touched.address && errors.address}
                disabled
                sx={{ gridColumn: "span 4" }}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
            <Link to="/update-info-user">
              <Button type="submit" color="secondary" variant="contained">
                Cập nhật thông tin
              </Button>
            </Link>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const phoneRegExp =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const checkoutSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  phoneNumber: yup // Thay đổi tên trường từ 'contact' thành 'phoneNumber'
    .string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required("required"),
  address: yup // Thay đổi tên trường từ 'address1' thành 'address'
    .string()
    .required("required"),
});
const initialValues = {
  id: "1",
  email: "",
  phoneNumber: "",
  address: "",
  firstName: "",
  lastName: "",
  password: "",
  role: "",
};

export default CustomerInfo;