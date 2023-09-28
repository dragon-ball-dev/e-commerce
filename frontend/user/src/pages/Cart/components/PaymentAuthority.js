import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import axios from "axios";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";


function PaymentAuthority() {
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCVV] = useState('');
    const [order, setOrder] = useState();
    const [transactionIdCustomer, setTransactionIdCustomer] = useState('');
    const [transactionIdMerchant, setTransactionIdMerchant] = useState('');
    const { id } = useParams();


    async function getTransaction() {
        try {
            const response = await axios.get("http://localhost:8080/encrypt/get-transaction?shoppingCartId=" + id);
            console.log("Transaction", response)
            const data = response.data;
            console.log("Transaction", data)
            setTransactionIdCustomer(data.transactionIdCustomer);
            setTransactionIdMerchant(data.transactionIdMerchant);
            if (data.orderId) {
                const order = await axios.get("http://localhost:8080/order/getOrder?id=" + (id - 1));
                console.log("Order", order)
                setOrder(order.data);
            }
        } catch (error) {
            console.error("Failed to fetch products:", error);
        }
    }



    useEffect(() => {
        async function fetchProducts() {
            try {
                await axios.post("http://localhost:8080/encrypt/addnew-transaction?shoppingCartId=" + id);
            } catch (error) {
                console.error("Failed to fetch products:", error);
            }
        }
        fetchProducts();
        setTimeout(() => {
            getTransaction();
        }, 2000);
    }, []);





    const handleExpiryChange = (event) => {
        const inputValue = event.target.value;

        // Parse the input value as a date
        const date = new Date(inputValue);

        // Check if the parsed date is valid
        if (!isNaN(date.getTime())) {
            // Format the date as "MM/yyyy"
            const formattedDate = format(date, 'MM/yyyy');
            setExpiry(formattedDate);
        } else {
            // If the input value is invalid, set it as is
            setExpiry(inputValue);
        }
    };

    const handleCVVChange = (event) => {
        setCVV(event.target.value);
    };


    const handleCardNumberChange = (event) => {
        let inputValue = event.target.value;

        // Remove all non-digit characters from the input value
        inputValue = inputValue.replace(/\D/g, '');

        // Format the card number by inserting spaces every 4 digits
        inputValue = inputValue.replace(/(\d{4})(?=\d)/g, '$1 ');

        // Set the maximum limit of 16 digits
        const maxLength = 19;
        if (inputValue.length > maxLength) {
            inputValue = inputValue.slice(0, maxLength);
        }

        setCardNumber(inputValue);
    };


    const handleFormSubmit = async (event) => {
        event.preventDefault();

        try {
            const token = JSON.parse(sessionStorage.getItem("token"));
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const paymentRequest = {
                shoppingCartId: id,
                creditCardNumber: cardNumber,
                pinCode: cvv,
                expirationCard: "2023-09-09"
            };

            const response = await axios.post(
                "http://localhost:8080/encrypt/encryptCusToMer",
                paymentRequest,
                {
                    headers: headers,
                }
            );

            console.log(response.data)
            if(response.data) {
                toast.success("Thông tin đơn hàng đã được lưu")
                setTimeout(() => {
                    window.location.replace("/ecrypt-merchant/"+ id +"?emorder="+response.data.emorder+"&easlip="+response.data.easlip);
                }, 4200);
            }


            // Thực hiện các hành động khác sau khi submit thành công
        } catch (error) {
            console.error(error);
            // Xử lý lỗi nếu gặp vấn đề khi gửi yêu cầu
        }
    };



    return (
        <>

            <section style={{ marginLeft: "200px", marginRight: "200px", marginTop: "100px" }}>
                <h1>Thông tin đơn hàng</h1>
                <br></br>
                <TextField
                    required
                    id="outlined-required"
                    label="Mã doanh nghiệp"
                    defaultValue="09876"
                    style={{ width: '50%', marginBottom: "30px" }}
                    disabled
                />
                <br></br>
                <TextField
                    required
                    id="outlined-required"
                    label="Mã giao dịch của Khách hàng"
                    value={transactionIdCustomer}
                    style={{ width: '50%', marginBottom: "30px" }}
                    disabled
                />
                <br></br>
                <TextField
                    required
                    id="outlined-required"
                    label="Mã giao dịch của Doanh nghiệp"
                    value={transactionIdMerchant}
                    style={{ width: '50%', marginBottom: "30px" }}
                    disabled
                />
            </section>
            <section style={{ marginLeft: "200px", marginRight: "200px" }}>
                <TableContainer>
                    <Table sx={{ minWidth: 450 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Mô Tả Đơn Hàng</TableCell>
                                <TableCell align="right">Tổng Tiền</TableCell>
                                <TableCell align="right">ĐV Tiền</TableCell>
                                <TableCell align="right">Ngày GD</TableCell>
                                <TableCell align="right">ĐC giao hàng</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableCell component="th" scope="row">
                                Mã HĐ cần được bảo mật
                            </TableCell>
                            <TableCell align="right">{order?.orderTotal}</TableCell>
                            <TableCell align="right">VNĐ</TableCell>
                            <TableCell align="right">{order?.orderDate}</TableCell>
                            <TableCell align="right">{order?.address}</TableCell>
                        </TableBody>
                    </Table>
                </TableContainer>
            </section>
            <form onSubmit={handleFormSubmit}>
                <section style={{ marginLeft: "200px", marginRight: "200px", marginTop: "100px" }}>
                    <h1>Thông tin tài khoản</h1>
                    <br></br>
                    <TextField
                        required
                        id="cardNumber"
                        label="Số Thẻ"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        style={{ paddingRight: '10px' }}
                    />
                    <TextField
                        required
                        id="expiry"
                        label="Ngày hết hạn"
                        value={expiry}
                        onChange={handleExpiryChange}
                        style={{ paddingRight: '10px' }}
                    />
                    <TextField
                        required
                        id="cvv"
                        label="CVV"
                        value={cvv}
                        onChange={handleCVVChange}
                    />
                </section>
                <section style={{ marginLeft: "200px", marginRight: "200px" }}>
                    <div className="text-right my-5">

                        <button
                            type="submit"
                            className="bg-blue-700 text-white px-4 py-2.5 rounded-lg hover:bg-blue-900 focus-"
                        >
                            Mã hóa và gửi lại Merchant<i className="ml-2 bi bi-arrow-right"></i>
                        </button>

                    </div>
                </section>
            </form>
        </>
    );
}

export default PaymentAuthority;