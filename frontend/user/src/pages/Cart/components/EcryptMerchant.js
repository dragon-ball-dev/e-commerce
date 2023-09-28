import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

function EncryptMerchant() {
    const { id } = useParams();
    const [transactionIdCustomer, setTransactionIdCustomer] = useState('');
    const [transactionIdMerchant, setTransactionIdMerchant] = useState('');
    const [order, setOrder] = useState();
    const [emOrder, setEmOrder] = useState('');
    const [eaSlip, setEaSlip] = useState('');
    const location = useLocation();

    useEffect(() => {
        const { search } = location;
        const { emorder, easlip } = extractQueryParams(search);

        // Use the values of a and b as needed
        setEmOrder(emorder);
        setEaSlip(easlip);
    }, [location]);

    const extractQueryParams = (search) => {
        const params = new URLSearchParams(search);
        const emorder = params.get('emorder');
        const easlip = params.get('easlip');
        return { emorder, easlip };
    };

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
        getTransaction();
    }, []);


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
            <section style={{ marginLeft: "200px", marginRight: "200px", marginTop: "50px" }}>
                <TextField
                    id="standard-multiline-static"
                    label="Mã hóa đơn hàng"
                    multiline
                    rows={8}
                    style={{ width: '49%' }}
                    variant="standard"
                    defaultValue={emOrder}
                    disabled
                />&nbsp;
                <TextField
                    id="standard-multiline-static"
                    label="Mã hóa Slip"
                    multiline
                    defaultValue={eaSlip}
                    rows={8}
                    style={{ width: '49%' }}
                    variant="standard"
                    disabled
                />
            </section >
            <section style={{ marginLeft: "200px", marginRight: "200px" }}>
                <div className="text-right my-5">
                    <a href={`/signature/`+id+"?emorder="+emOrder+"&easlip="+eaSlip}>
                        <button
                            type="submit"
                            className="bg-blue-700 text-white px-4 py-2.5 rounded-lg hover:bg-blue-900 focus-"
                        >
                            Xác thực thông tin<i className="ml-2 bi bi-arrow-right"></i>
                        </button>
                    </a>
                </div>
            </section>
        </>
    );

}
export default EncryptMerchant;