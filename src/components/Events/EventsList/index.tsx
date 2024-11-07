"use client";

import React, { useState } from "react";
import Image from "next/image";
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
  MenuItem,
  Select,
  IconButton,
  TableHead,
  Button,
} from "@mui/material";
import NextLink from "next/link";
import { useTheme } from "@mui/material/styles";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import styles from "@/components/Events/EventsList/Search.module.css";
import AddIcon from "@mui/icons-material/Add";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps, AlertColor } from '@mui/material/Alert';
import Switch from '@mui/material/Switch';

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

const EventsList: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>('success');

  const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const fetchEvents = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/event/get-all-events`);
      const data = await response.json();
      if (data.success) {
        setEvents(data.data);
        console.log(">>>>>>", data.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchEvents();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredEvents.length) : 0;

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleUpdateEvent = async (
    id: string,
    updateData: { status?: string; isActive?: boolean }
  ) => {

    const eventResponse = await fetch( `${process.env.NEXT_PUBLIC_API_URL}/api/event/status/${id}`);
    const event = await eventResponse.json();

    const dataToUpdate = {
      status: updateData.status ?? event.status,
      is_active: updateData.isActive !== undefined ? updateData.isActive : event.is_active
    };
    try {
      const response = await fetch( `${process.env.NEXT_PUBLIC_API_URL}/api/event/status/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToUpdate),
      });
      const result = await response.json();
      if (result.success) {
        setSnackbarMessage('Events updated successfully');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        fetchEvents();
      } else {
        throw new Error('Failed to update Events');
      }
    } catch (error) {
      setSnackbarMessage('Error updating Events');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleStatusChange = (eventId: string, newStatus: string) => {
    console.log("Calling handleUpdateEvent with ID:", eventId);
    handleUpdateEvent(eventId, { status: newStatus });
  };

  const handleIsActiveChange = (eventId: string, isActive: boolean) => {
    console.log("Calling handleUpdateEvent with ID:", eventId, "New Value:", isActive);
    handleUpdateEvent(eventId, { isActive });
  };
  const formatDateTime = (dateString: string, timeString: string) => {
    const date = new Date(dateString);
    const optionsDate: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', optionsDate);

    const [hours, minutes] = timeString.split(':');
    const formattedTime = `${parseInt(hours) % 12 || 12}:${minutes} ${parseInt(hours) >= 12 ? 'PM' : 'AM'}`;

    return `${formattedDate} at ${formattedTime}`;
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
                width: "265px",
              }}
            >
              <label>
                <i className="material-symbols-outlined">search</i>
              </label>
              <input
                onChange={handleSearchChange}
                type="text"
                className={styles.inputSearch}
                placeholder="Search event here..."
              />
            </Box>

            <NextLink href="/events/create-an-event">
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
                Event
              </Button>
            </NextLink>
          </Box>

          <TableContainer
            component={Paper}
            sx={{
              boxShadow: "none",
              borderRadius: "7px",
            }}
            className="rmui-table border"
          >
            <Table sx={{ minWidth: 1250 }} aria-label="Table">
              <TableHead className="bg-f6f7f9">
                <TableRow>
                  <TableCell sx={{ fontWeight: "500", padding: "10px 20px", fontSize: "14px", }}
                    className="text-black border-bottom"
                  >
                    Event ID
                  </TableCell>
                  <TableCell sx={{ fontWeight: "500", padding: "10px 20px", fontSize: "14px", }}
                    className="text-black border-bottom"
                  >
                    Image
                  </TableCell>
                  <TableCell sx={{ fontWeight: "500", padding: "10px 20px", fontSize: "14px", }}
                    className="text-black border-bottom"
                  >
                    Event Title
                  </TableCell>
                  <TableCell sx={{ fontWeight: "500", padding: "10px 20px", fontSize: "14px", }}
                    className="text-black border-bottom"
                  >
                    Start Date & Time
                  </TableCell>
                  <TableCell sx={{ fontWeight: "500", padding: "10px 20px", fontSize: "14px", }}
                    className="text-black border-bottom"
                  >
                    Organizer
                  </TableCell>
                  <TableCell sx={{ fontWeight: "500", padding: "10px 20px", fontSize: "14px", }}
                    className="text-black border-bottom"
                  >
                    Is Active
                  </TableCell>
                  <TableCell sx={{ fontWeight: "500", padding: "10px 20px", fontSize: "14px", }}
                    className="text-black border-bottom"
                  >
                    Status
                  </TableCell>
                  <TableCell sx={{ fontWeight: "500", padding: "10px 20px", fontSize: "14px", }}
                    className="text-black border-bottom"
                  >
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredEvents
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((event) => (
                    <TableRow key={event._id}>
                      <TableCell sx={{ padding: "14px 20px", fontSize: "14px", }}
                        className="border-bottom"
                      >
                        {event.event_id}
                      </TableCell>

                      <TableCell sx={{ padding: "14px 20px", fontSize: "14px", }}
                        className="border-bottom"
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "13px",
                          }}
                        >
                          <Box sx={{ flexShrink: "0" }}>
                            <Image
                              src={event.image}
                              alt="Product"
                              width={80}
                              height={36}
                              style={{ borderRadius: "7px" }}
                            />
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ padding: "14px 20px", fontSize: "14px" }}
                        className="text-black border-bottom"
                      >
                        {event.title}
                      </TableCell>
                      <TableCell sx={{ padding: "14px 20px", fontSize: "14px" }}
                        className="text-black border-bottom"
                      >
                        {formatDateTime(event.start_date, event.start_time)}
                      </TableCell>

                      <TableCell sx={{ padding: "14px 20px", fontSize: "14px", }}
                        className="text-black border-bottom"
                      >
                        {event.organizer}
                      </TableCell>

                      <TableCell sx={{ padding: '13px 20px', fontSize: '14px' }} className="text-black border-bottom">
                        <Switch
                          checked={event.is_active}
                          onChange={(e) => handleIsActiveChange(event._id, e.target.checked)}
                          color="primary"
                        />
                      </TableCell>

                      <TableCell sx={{ padding: '13px 20px', fontSize: '14px' }} className="text-black border-bottom">
                        <Select
                          value={event.status}
                          onChange={(e) => handleStatusChange(event._id, e.target.value as string)}
                          sx={{ textTransform: 'capitalize' }}
                        >
                          <MenuItem value="pending">Pending</MenuItem>
                          <MenuItem value="approved">Approved</MenuItem>
                          <MenuItem value="rejected">Rejected</MenuItem>
                        </Select>
                      </TableCell>

                      <TableCell sx={{ padding: "14px 20px", fontSize: "14px", }}
                        className="border-bottom"
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <NextLink href={`/events/${event._id}`}>
                            <IconButton
                              aria-label="view"
                              color="primary"
                              sx={{ padding: "5px" }}
                            >
                              <i
                                className="material-symbols-outlined"
                                style={{ fontSize: "16px" }}
                              >
                                visibility
                              </i>
                            </IconButton>
                          </NextLink>

                          <IconButton
                            aria-label="edit"
                            color="secondary"
                            sx={{ padding: "5px" }}
                          >
                            <i
                              className="material-symbols-outlined"
                              style={{ fontSize: "16px" }}
                            >
                              edit
                            </i>
                          </IconButton>

                          <IconButton
                            aria-label="delete"
                            color="error"
                            sx={{ padding: "5px" }}
                          >
                            <i
                              className="material-symbols-outlined"
                              style={{ fontSize: "16px" }}
                            >
                              delete
                            </i>
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={10} />
                  </TableRow>
                )}
              </TableBody>
              <Snackbar
                open={snackbarOpen}
                autoHideDuration={2000}
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
                    colSpan={10}
                    count={events.length}
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
      </Card >
    </>
  );
};

export default EventsList;
