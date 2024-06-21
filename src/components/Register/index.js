import React, { useState, useEffect } from "react";
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Container,
  TextField,
} from "@mui/material";
import SyntaxHighlighter from "react-syntax-highlighter";
import { solarizedlight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Web3 } from "web3";
import { useNavigate } from "react-router-dom";
import ABI from "../../ABIs/DataFeedDAO.json";

const Register = () => {
  const [url, setUrl] = useState("");
  const [gap, setGap] = useState("");
  const [reward, setReward] = useState("");
  const [fee, setFee] = useState("");
  const [FRESH_SEC_DELTA, setFRESH_SEC_DELTA] = useState("");
  const [open, setOpen] = useState(false);
  const [codeString, setCodeString] = useState("");

  const init = () => {
    const file = "/DataFeedDAO.sol";
    fetch(file)
      .then((response) => response.text()) // Convert the response to text
      .then((text) => {
        setCodeString(text);
      }) // Log the file content
      .catch((error) => console.error("Error:", error));
  };

  useEffect(() => {
    init();
  }, []);

  let navigate = useNavigate();

  const goToDashboard = () => {
    navigate("/");
  };

  const handleGap = (event) => {
    const inputValue = event.target.value;
    if (/^\d*$/.test(inputValue)) {
      // Regular expression to match only digits
      setGap(inputValue);
    }
  };

  const handleReward = (event) => {
    const inputValue = event.target.value;
    if (/^\d*$/.test(inputValue)) {
      // Regular expression to match only digits
      setReward(inputValue);
    }
  };

  const handleFee = (event) => {
    const inputValue = event.target.value;
    if (/^\d*$/.test(inputValue)) {
      // Regular expression to match only digits
      setFee(inputValue);
    }
  };

  const handleFRESH_SEC_DELTA = (event) => {
    const inputValue = event.target.value;
    if (/^\d*$/.test(inputValue)) {
      // Regular expression to match only digits
      setFRESH_SEC_DELTA(inputValue);
    }
  };

  const registerApi = async () => {
    console.log("Clicked!");
    const web3Instance = new Web3(window.ethereum);

    try {
      const contractABI = ABI.ABI;
      const contract = new web3Instance.eth.Contract(
        contractABI,
        "0x7bc3B77bF759aD27F6DA20b03d1160a821246C1e"
      );
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const params = [
        url,
        parseInt(gap, 10),
        parseInt(reward, 10),
        parseInt(fee, 10),
        parseInt(FRESH_SEC_DELTA, 10),
      ];
      console.log(params);

      const res = await contract.methods["registerAPI"](...params).send({
        from: accounts[0],
      });
      console.log(res);
    } catch (error) {
      setOpen(true);
      setTimeout(() => setOpen(false), 2000);
      console.error("Error signing message:", error);
    }
  };

  return (
    <div>
      {open ? (
        <Alert severity="warning" onClose={() => setOpen(false)}>
          <AlertTitle>Warning</AlertTitle>
          Error occured while registering!
        </Alert>
      ) : null}
      <Container
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Container
          style={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SyntaxHighlighter
            language="javascript"
            showLineNumbers={true}
            customStyle={{ height: "600px" }}
            // style={{ ...solarizedlight, innerHeight: 100 }}
            lineProps={{
              style: {
                wordBreak: "break-all",
                whiteSpace: "pre-wrap",
              },
            }}
          >
            {codeString}
          </SyntaxHighlighter>
        </Container>
        <Container
          style={{
            width: "50%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              width: 600,
              maxWidth: "100%",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            <h1 style={{ textAlign: "center" }}>Register new API</h1>
            <TextField
              fullWidth
              label="URL"
              id="url"
              value={url}
              variant="standard"
              onChange={(event) => {
                setUrl(event.target.value);
              }}
            />
            <TextField
              fullWidth
              label="Gap (Required time space between updates, in seconds.)"
              id="gap"
              value={gap}
              variant="standard"
              onChange={handleGap}
            />
            <TextField
              fullWidth
              label="Reward (Reward for data submission, in GWEI.)"
              id="reward"
              value={reward}
              variant="standard"
              onChange={handleReward}
            />
            <TextField
              fullWidth
              label="Fee (Required fee for fetching data, in GWEI.)"
              id="fee"
              value={fee}
              variant="standard"
              onChange={handleFee}
            />
            <TextField
              fullWidth
              label="FRESH_SEC_DELTA (Maximum time for guaranteeing data's freshness, in seconds.)"
              id="FRESH_SEC_DELTA"
              value={FRESH_SEC_DELTA}
              variant="standard"
              onChange={handleFRESH_SEC_DELTA}
            />
            <Button fullWidth variant="contained" onClick={registerApi}>
              Register
            </Button>
            <Button fullWidth variant="contained" onClick={goToDashboard}>
              Go to Dashboard Page
            </Button>
          </Box>
        </Container>
      </Container>
    </div>
  );
};

export default Register;
