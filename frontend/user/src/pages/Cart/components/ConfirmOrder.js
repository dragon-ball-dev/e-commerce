import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import * as yup from "yup";






function ConfirmOrder() {
    const [productList, setProductList] = useState([]);

    const [shippingMethod, setShippingMethod] = useState("express shipping");
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [address, setAddress] = useState("");
    const [cartId, setCartId] = useState(0);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [touched, setTouched] = useState({ address: false, phoneNumber: false });
    const [errors, setErrors] = useState({ address: "", phoneNumber: "" });


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
                    toast.success("Thông tin đơn hàng đã được lưu")
                    const cart = await axios.get("http://localhost:8080/get-cart-id",
                        {
                            headers: headers,
                        }
                    );


                    setTimeout(() => {
                        window.location.replace("/payment-authorization/" + cart.data.cartId);
                    }, 4200);
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


    useEffect(() => {
        async function fetchProducts() {
            try {
                const token = JSON.parse(sessionStorage.getItem("token"));
                const response = await axios.get("http://localhost:8080/user/product", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = response.data;
                setProductList(data);
            } catch (error) {
                console.error("Failed to fetch products:", error);
            }
        }
        fetchProducts();
    }, []);

    const total = productList.reduce(
        (acc, product) => acc + product.price * product.quantityStock,
        0
    );
    return (
        <>
            <section style={{ marginLeft: "200px", marginRight: "200px", marginTop: "100px" }}>
                <TextField
                    required
                    id="outlined-required"
                    label="Mã doanh nghiệp"
                    defaultValue="09876"
                    disabled
                />
            </section>
            <section style={{ marginLeft: "200px", marginRight: "200px" }}>
                <TableContainer>
                    <Table sx={{ minWidth: 450 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Mã Sản Phẩm</TableCell>
                                <TableCell align="right">Tên Sản Phẩm</TableCell>
                                <TableCell align="right">Số lượng</TableCell>
                                <TableCell align="right">Giá&nbsp;(VNĐ)</TableCell>
                                <TableCell align="right">Thành tiền&nbsp;(VNĐ)</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {productList.map((row) => (
                                <TableRow
                                    key={row.name}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {row.id}
                                    </TableCell>
                                    <TableCell align="right">{row.name}</TableCell>
                                    <TableCell align="right">{row.quantityStock}</TableCell>
                                    <TableCell align="right">{row.price}</TableCell>
                                    <TableCell align="right">{row.quantityStock * row.price}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <div className="flex flex-col p-2 border-b dark:border-slate-700 text-lg dark:text-slate-100">
                    <p className="flex justify-between my-2">
                        <span className="font-semibold">Tổng tiền:</span>
                        <span>{total} VNĐ</span>
                    </p>
                </div>
            </section>
            <form onSubmit={handleFormSubmit}>
                <section style={{ marginLeft: "200px", marginRight: "200px" }}>
                    <TextField
                        id="standard-multiline-static"
                        label="Địa chỉ giao hàng"
                        multiline
                        rows={8}
                        onChange={(event) => setAddress(event.target.value)}
                        name="address"
                        value={address}
                        error={touched.address && !!errors.address}
                        helperText={touched.address && errors.address}
                        style={{ width: '49%' }}
                        required
                    />&nbsp;
                    <TextField
                        id="standard-multiline-static"
                        label="Số điện thoại "
                        multiline
                        rows={8}
                        onChange={(event) => {
                            const value = event.target.value.replace(/\D/g, ""); // Loại bỏ ký tự không phải số
                            setPhoneNumber(value);
                        }}
                        name="phoneNumber"
                        value={phoneNumber}
                        error={touched.phoneNumber && !!errors.phoneNumber}
                        helperText={touched.phoneNumber && errors.phoneNumber}
                        style={{ width: '49%' }}
                        required
                    />
                </section >
                <section style={{ marginLeft: "200px", marginRight: "200px" }}>
                    <div className="text-right my-5">

                        <button
                            type="submit"
                            className="bg-blue-700 text-white px-4 py-2.5 rounded-lg hover:bg-blue-900 focus-"
                        >
                            Chấp nhận thanh toán<i className="ml-2 bi bi-arrow-right"></i>
                        </button>

                    </div>
                </section>
            </form>
        </>
    );
}

export default ConfirmOrder;