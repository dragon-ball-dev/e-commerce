import { TextField } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";

function MerchantToAcquier() {
    const { id } = useParams();
    const [transactionIdCustomer, setTransactionIdCustomer] = useState('');
    const [transactionIdMerchant, setTransactionIdMerchant] = useState('');
    const [signMerchant, setSignMerchant] = useState('');
    const location = useLocation();
    const [flag, setFlag] = useState(false)
    const [sign, setSign] = useState('');
    const [data, setData] = useState('');
    const [cert, setCert] = useState('');

    useEffect(() => {
        getTrasactionacquier();
    }, [location]);

    async function getTrasactionacquier() {
        const { search } = location;
        const { sign, data, cert } = extractQueryParams(search);

        // Use the values of a and b as needed
        setSign(decodeURIComponent(sign).replace(/\s/g, '+'));
        setData(decodeURIComponent(data).replace(/\s/g, '+'));
        setCert(decodeURIComponent(cert).replace(/\s/g, '+'))
        console.log(decodeURIComponent(sign).replace(/\s/g, '+'))
        console.log(decodeURIComponent(data).replace(/\s/g, '+'))
        console.log(decodeURIComponent(cert).replace(/\s/g, '+'))
    }

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
            const acquireToMerchant = {
                signature: "KaJJv3aD9JAJcC50WzyT0nvhzvS8per2HrK7J9c1leSWBN0gEJ08sJQGHqHCPdSUNXqQMi2rdCcSKqF667p0MsA1WVVeLeaYhwFFjtLDU0YgUDjRsNNWziy1RczyeJii+6KPRYN4IAfHnfhqmhcqBxpE+IR/D/rcu8AE5TJlIzQWoNYMxLI/n5v4JcvS7fFBCSNd7neJPzQWehHqZq8eQYgKfMZelhUaE3cc28uFelRCdcjRikGZK6yl2ODiyId3WzM0YbUMPHGZKa4Bagfp3uteTijZSQqRqSV3kjRp4HAOSMhfuU/bjDm0NFD5MR7HZMHW1e2eBnnLPnemx3yZxBi9Aj9akRi5OlyWWeJYp4SQGvZYnoTIG3QU/4wNm7AQRIq6d57hkEzcxbBA/ZLdfSJiOdiixMZ42QyaG2A9Uj2N9stnTEOwcu3KioDtmepAIOUI71y/88g1LBSxKDRhLqwRLL2Ti9HkAh4FWm4xPSZD0icjPs99OjMEFfcmy67kAt6BGRRwhTWvSvsmoafd1d0BQbEWGHZWQZzYA0EsgLi2nBPFf2lrK0IpOJdTtNa1izb3OZcDpwpJi2FtXVwWiNosWv9DCVUUiYifB/aoh5aJuFv1SzA/dhXJbWwxMkDfyASQap/QqhATDQzbQOhnBCgs61Dmm7LhR9Gm1sv6NvM=",
                certM: cert,
                data: "BIHK5mbPjb9jQFw7eBDM6Fq26SzaJU7U2pKpmi0ZtTAdx2ION+vpr+9bVUqWZ+etg1coEowdYHY3Mzo/KWVw2Mr75+tyqXGnp04TNppl73ppHgb1AJ0gr1pSkTkjszgp76RRqyivRiZpvbJO+Evd+79Uz3gjbiPIY4jtlr8Vels9V9QwGkajJKuroGG1/ZQVWDa5HUDD+Hu0leDOdfFZHuueD9VttGENaLfTG6Y8IW6kqIJPxk141nShD3Nv9X+Of1qk3qenMxDTfdVLf7+nSjoJE7l9QIXtEVGGS2mzOzEDpSHVzwt5s9ZfFPNB6n21E8vupANSFT0v4OqI1O93qEMaynuvqvOWBux3v5VssKk3/WGaxSLRHN6fPEOmMYsD+GL37FJ+aMYi1Jb3CPqa7LUyf6PY0Iwq1Q6KZzDud60JjBB6ay+aV40V4EDYWvXYV5gtqo/kNMCfUOZofpSIV60OBJRiLFmQ/UVZZyn3+F7Lz4vTRfupRMWEjUHP+I/hY6l49kQPzlw/BWimV4OQWWzM06FD1KsgVP+iE+bzx+7fYNWu3mnqudWibkh+LLp5mNfP5fctJBtS4LHZRoIXS5SJxHxESbSLMa+sE+Mvq7gCFtZMRxIMBK5yjZ2oYyEGg3YmVlBDRZVhgWb5IoFM9f/9VFbjJs786ixjaxq76fw=\\\\|NTEwYTQ5ZTllOGQ5ZjMwMjczZWY4MzFlMjVkYWY3MGUwYzBiMTMwNTY3YWYwNTcxNzFhY2M2MjY5MTljZDFmMQ=="
            }
            const response = await axios.post(
                "http://localhost:8080/encrypt/sendAcqToMer",
                acquireToMerchant
            );

            console.log("AC to MER", response.data)
            if (response.data) {
                toast.success("Chữ ký Merchant và Acquier đã xác thực thành công")
                setFlag(true);
                setSignMerchant(response.data.signature)
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
                <br></br>
                <TextField
                    id="standard-multiline-static"
                    label="Chữ ký Acquier"
                    multiline
                    rows={8}
                    value={sign}
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
                        <button
                            type="submit"
                            className="bg-blue-700 text-white px-4 py-2.5 rounded-lg hover:bg-blue-900 focus-"
                        >
                            Xác thực chứ ký
                        </button>
                     &nbsp;
                    {flag === true ? <>
                        <a href={`/signature/`+id+"?sign="+signMerchant}>
                        <button
                            type="button"
                            className="bg-blue-700 text-white px-4 py-2.5 rounded-lg hover:bg-blue-900 focus-"
                        >
                            Xác thực cuối cùng →
                        </button>
                    </a> 
                    </> : <></>}
                    </form>
                </div>
            </section>
        </>
    );
}

export default MerchantToAcquier;