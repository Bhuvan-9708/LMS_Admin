"use client";

import React, { useState, FormEvent } from "react";
import {
  Card,
  Box,
  Typography,
  Button,
  MenuItem,
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
  Dialog,
  DialogTitle,
  Grid,
  TextField,
  FormControl,
  InputLabel,
} from "@mui/material";
import Switch from '@mui/material/Switch';
import { useTheme } from "@mui/material/styles";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import AddIcon from "@mui/icons-material/Add";
import styles from "@/components/LMS/Search.module.css";
import { styled } from "@mui/material/styles";
import ClearIcon from "@mui/icons-material/Clear";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";
import Select, { SelectChangeEvent } from "@mui/material/Select";

// Modal
interface BootstrapDialogTitleProps {
  children?: React.ReactNode;
  onClose: () => void;
}

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

function BootstrapDialogTitle(props: BootstrapDialogTitleProps) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};
// End Modal

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

const Instructors: React.FC = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [instructors, setInstructors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  React.useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const response = await fetch("http://localhost:5000/instructors");
        if (!response.ok) {
          throw new Error("Failed to fetch instructors");
        }
        const data = await response.json();
        setInstructors(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructors();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredInstructors = instructors.filter(instructor =>
    instructor.first_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredInstructors.length) : 0;

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleUpdateInstructor = async (id: string, updates: { status?: string; isActive?: boolean }) => {
    try {
      const currentResponse = await fetch(`http://localhost:5000/instructors/${id}`);
      const currentInstructor = await currentResponse.json();

      const updatedInstructor = {
        ...currentInstructor,
        is_active: updates.isActive !== undefined ? updates.isActive : currentInstructor.is_active,
        status: updates.status !== undefined ? updates.status : currentInstructor.status,
      };

      const response = await fetch(`http://localhost:5000/instructors/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedInstructor),
      });

      if (!response.ok) {
        throw new Error("Failed to update instructor");
      }

      // Update local state to reflect changes
      setInstructors(prevInstructors =>
        prevInstructors.map(instructor =>
          instructor.id === id ? updatedInstructor : instructor
        )
      );
    } catch (error) {
      console.error("Failed to update instructor", error);
    }
  };


  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Modal
  const [openModal, setOpenModal] = useState(false);
  const handleClickOpenModal = () => {
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // const data = new FormData(event.currentTarget);
    // console.log();
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
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: "20px",
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
              type="text"
              className={styles.inputSearch}
              placeholder="Search instructor here..."
            />
          </Box>

          <Box>
            <Button
              onClick={handleClickOpenModal}
              variant="outlined"
              sx={{
                textTransform: "capitalize",
                borderRadius: "7px",
                fontWeight: "500",
                fontSize: "14px",
                padding: "6px 13px",
              }}
              color="primary"
            >
              <AddIcon sx={{ position: "relative", top: "-1px" }} /> Add New
              Instructor
            </Button>
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
            <Table sx={{ minWidth: 480 }} aria-label="Table">
              <TableHead className="bg-primary-50">
                <TableRow>
                  <TableCell sx={{ fontWeight: '500', padding: '10px 20px', fontSize: '14px' }} className="text-black border-bottom">ID</TableCell>
                  <TableCell sx={{ fontWeight: '500', padding: '10px 20px', fontSize: '14px' }} className="text-black border-bottom">Name</TableCell>
                  <TableCell sx={{ fontWeight: '500', padding: '10px 20px', fontSize: '14px' }} className="text-black border-bottom">Occupation</TableCell>
                  <TableCell sx={{ fontWeight: '500', padding: '10px 20px', fontSize: '14px' }} className="text-black border-bottom">Phone</TableCell>
                  <TableCell sx={{ fontWeight: '500', padding: '10px 20px', fontSize: '14px' }} className="text-black border-bottom">Email</TableCell>
                  <TableCell sx={{ fontWeight: '500', padding: '10px 20px', fontSize: '14px' }} className="text-black border-bottom">Status</TableCell>
                  <TableCell sx={{ fontWeight: '500', padding: '10px 20px', fontSize: '14px' }} className="text-black border-bottom">IsActive</TableCell>
                  <TableCell sx={{ fontWeight: '500', padding: '10px 20px', fontSize: '14px' }} className="text-black border-bottom text-end">Action</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredInstructors.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((instructor) => (
                  <TableRow key={instructor.id}>
                    <TableCell sx={{ padding: '13px 20px', fontSize: '14px' }} className="text-black border-bottom">{instructor.id}</TableCell>
                    <TableCell sx={{ padding: '13px 20px', fontSize: '14px' }} className="text-black border-bottom">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Typography sx={{ fontWeight: '500' }} className="text-black">{instructor.first_name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ padding: '13px 20px', fontSize: '14px' }} className="text-black border-bottom">{instructor.occupation}</TableCell>
                    <TableCell sx={{ padding: '13px 20px', fontSize: '14px' }} className="text-black border-bottom">{instructor.phone}</TableCell>
                    <TableCell sx={{ padding: '13px 20px', fontSize: '14px' }} className="text-black border-bottom">{instructor.email}</TableCell>

                    {/* Status dropdown */}
                    <TableCell sx={{ padding: '13px 20px', fontSize: '14px' }} className="text-black border-bottom">
                      <Select
                        value={instructor.status}
                        onChange={(e) => handleUpdateInstructor(instructor.id, { status: e.target.value })}
                        sx={{ textTransform: 'capitalize' }}
                      >
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="approved">Approved</MenuItem>
                        <MenuItem value="rejected">Rejected</MenuItem>
                      </Select>
                    </TableCell>

                    <TableCell sx={{ padding: '13px 20px', fontSize: '14px' }} className="text-black border-bottom">
                      <Switch
                        checked={instructor.is_active}
                        onChange={(e) => handleUpdateInstructor(instructor.id, { isActive: e.target.checked })}
                        color="primary"
                      />
                    </TableCell>

                    <TableCell sx={{ padding: '13px 20px', fontSize: '14px' }} className="text-end border-bottom">
                      <IconButton aria-label="delete" color="error" sx={{ padding: '5px' }}>
                        <i className="material-symbols-outlined" style={{ fontSize: '16px' }}>delete</i>
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}

                {instructors.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} align="center">No instructors found</TableCell>
                  </TableRow>
                )}
              </TableBody>

              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                    colSpan={8}
                    count={instructors.length}
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
      </Card>

      {/* Modal */}
      <BootstrapDialog
        onClose={handleCloseModal}
        aria-labelledby="customized-dialog-title"
        open={openModal}
        className="rmu-modal"
      >
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "#f6f7f9",
              padding: { xs: "15px 20px", md: "25px" },
            }}
            className="rmu-modal-header"
          >
            <Typography
              id="modal-modal-title"
              variant="h6"
              sx={{
                fontWeight: "600",
                fontSize: { xs: "16px", md: "18px" },
              }}
              className="text-black"
            >
              Add New Instructor
            </Typography>

            <IconButton
              aria-label="remove"
              size="small"
              onClick={handleCloseModal}
            >
              <ClearIcon />
            </IconButton>
          </Box>

          <Box className="rmu-modal-content">
            <Box component="form" noValidate onSubmit={handleSubmit}>
              <Box sx={{ padding: "25px", borderRadius: "8px" }} className="bg-white">
                <Grid container alignItems="center" spacing={2}>
                  <Grid item xs={12} md={12} lg={6}>
                    <Typography component="h5" sx={{ fontWeight: "500", fontSize: "14px", mb: "12px" }} className="text-black">First Name</Typography>
                    <TextField name="first_name" required fullWidth id="first_name" label="Enter First Name" autoFocus InputProps={{ style: { borderRadius: 8 } }} />
                  </Grid>
                  <Grid item xs={12} md={12} lg={6}>
                    <Typography component="h5" sx={{ fontWeight: "500", fontSize: "14px", mb: "12px" }} className="text-black">Last Name</Typography>
                    <TextField name="last_name" fullWidth id="last_name" label="Enter Last Name" InputProps={{ style: { borderRadius: 8 } }} />
                  </Grid>
                  <Grid item xs={12} md={12} lg={6}>
                    <Typography component="h5" sx={{ fontWeight: "500", fontSize: "14px", mb: "12px" }} className="text-black">Occupation</Typography>
                    <TextField name="occupation" required fullWidth id="occupation" label="Enter Designation" InputProps={{ style: { borderRadius: 8 } }} />
                  </Grid>
                  <Grid item xs={12} md={12} lg={6}>
                    <Typography component="h5" sx={{ fontWeight: "500", fontSize: "14px", mb: "12px" }} className="text-black">Gender</Typography>
                    <TextField select name="gender" required fullWidth id="gender" label="Select Gender" InputProps={{ style: { borderRadius: 8 } }} SelectProps={{ native: true }}>
                      <option value="" />
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={12} lg={6}>
                    <Typography component="h5" sx={{ fontWeight: "500", fontSize: "14px", mb: "12px" }} className="text-black">Date of Birth</Typography>
                    <TextField type="date" name="date_of_birth" required fullWidth id="date_of_birth" InputLabelProps={{ shrink: true }} InputProps={{ style: { borderRadius: 8 } }} />
                  </Grid>
                  <Grid item xs={12} md={12} lg={6}>
                    <Typography component="h5" sx={{ fontWeight: "500", fontSize: "14px", mb: "12px" }} className="text-black">Email</Typography>
                    <TextField name="email" required fullWidth id="email" label="Enter Email" InputProps={{ style: { borderRadius: 8 } }} />
                  </Grid>
                  <Grid item xs={12} md={12} lg={6}>
                    <Typography component="h5" sx={{ fontWeight: "500", fontSize: "14px", mb: "12px" }} className="text-black">Phone</Typography>
                    <TextField name="phone" required fullWidth id="phone" label="Enter Phone Number" InputProps={{ style: { borderRadius: 8 } }} />
                  </Grid>
                  <Grid item xs={12} md={12} lg={6}>
                    <Typography component="h5" sx={{ fontWeight: "500", fontSize: "14px", mb: "12px" }} className="text-black">Status</Typography>
                    <TextField select name="status" required fullWidth id="status" label="Select Status" InputProps={{ style: { borderRadius: 8 } }} SelectProps={{ native: true }}>
                      <option value="" />
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} mt={1}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "end", gap: "10px" }}>
                      <Button onClick={handleCloseModal} variant="outlined" color="error" sx={{ textTransform: "capitalize", borderRadius: "8px", fontWeight: "500", fontSize: "13px", padding: "11px 30px" }}>Cancel</Button>
                      <Button type="submit" variant="contained" sx={{ textTransform: "capitalize", borderRadius: "8px", fontWeight: "500", fontSize: "13px", padding: "11px 30px", color: "#fff !important" }}><AddIcon sx={{ position: "relative", top: "-1px" }} /> Create</Button>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Box>
        </Box>
      </BootstrapDialog>
    </>
  );
};

export default Instructors;
