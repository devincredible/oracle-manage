import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Web3 } from "web3";
import DetailedDialog from "./DetailedDialog";
import ABI from "../../ABIs/DataFeedDAO.json";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const CustomizedTable = (props) => {
  const [apiData, setApiData] = useState([]);
  const [dialogOpened, setDialogOpened] = useState(false);
  const rows = props.rows;

  const rowClicked = async (row) => {
    const web3Instance = new Web3(window.ethereum);

    try {
      const contractABI = ABI.ABI;
      const contract = new web3Instance.eth.Contract(
        contractABI,
        "0x7bc3B77bF759aD27F6DA20b03d1160a821246C1e"
      );
      const data = await contract.methods.getApiData(row.url).call();
      setApiData(data);
    } catch (error) {
      console.error("Error signing message:", error);
    }
    setDialogOpened(true);
  };

  return (
    <TableContainer component={Paper}>
      <DetailedDialog
        dialogOpened={dialogOpened}
        setDialogOpened={setDialogOpened}
        apiData={apiData}
      />
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="center">ID</StyledTableCell>
            <StyledTableCell align="center">URL</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <StyledTableRow
              key={row.id}
              onClick={() => rowClicked(row)}
              style={{ cursor: "pointer" }}
            >
              <StyledTableCell align="center">{row.id}</StyledTableCell>
              <StyledTableCell align="center">{row.url}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CustomizedTable;
