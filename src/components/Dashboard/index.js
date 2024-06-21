import React, { useEffect, useState } from "react";
import { Box, Button, Container, TextField } from "@mui/material";
import { Web3 } from "web3";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import CustomizedTable from "../utils/CustomizedTable";
import ABI from "../../ABIs/DataFeedDAO.json";

let data = [];
function createData(id, url) {
  return { id, url };
}

const Dashboard = () => {
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  let navigate = useNavigate();

  const goToRegister = () => {
    navigate("/register");
  };

  const init = async () => {
    const web3Instance = new Web3(window.ethereum);

    try {
      const contractABI = ABI.ABI;
      const contract = new web3Instance.eth.Contract(
        contractABI,
        "0x7bc3B77bF759aD27F6DA20b03d1160a821246C1e"
      );
      const cnt = await contract.methods.cnt().call();
      data = [];
      for (let i = 0; i < cnt; i++) {
        data.push(createData(i, await contract.methods.getUrl(i).call()));
      }
      setRows(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error signing message:", error);
    }
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <div>
      <Container
        style={{
          width: "50%",
          position: "absolute",
          top: "10vh",
          left: "25%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            maxWidth: "100%",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            alignItems: "center",
          }}
        >
          <h1 style={{ textAlign: "center" }}>Dashboard</h1>
          {isLoading ? <CircularProgress /> : <CustomizedTable rows={rows} />}
          <Button fullWidth variant="contained" onClick={goToRegister}>
            Go to Register Page
          </Button>
        </Box>
      </Container>
    </div>
  );
};

export default Dashboard;
