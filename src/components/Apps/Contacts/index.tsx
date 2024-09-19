"use client";

import React from "react";
import {
  Card,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TablePagination,
  TableRow,
  Paper,
  IconButton,
  Button,
  TableHead,
  FormControl,
  InputLabel,
  MenuItem,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import styles from "@/components/Apps/Contacts/Contact.module.css";
import { useState, useEffect } from "react";

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number
  ) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleBackButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page + 1);
  };

  return (
    <Box
      sx={{
        flexShrink: 0,
        display: "flex",
        gap: "10px",
        padding: "0 20px",
      }}
    >
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
        sx={{
          borderRadius: "4px",
          padding: "6px",
        }}
        className="border"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>

      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
        sx={{
          borderRadius: "4px",
          padding: "6px",
        }}
        className="border"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
    </Box>
  );
}

interface Contact {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
}
const Contacts: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [select, setSelect] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [expandedRowIndex, setExpandedRowIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/contact/get-all-mail`
        );
        const result = await response.json();
        if (result && Array.isArray(result.data)) {
          setContacts(result.data);
          setFilteredContacts(result.data);
        } else {
          setContacts([]);
          setFilteredContacts([]);
        }
      } catch (error) {
        console.error("Error fetching contact data:", error);
        setContacts([]);
        setFilteredContacts([]);
      }
    };
    fetchContacts();
  }, []);

  const handleChange = (event: SelectChangeEvent) => {
    setSelect(event.target.value as string);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value.toLowerCase();
    setSearchTerm(searchValue);

    const filtered = contacts.filter(
      (contact) =>
        contact.firstName.toLowerCase().includes(searchValue) ||
        contact.lastName.toLowerCase().includes(searchValue)
    );
    setFilteredContacts(filtered);
    setPage(0);
  };

  const handleDelete = async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact/delete-mail/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        console.log('Contact deleted successfully');
        const updatedContacts = filteredContacts.filter(contact => contact._id !== id);
        setFilteredContacts(updatedContacts);
        setContacts(updatedContacts);
      } else {
        console.error('Failed to delete contact');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleExpand = (index: number) => {
    setExpandedRowIndex(prevIndex => (prevIndex === index ? null : index));
  };

  const isExpanded = (index: number) => index === expandedRowIndex;

  return (
    <>
      <Card
        sx={{
          boxShadow: "none",
          borderRadius: "7px",
          mb: "25px",
          padding: { xs: "18px", sm: "20px", lg: "25px" },
        }}
        className="rmui-card"
      >
        <Box
          sx={{
            display: { xs: "block", sm: "flex" },
            alignItems: "center",
            justifyContent: "space-between",
            mb: "25px",
          }}
        >
          <form className={styles.searchBox}>
            <label>
              <i className="material-symbols-outlined">search</i>
            </label>
            <input
              type="text"
              className={styles.inputSearch}
              placeholder="Search contact here..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </form>

          <Box>
            <FormControl sx={{ minWidth: 115 }} size="small">
              <InputLabel id="demo-select-small">Select</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={select}
                label="Select"
                onChange={handleChange}
                className="select"
              >
                <MenuItem value={0}>All</MenuItem>
                <MenuItem value={1}>Active</MenuItem>
                <MenuItem value={2}>Deactivate</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Table */}
        <Box
          sx={{
            marginLeft: "-25px",
            marginRight: "-25px",
          }}
        >
          <TableContainer
            component={Paper}
            sx={{
              boxShadow: "none",
              borderRadius: "0",
            }}
            className="rmui-table"
          >
            <Table sx={{ minWidth: 1000 }} aria-label="Contacts List Table">
              <TableHead className="bg-primary-50">
                <TableRow>
                  <TableCell
                    sx={{
                      fontWeight: "500",
                      padding: "10px 20px",
                      fontSize: "14px",
                    }}
                    className="text-black border-bottom"
                  >
                    ID
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "500",
                      padding: "10px 20px",
                      fontSize: "14px",
                    }}
                    className="text-black border-bottom"
                  >
                    User
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "500",
                      padding: "10px 20px",
                      fontSize: "14px",
                    }}
                    className="text-black border-bottom"
                  >
                    Email
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "500",
                      padding: "10px 20px",
                      fontSize: "14px",
                    }}
                    className="text-black border-bottom"
                  >
                    Phone
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "500",
                      padding: "10px 20px",
                      fontSize: "14px",
                    }}
                    className="text-black border-bottom"
                  >
                    Message
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "500",
                      padding: "10px 20px",
                      fontSize: "14px",
                    }}
                    className="text-black border-bottom"
                  >
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {(rowsPerPage > 0
                  ? filteredContacts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  : filteredContacts
                ).map((contact, index) => (
                  <TableRow key={contact._id}>
                    <TableCell
                      sx={{ padding: "15px 20px", fontSize: "14px" }}
                      className="border-bottom"
                    >
                      {index + 1}
                    </TableCell>
                    <TableCell
                      sx={{ padding: "15px 20px", fontSize: "14px" }}
                      className="border-bottom"
                    >
                      {contact.firstName} {contact.lastName}
                    </TableCell>
                    <TableCell
                      sx={{ padding: "15px 20px", fontSize: "14px" }}
                      className="border-bottom"
                    >
                      {contact.email}
                    </TableCell>
                    <TableCell
                      sx={{ padding: "15px 20px", fontSize: "14px" }}
                      className="border-bottom"
                    >
                      {contact.phone}
                    </TableCell>
                    <TableCell
                      sx={{ padding: "15px 20px", fontSize: "14px" }}
                      className="border-bottom"
                    >
                      {contact.message.substring(0, 50)}...
                      <Button onClick={() => handleExpand(index)} variant="text">
                        {isExpanded(index) ? 'Collapse' : 'Expand'}
                      </Button>
                    </TableCell>
                    <TableCell
                      sx={{ padding: "15px 20px" }}
                      className="border-bottom"
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <IconButton aria-label="delete" color="error" sx={{ padding: "5px" }}>
                          <i className="material-symbols-outlined" style={{ fontSize: "16px" }} onClick={() => handleDelete(contact._id)}>
                            delete
                          </i>
                        </IconButton>
                      </Box>
                    </TableCell>
                    {isExpanded(index) && (
                      <TableRow>
                        <TableCell colSpan={6}>
                          <Box sx={{ padding: "15px", backgroundColor: "#f9f9f9" }}>
                            {contact.message}
                          </Box>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableRow>
                ))}
              </TableBody>

              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                    colSpan={6}
                    count={contacts.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    SelectProps={{
                      inputProps: {
                        "aria-label": "rows per page",
                      },
                      native: true,
                    }}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActions}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </Box>
      </Card>
    </>
  );
};

export default Contacts;
