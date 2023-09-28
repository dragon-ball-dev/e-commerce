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
    const [emOrder, setEmOrder] = useState('');
    const [eaSlip, setEaSlip] = useState('');

    useEffect(() => {
        getTrasactionacquier();
    }, [location]);

    async function getTrasactionacquier() {
        const { search } = location;
        const { emorder, easlip } = extractQueryParams(search);

        console.log("EM, EA", emorder, easlip);
        setEmOrder(emorder);
        setEaSlip(easlip);

        const request = {
            orderStr: "nX7jmQM++VMwktQjizsqBdzIgqziTaDmp2WAYBm5PI968aR7E6Pknv0Y+2S4hUczKseDQI/ilF8tOF+ATajsHPm3VhIm7GWuw1RTwxiGcOKLV97jVZkH+UzKQ9K/CrH9a0chHcxoBDIiurMRSm987KtNBJKA5bCnU7fXRIzoZjJSqDnuxsAhpA2BBGQmrrUWBgs/65ui5ttyJI/dENSD62rfLjFgJwfg/DoNL7lTr0XUO0dpASbzjqWMjp0TQv2AlRC6JQUBuOdMSP16z2eiee6qRo5swp/4+8yxecuOkfi4j5QhspVooepamgwd0DbtNf3wi4yYHzZwnIOmMAN2jSSVFYt86bjzz95dQd9X+1um9CmzyahoGSQKCSs7FFz6a9WTA1coH+tH04gsgV65R2Km2A9/x1/b3J9oRRL6gR3RH1sYrbIlFpW7e127TamDumnaUwDz5lumfwLMNDBGKNgYVe/bGwMDzq6J2NRCkgDepYwD/hX2ajITueGjFp/gG+WRveYXn4rmw5U9ELQrklN8LWlnnbNgiR4dw2GH0bmDgpDc/F76h+a3e1o+uwEm0nac6z9yGUiZ+N9TitR2WVYGELBixYX7YrfKtsH4NHEKB1l8PPYBd6/S607neHv3IPDgYw7L2AHpgsPUV+klz7EaoZkTTlIQq7pWcXl3QqU=",
            slipStr: "fkopV9VkeeMmb6k92G4gLxkI29HtLtprxwmovWleK+j3HSdvhCxblwyG5K1ykdtXYcWFRh1n3bkXV3aS2GPqGkh+ZDY2fdzH3gX/FvKufsuDv5iWwx+7VB3W3X1qYYJ+kTbdeK6F7Ig3diOg6scnKfw8l/51op0gGvZBrSmtBCzqVZtGI1bKBTe/fZLFf0VtQNxHWoSZuSBre/ntO2TdiTz9EvPas04PxsLIQiiz81i7+5ZtHNB/kVSGcnRUYr9rb+7f7fTBVrslGjBlfLCdwgghD8/s5iplea1gG2BA0Hh1VWCJF3prOWy6mvzPnmZDZf00pgsNycpdINOvvVVwDCTMmybKz36NF8Ax2JAVFngfJP94ZiZGMtvW39v4VQO90ALgWHWIELKGv102f0a5l3ke1sA/sDMiCi5RcdKQfpK04KUpE+ULlSomM2hNMxgE2xfjrIFkXAf/nyDAg3BKMq7pp5yKNecqimCkfMy2ngpNAi76kjPemR34TIwH5yJ+2ReNioWNq+Cs0swtfEz2ydKasEuCCwiIpGY6UYkzHBcNm95oPoJFhnSJZy61+gkLr9Vgv0GWKLEA25so/Y/XkuwVLEJRUGo68b1rnuRZYnG4u7FGkbrAgrHKrqycJ/YlYXYZyhmKfL4ij1oOHJ9ys8XyG0+qHmInnPRFRzJy7lY="
        };

        const response = await axios.post(
            "http://localhost:8080/encrypt/decrypt", request
        );

        console.log("Acquier", response.data);
        setSignatureDigital(response.data.signatureDigital)
        setCert(response.data.certM)
        setDataToVerify(response.data.dataToVerify)
    }

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
            const toMer = {
                cert: cert,
                signatureDigital: signatureDigital,
                dataToVerify: dataToVerify
            }
            const response = await axios.post(
                "http://localhost:8080/encrypt/ac-to-mer",
                toMer
            );

            console.log("AC to MER", response.data)
            if (response.data.auth === "Agree transaction") {
                toast.success("Chữ ký đã được xác thực")
                setFlag(true);
                setSignMerchant(response.data.signatureDigital)
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
                    label="Chữ ký Merchant"
                    multiline
                    rows={8}
                    value={signMerchant}
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
                    </a> &nbsp;
                    <a href={`/signature/`+id+"?emorder="+emOrder+"&easlip="+eaSlip}>
                        <button
                            type="button"
                            className="bg-blue-700 text-white px-4 py-2.5 rounded-lg hover:bg-blue-900 focus-"
                        >
                            Xem lại quá trình
                        </button>
                    </a> &nbsp;
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