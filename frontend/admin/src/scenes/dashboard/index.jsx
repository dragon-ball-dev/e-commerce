import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import { tokens } from "../../theme";
import { mockTransactions } from "../../data/mockData";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import GeographyChart from "../../components/GeographyChart";
import BarChart from "../../components/BarChart";
import StatBox from "../../components/StatBox";
import ProgressCircle from "../../components/ProgressCircle";
import axios from "axios"; // Import axios


const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [totalRevenue, setTotalRevenue] = useState(0); // State để lưu Tổng doanh thu
  const [totalUserMonth, settotalUserMonth] = useState(0);
  const [totalUserYear, settotalUserYear] = useState(0);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Lấy token từ sessionStorage
    const token = sessionStorage.getItem("token");

    // Xác định URL của API
    const apiUrl = "http://localhost:8080/admin/total"; // Địa chỉ API của bạn

    // Thực hiện yêu cầu API GET với token
    axios
      .get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token trong header Authorization
        },
      })
      .then((response) => {
        // Xử lý dữ liệu trả về từ API và cập nhật state
        setTotalRevenue(response.data);
      })
      .catch((error) => {
        // Xử lý lỗi nếu có
        console.error("API Error:", error);
      });
  }, []);

  useEffect(() => {
    // Lấy token từ sessionStorage
    const token = sessionStorage.getItem("token");

    // Xác định URL của API
    const apiUrl = "http://localhost:8080/product"; // Địa chỉ API của bạn

    // Thực hiện yêu cầu API GET với token
    axios
      .get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token trong header Authorization
        },
      })
      .then((response) => {
        // Xử lý dữ liệu trả về từ API và cập nhật state
        setProducts(response.data);
      })
      .catch((error) => {
        // Xử lý lỗi nếu có
        console.error("API Error:", error);
      });
  }, []);
  
  useEffect(() => {
    // Lấy token từ sessionStorage
    const token = sessionStorage.getItem("token");

    // Xác định URL của API
    const apiUrl = "http://localhost:8080/admin/user-create/month"; // Địa chỉ API của bạn

    // Thực hiện yêu cầu API GET với token
    axios
      .get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token trong header Authorization
        },
      })
      .then((response) => {
        // Xử lý dữ liệu trả về từ API và cập nhật state
        settotalUserMonth(response.data);
      })
      .catch((error) => {
        // Xử lý lỗi nếu có
        console.error("API Error:", error);
      });
  }, []); 

  useEffect(() => {
    // Lấy token từ sessionStorage
    const token = sessionStorage.getItem("token");

    // Xác định URL của API
    const apiUrl = "http://localhost:8080/admin/user-create/year"; // Địa chỉ API của bạn

    // Thực hiện yêu cầu API GET với token
    axios
      .get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token trong header Authorization
        },
      })
      .then((response) => {
        // Xử lý dữ liệu trả về từ API và cập nhật state
        settotalUserYear(response.data);
      })
      .catch((error) => {
        // Xử lý lỗi nếu có
        console.error("API Error:", error);
      });
  }, []); 

  useEffect(() => {
    // Lấy token từ sessionStorage
    const token = sessionStorage.getItem("token");

    // Xác định URL của API
    const apiUrl = "http://localhost:8080/admin/near-order"; // Địa chỉ API của bạn

    // Thực hiện yêu cầu API GET với token
    axios
      .get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token trong header Authorization
        },
      })
      .then((response) => {
        // Xử lý dữ liệu trả về từ API và cập nhật state
        setOrders(response.data);
      })
      .catch((error) => {
        // Xử lý lỗi nếu có
        console.error("API Error:", error);
      });
  }, []); 

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="QUẢN LÝ CỬA HÀNG" subtitle="" />

        <Box>
          {/* <Button
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Download Reports
          </Button> */}
        </Box>
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={`${products.length} sản phẩm`}
            subtitle="Số lượng sản phẩm"
            progress="0.5"
            // increase="+14%"
            icon={
              <EmailIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={`${totalRevenue} VNĐ`}
            subtitle="Tổng doanh thu"
            progress="0.50"
            // increase="+21%"
            icon={
              <PointOfSaleIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={`${totalUserMonth} người`}
            subtitle="Người đăng ký mới trong tháng"
            progress="0.50"
            // increase="+5%"
            icon={
              <PersonAddIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={`${totalUserYear} người`}
            subtitle="Người đăng ký mới trong năm"
            progress="0.50"
            // increase="+5%"
            icon={
              <PersonAddIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

        {/* ROW 2 */}
        <Box
          gridColumn="span 12"
          gridRow="span 4"
          backgroundColor={colors.primary[400]}
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          />
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            colors={colors.grey[100]}
            p="15px"
          >
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Giao dịch gần nhất
            </Typography>
          </Box>
          {orders && orders.map((transaction, i) => (
            <Box
              key={`${transaction.txId}-${i}`}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              p="15px"
            >
              <Box>
                <Typography
                  color={colors.greenAccent[500]}
                  variant="h5"
                  fontWeight="600"
                >
                  {transaction.userEmail}
                </Typography>
                <Typography color={colors.grey[100]}>
                  {transaction.orderDate}
                </Typography>
              </Box>
              <Box color={colors.grey[100]}>{transaction.shippingMethod}</Box>
              <Box
                backgroundColor={colors.greenAccent[500]}
                p="5px 10px"
                borderRadius="4px"
              >
                ${transaction.total}
              </Box>
            </Box>
          ))}
        </Box>

        {/* ROW 3 */}
        {/* <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="30px"
        >
          <Typography variant="h5" fontWeight="600">
            Campaign
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt="25px"
          >
            <ProgressCircle size="125" />
            <Typography
              variant="h5"
              color={colors.greenAccent[500]}
              sx={{ mt: "15px" }}
            >
              $48,352 revenue generated
            </Typography>
            <Typography>Includes extra misc expenditures and costs</Typography>
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ padding: "30px 30px 0 30px" }}
          >
            Sales Quantity
          </Typography>
          <Box height="250px" mt="-20px">
            <BarChart isDashboard={true} />
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          padding="30px"
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ marginBottom: "15px" }}
          >
            Geography Based Traffic
          </Typography>
          <Box height="200px">
            <GeographyChart isDashboard={true} />
          </Box>
        </Box> */}
      </Box>
    </Box>
  );
};

export default Dashboard;
