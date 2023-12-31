import { TextField } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";

function Signature() {
    const { id } = useParams();
    const [transactionIdCustomer, setTransactionIdCustomer] = useState('');
    const [transactionIdMerchant, setTransactionIdMerchant] = useState('');
    const [signatureDigital, setSignatureDigital] = useState('');
    const [signMerchant, setSignMerchant] = useState('');
    const [cert, setCert] = useState('');
    const [dataToVerify, setDataToVerify] = useState('');
    const location = useLocation();
    const [flag, setFlag] = useState(false)
    const [signature, setSignature] = useState('');

    useEffect(() => {
        getTrasactionacquier();
    }, [location]);

    async function getTrasactionacquier() {
        const { search } = location;
        const { signature } = extractQueryParams(search);


        setSignature(signature);

        const merchantToCustomer = {
            signature: signature ,
        };

        const response = await axios.post(
            "http://localhost:8080/encrypt/sendMerToCus", merchantToCustomer
        );

        console.log("Acquier", response.data);
        setSignatureDigital(response.data.signature)
        setDataToVerify(response.data.dataVerify)
    }

    const extractQueryParams = (search) => {
        const params = new URLSearchParams(search);
        const signature = decodeURIComponent(params.get('sign').replace(/\s/g, '+'));
        console.log(decodeURIComponent(signature).replace(/\s/g, '+'))
        return { signature };
    };


    async function getTransaction() {
        try {
            const response = await axios.get("http://localhost:8080/encrypt/new-transaction?id=" + id);
            console.log("Transaction", response)
            const data = response.data;
            console.log("Transaction", data)
            setTransactionIdCustomer(data.transactionIdCustomer);
            setTransactionIdMerchant(data.transactionIdMerchant);
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
            const customer = {
                signature: signatureDigital,
                dataVerify: dataToVerify
            }
            const response = await axios.post(
                "http://localhost:8080/encrypt/customer-notify",
                customer
            );

            console.log("AC to MER", response.data)
            if (response.data.notify) {
                toast.success("Chữ ký đã được xác thực")
                setFlag(true);
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
                <span><h1>Kết quả xác thực tài khoản khách hàng: {flag && flag === true ? <span style={{ color: "green" }}>Tài khoản chính xác</span> : <span style={{ color: "red" }}>Tài khoản chưa xác thực</span>}</h1></span>
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
            <section style={{ marginLeft: "200px", marginRight: "200px", marginTop: "50px" }}>
                <span><h1>Kết quả xác thực bằng chứ ký: {flag && flag === true ? <span style={{ color: "green" }}>Chữ ký AC vs MER chính xác</span> : <span style={{ color: "red" }}>Chưa xác thực chữ ký</span>} </h1></span>
                <br></br>
                <TextField
                    id="standard-multiline-static"
                    label="Chữ ký Acquier"
                    multiline
                    rows={8}
                    value={signatureDigital}
                    style={{ width: '49%' }}

                />&nbsp;
                <TextField
                    id="standard-multiline-static"
                    label="Dữ liệu khách hàng"
                    multiline
                    rows={8}
                    value={dataToVerify}
                    style={{ width: '49%' }}


                />
            </section >
            <section style={{ marginLeft: "200px", marginRight: "200px" }}>
                <div className="text-right my-5">

                    <form onSubmit={handleFormSubmit}>
                    <a href="/">
                        <button
                            type="button"
                            className="bg-blue-700 text-white px-4 py-2.5 rounded-lg hover:bg-blue-900 focus-"
                        >
                            Quay lại trang chủ
                        </button>
                    </a>
                     &nbsp;
                        <button
                            type="submit"
                            className="bg-blue-700 text-white px-4 py-2.5 rounded-lg hover:bg-blue-900 focus-"
                        >
                            Xác thực chứ ký
                        </button>
                    </form>
                </div>
            </section>
        </>
    );
}

export default Signature;