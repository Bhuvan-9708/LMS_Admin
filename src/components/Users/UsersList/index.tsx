"use client";

import React, { useState, FormEvent } from "react";
import {
  Card,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TablePagination,
  TableRow,
  Paper,
  IconButton,
  TableHead,
  Button,
} from "@mui/material";
import Switch from '@mui/material/Switch';
import Link from "next/link";
import { useTheme } from "@mui/material/styles";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import styles from "@/components/Users/Search.module.css";
import AddIcon from "@mui/icons-material/Add";
import MuiAlert, { AlertProps, AlertColor } from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number
  ) => void;
}

interface Users {
  _id: string;
  first_name: string;
  last_name: string;
  occupation: string;
  user_name: string;
  bio: string;
  email: string;
  phone: string;
  user_type: string;
  is_active: boolean;
  createdAt: string;
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
        padding: "14px 20px",
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

const UsersList: React.FC = () => {
  // Table
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>('success');
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState<Users | null>(null);

  const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const handleViewDetails = (user: Users) => {
    setSelectedInstructor(user);
    setViewDialogOpen(true);
  };

  const handleCloseViewDialog = () => {
    setViewDialogOpen(false);
    setSelectedInstructor(null);
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api`);
      const data = await response.json();

      if (data) {
        setUsers(data);
        console.log("Fetched users data:", data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredUsers = users.filter((user) =>
    user.first_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, users.length - page * rowsPerPage);

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

  const handleUpdateInstructor = async (id: string, updates: { isActive?: boolean }) => {
    try {
      const currentResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/${id}`);
      const currentUser = await currentResponse.json();

      const updatedUser = {
        ...currentUser,
        is_active: updates.isActive !== undefined ? updates.isActive : currentUser.is_active,
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });

      if (!response.ok) {
        throw new Error("Failed to update User");
      }

      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === id ? updatedUser : user
        )
      );

      setSnackbarMessage("User updated successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

    } catch (error) {
      console.error("Failed to update User", error);
      setSnackbarMessage("Error updating User. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography>Error: {error}</Typography>;
  }

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
        <Box>
          <Box
            sx={{
              display: { xs: "block", sm: "flex" },
              alignItems: "center",
              justifyContent: "space-between",
              mb: "25px",
            }}
          >
            <Box
              component="form"
              className={styles.searchBox}
              sx={{
                width: { sm: "265px" },
              }}
            >
              <label>
                <i className="material-symbols-outlined">search</i>
              </label>
              <input
                onChange={handleSearchChange}
                type="text"
                className={styles.inputSearch}
                placeholder="Search Users here..."
              />
            </Box>

            <Link href="/users/add-user">
              <Button
                variant="outlined"
                sx={{
                  textTransform: "capitalize",
                  borderRadius: "7px",
                  fontWeight: "500",
                  fontSize: "13px",
                  padding: "6px 13px",
                }}
                color="primary"
              >
                <AddIcon sx={{ position: "relative", top: "-1px" }} /> Add New
                User
              </Button>
            </Link>
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
              <Table sx={{ minWidth: 1250 }} aria-label="Table">
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
                      User ID
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
                      Join Date
                    </TableCell>
                    <TableCell sx={{ fontWeight: '500', padding: '10px 20px', fontSize: '14px' }} className="text-black border-bottom">IsActive</TableCell>
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
                  {filteredUsers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((user) => (
                      <TableRow key={user._id}>
                        <TableCell sx={{ padding: "14px 20px", fontSize: "14px" }} className="border-bottom">
                          {user.id}
                        </TableCell>

                        <TableCell sx={{ padding: "14px 20px", fontSize: "14px" }} className="border-bottom">
                          <Box sx={{ display: "flex", alignItems: "center", gap: "13px" }}>
                            <Box>
                              <Typography sx={{ fontSize: "15px", fontWeight: "500" }} className="text-black">
                                {user.first_name} {user.last_name}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>

                        <TableCell sx={{ padding: "14px 20px", fontSize: "14px" }} className="text-black border-bottom">
                          {user.email}
                        </TableCell>

                        <TableCell sx={{ padding: "14px 20px", fontSize: "14px" }} className="text-black border-bottom">
                          {user.phone}
                        </TableCell>

                        <TableCell sx={{ padding: "14px 20px", fontSize: "14px" }} className="text-black border-bottom">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell sx={{ padding: '13px 20px', fontSize: '14px' }} className="text-black border-bottom">
                          <Switch
                            checked={user.is_active}
                            onChange={(e) => handleUpdateInstructor(user.id, { isActive: e.target.checked })}
                            color="primary"
                          />
                        </TableCell>
                        <TableCell sx={{ padding: "14px 20px" }} className="border-bottom">
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <IconButton aria-label="view" color="primary" sx={{ padding: "5px" }}>
                              <i className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                                visibility
                              </i>
                            </IconButton>
                            <IconButton aria-label="delete" color="error" sx={{ padding: "5px" }}>
                              <i className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                                delete
                              </i>
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}

                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={8} />
                    </TableRow>
                  )}
                </TableBody>
                <Snackbar
                  open={snackbarOpen}
                  autoHideDuration={6000}
                  onClose={() => setSnackbarOpen(false)}
                >
                  <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
                    {snackbarMessage}
                  </Alert>
                </Snackbar>

                <TableFooter>
                  <TableRow>
                    <TablePagination
                      rowsPerPageOptions={[
                        5,
                        10,
                        25,
                        { label: "All", value: -1 },
                      ]}
                      colSpan={8}
                      count={users.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      slotProps={{
                        select: {
                          inputProps: {
                            "aria-label": "rows per page",
                          },
                          native: true,
                        },
                      }}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                      ActionsComponent={TablePaginationActions}
                      sx={{
                        border: "none",
                      }}
                    />
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </Card>
    </>
  );
};

export default UsersList;
