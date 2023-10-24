import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";

function EncryptMerchant() {
    const { id } = useParams();
    const [transactionIdCustomer, setTransactionIdCustomer] = useState('');
    const [transactionIdMerchant, setTransactionIdMerchant] = useState('');
    const [order, setOrder] = useState();
    const [sign, setSign] = useState('');
    const [data, setData] = useState('');
    const [cert, setCert] = useState('');
    const [flag, setFlag] = useState(false);
    const location = useLocation();
    const [signMerchant, setSignMerchant] = useState('');
    const [dataM,setDataM] = useState('');
    const [certM,setCertM] = useState('');

    useEffect(() => {
        const { search } = location;
        const { sign, data, cert } = extractQueryParams(search);

        // Use the values of a and b as needed
        setSign(decodeURIComponent(sign));
        setData(decodeURIComponent(data));
        setCert(decodeURIComponent(cert))
    }, [location]);

    const extractQueryParams = (search) => {
        const params = new URLSearchParams(search);
        const sign = params.get('sign');
        const data = params.get('data');
        const cert = params.get('cert');

        return { sign, data, cert };
    };

    async function getTransaction() {
        try {
            const response = await axios.get("http://localhost:8080/encrypt/new-transaction?id=" + id);
            console.log("Transaction", response)
            const data = response.data;
            console.log("Transaction", data)
            setTransactionIdCustomer(data.transactionIdCustomer);
            setTransactionIdMerchant(data.transactionIdMerchant);
            if (data) {
                const order = await axios.get("http://localhost:8080/order/" + (id - 1));
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


    const handleFormSubmit = async (event) => {
        event.preventDefault();

        try {
            const token = JSON.parse(sessionStorage.getItem("token"));
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            const merchantToAcquired = {
                cert: cert,
                signature: sign,
                data: data
            }
            const response = await axios.post(
                "http://localhost:8080/encrypt/sendMerToAcq",
                merchantToAcquired
            );

            console.log("AC to MER", response.data)
            if (response.data) {
                toast.success("Chữ ký đã xác thực thanh công")
                setFlag(true);
                setSignMerchant(response.data.signature)
                setDataM(response.data.dataToVerify)
                setCertM(response.data.certM)
                console.log(response.data.signature)
                console.log(response.data.dataToVerify)
                console.log(response.data.certM)
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
            <section style={{ marginLeft: "200px", marginRight: "200px", marginTop: "50px" }}>
                <TextField
                    id="standard-multiline-static"
                    label="Chữ ký Khách hàng"
                    multiline
                    rows={8}
                    style={{ width: '49%' }}
                    variant="standard"
                    defaultValue={sign}
                    disabled
                />&nbsp;
                <TextField
                    id="standard-multiline-static"
                    label="Chữ ký Merchant"
                    multiline
                    rows={8}
                    value={signMerchant}
                    style={{ width: '49%' }}
                    variant="standard"
                    disabled
                />
            </section >
            <form onSubmit={handleFormSubmit}>
                <section style={{ marginLeft: "200px", marginRight: "200px" }}>
                    <div className="text-right my-5">

                        <button
                            type="submit"
                            className="bg-blue-700 text-white px-4 py-2.5 rounded-lg hover:bg-blue-900 focus-"
                        >
                            Xác thực chữ ký
                        </button> &nbsp;
                        {flag === true ? <>
                            <a href={`/merchant-to-acquier/`+id+`?data=`+dataM+`&sign=`+signMerchant+`&cert=`+certM}>
                                <button
                                    type="button"
                                    className="bg-blue-700 text-white px-4 py-2.5 rounded-lg hover:bg-blue-900 focus-"
                                >
                                    Tiếp tục xác thực<i className="ml-2 bi bi-arrow-right"></i>
                                </button>
                            </a>
                        </> : <></>}
                    </div>
                </section>
            </form>
        </>
    );

}
export default EncryptMerchant;