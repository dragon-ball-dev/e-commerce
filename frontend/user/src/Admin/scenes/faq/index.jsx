import { useState, useEffect } from "react";
import { Box, Button, TextField, MenuItem } from "@mui/material"; // Import components from @mui/material
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import axios from "axios";
import DatePicker from "react-datepicker"; 
import "react-datepicker/dist/react-datepicker.css";

const Form = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [categoryOptions, setCategoryOptions] = useState([]);

  useEffect(() => {
    fetchCategoryData();
  }, []);

  const fetchCategoryData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/category");
      setCategoryOptions(response.data);
    } catch (error) {
      console.error("Error fetching category data:", error);
    }
  };

  const handleFormSubmit = async (values) => {
    try {
      console.log(values);
      const response = await axios.post("http://localhost:8080/user", values);
      console.log(response.data); // Log response data from the API (if needed)
      // Perform any other actions after successful API call
    } catch (error) {
      console.error(error);
      // Handle errors if the API call fails
    }
  };

  return (
    <Box m="20px">
      <Header title="CREATE PROMOTION" subtitle="Create a New Promotion" />

      <Formik
        onSubmit={handleFormSubmit}
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
                type="number"
                label="Discount"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.discount}
                name="discount"
                error={!!touched.discount && !!errors.discount}
                helperText={touched.discount && errors.discount}
                sx={{ gridColumn: "span 4" }}
              />

              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.name}
                name="name"
                error={!!touched.name && !!errors.name}
                helperText={touched.name && errors.name}
                sx={{ gridColumn: "span 4" }}
              />

              <TextField
                fullWidth
                variant="filled"
                select
                label="Category Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.categoryName}
                name="categoryName"
                error={!!touched.categoryName && !!errors.categoryName}
                helperText={touched.categoryName && errors.categoryName}
                sx={{ gridColumn: "span 4" }}
              >
                {categoryOptions.map((category) => (
                  <MenuItem key={category.id} value={category.name}>
                    {category.name}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create New User
              </Button>
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
  phoneNumber: yup
    .string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required("required"),
  address: yup.string().required("required"),
});

const initialValues = {
  id: "1",
  name: "",
  description: "",
  categoryName: "",
  discount: "",
  startDate: null,
  endDate: null,
};

export default Form;
