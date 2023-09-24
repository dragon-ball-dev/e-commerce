import { Box, Button, TextField, MenuItem } from "@mui/material";
import React from "react";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import axios from "axios";

const Form = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const handleFormSubmit = async (values) => {
    try {
      console.log(values);
      const response = await axios.post("http://localhost:8080/product", values);
      console.log(response.data); // Log response data from the API (if needed)
      // Perform any other actions after successful API call
    } catch (error) {
      console.error(error);
      // Handle errors if the API call fails
    }
  };

  const [categoryOptions, setCategoryOptions] = React.useState([]);

  React.useEffect(() => {
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

  return (
    <Box m="20px">
      <Header title="CREATE PRODUCT" subtitle="Create a New Product" />

      <Formik
      onSubmit={handleFormSubmit}
      initialValues={initialValues}
      validationSchema={productSchema}
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
                select
                label="Category"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.categoryName}
                name="categoryName"
                error={!!touched.categoryName && !!errors.categoryName}
                helperText={touched.categoryName && errors.categoryName}
                sx={{ gridColumn: "span 2" }}
                SelectProps={{
                  native: true,
                }}
              >
                <option value={null}>Select a category</option>
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
            </TextField>

            <TextField
              fullWidth
              variant="filled"
              type="number"
              label="Price"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.price}
              name="price"
              error={!!touched.price && !!errors.price}
              helperText={touched.price && errors.price}
              sx={{ gridColumn: "span 2" }}
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
              type="text"
              label="Description"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.description} 
              name="description" 
              error={!!touched.description && !!errors.description} 
              helperText={touched.description && errors.description}
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              fullWidth
              variant="filled"
              type="number"
              label="Quantity Stock" 
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.quantityStock} 
              name="quantityStock" 
              error={!!touched.quantityStock && !!errors.quantityStock} 
              helperText={touched.quantityStock && errors.quantityStock} 
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              fullWidth
              variant="filled"
              type="text"
              label="Image" 
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.image} 
              name="image" 
              error={!!touched.image && !!errors.image} 
              helperText={touched.image && errors.image} 
              sx={{ gridColumn: "span 4" }}
            />
          </Box>
          <Box display="flex" justifyContent="end" mt="20px">
            <Button type="submit" color="secondary" variant="contained">
              Create New Product
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
  phoneNumber: yup // Thay đổi tên trường từ 'contact' thành 'phoneNumber'
    .string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required("required"),
  address: yup // Thay đổi tên trường từ 'address1' thành 'address'
    .string()
    .required("required"),
});

const productSchema = yup.object().shape({
  name: yup.string().required("Required"),
  description: yup.string().required("Required"),
  price: yup
    .number()
    .typeError("Price must be a number")
    .min(1,"Price must be positive")
    .max(9999999999, "Price must not exceed 10 digits")
    .required("Required"),
  quantityStock: yup
    .number()
    .typeError("Quantity Stock must be a number")
    .positive("Quantity Stock must be a positive number")
    .integer("Quantity Stock must be an integer")
    .required("Required"),
  categoryName: yup.string().nullable().required("Category is required"), // Sử dụng phương thức nullable()
});

const initialValues = {
  id: "1",
  name: "",
  description: "",
  image: "",
  categoryName: "",
  price: "",
  quantityStock: "",
  role: "",
};

export default Form;
