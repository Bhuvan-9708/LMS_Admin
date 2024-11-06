"use client";

import * as React from "react";
import {
  Card,
  Box,
  Typography,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableFooter,
  TableRow,
  TablePagination,
  Paper,
  IconButton,
  Select,
  Switch,
  Button
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import styles from "@/components/LMS/Search.module.css";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps, AlertColor } from '@mui/material/Alert';

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

  const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page + 1);
  };

  return (
    <Box sx={{ flexShrink: 0, display: "flex", gap: "10px", padding: "0 20px" }}>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
        sx={{ borderRadius: "4px", padding: "6px" }}
      >
        {theme.direction === "rtl" ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
        sx={{ borderRadius: "4px", padding: "6px" }}
      >
        {theme.direction === "rtl" ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
    </Box>
  );
}

interface Courses {
  _id: string;
  status: string;
  is_active: boolean;
}

const Courses: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>('success');
  const Router = useRouter();

  const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const handleAddCourses = () => {
    Router.push('/lms/create-course');
  }
  const handleCourseDetails = () => {
    Router.push('/lms/add-course-details');
  }
  const handleCourseInfo = () => {
    Router.push('/lms/add-course-info');
  }

  const fetchCourses = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/course`);
      if (!response.ok) {
        throw new Error("Failed to fetch courses");
      }
      const data = await response.json();
      if (data.success) {
        setCourses(data.data);
        console.log(data.data);
      } else {
        throw new Error(data.message || "Unknown error");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  React.useEffect(() => {
    fetchCourses();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Table pagination
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredCourses.length) : 0;

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleUpdateCourseStatus = async (
    courseId: string,
    updateData: { status?: string; isActive?: boolean }
  ) => {
    console.log("Course ID:", courseId);
    console.log("Update Data:", updateData);

    const courseResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/course/status/${courseId}`);
    const course = await courseResponse.json();

    const dataToUpdate = {
      status: updateData.status ?? course.status,
      is_active: updateData.isActive !== undefined ? Boolean(updateData.isActive) : Boolean(course.is_active),
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/course/status/${courseId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToUpdate),
      });

      const result = await response.json();

      if (result.success) {
        setSnackbarMessage('Course updated successfully');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        fetchCourses(); 
      } else {
        throw new Error('Failed to update Course');
      }
    } catch (error) {
      setSnackbarMessage('Error updating Course');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleIsActiveChange = (courseId: string, isActive: boolean) => {
    console.log("Updating course with ID:", courseId, "is_active:", isActive);
    handleUpdateCourseStatus(courseId, { isActive });
  };

  const handleStatusChange = (courseId: string, newStatus: string) => {
    console.log("Updating course with ID:", courseId, "status:", newStatus);
    handleUpdateCourseStatus(courseId, { status: newStatus });
  };


  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete course");
      }
      setCourses(prevCourses => prevCourses.filter(course => course.id !== id));
    } catch (error) {
      console.error("Failed to delete course", error);
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const optionsDate: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', optionsDate);

    return `${formattedDate}`;
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
              type="text"
              className={styles.inputSearch}
              placeholder="Search course here..."
              onChange={handleSearchChange}
            />
          </Box>

          <Box sx={{ padding: 2, display: "flex", gap: 2 }}>
            <Button variant="contained" color="primary" onClick={handleAddCourses}>
              Create Course
            </Button>
            <Button variant="contained" color="secondary" onClick={handleCourseDetails}>
              Course Details
            </Button>
            <Button variant="contained" color="success" onClick={handleCourseInfo}>
              Course Info
            </Button>
          </Box>

        </Box>

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
            <Table sx={{ minWidth: 1200 }} aria-label="Courses Table">
              <TableHead className="bg-primary-50">
                <TableRow>
                  {["ID", "Course Name", "Course Level", "Created By", "Price", "Status", "Action"].map((header, index) => (
                    <TableCell
                      key={index}
                      sx={{
                        fontWeight: "500",
                        padding: "10px 24px",
                        fontSize: "14px",
                      }}
                      className="text-black border-bottom"
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredCourses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((course) => (
                  <TableRow key={course._id}>
                    <TableCell sx={{ padding: '13px 20px', fontSize: '14px' }} className="text-black border-bottom">{course._id}</TableCell>
                    <TableCell sx={{ padding: '13px 20px', fontSize: '14px' }} className="text-black border-bottom">{course.title}</TableCell>
                    <TableCell sx={{ padding: '13px 20px', fontSize: '14px' }} className="text-black border-bottom">{course.course_level}</TableCell>
                    <TableCell sx={{ padding: '13px 20px', fontSize: '14px' }} className="text-black border-bottom">{formatDateTime(course.createdAt)}</TableCell>
                    <TableCell sx={{ padding: '13px 20px', fontSize: '14px' }} className="text-black border-bottom">{course.price}</TableCell>
                    <TableCell sx={{ padding: '13px 20px', fontSize: '14px' }} className="text-black border-bottom">
                      <Select
                        value={course.status}
                        onChange={(e) => handleStatusChange(course._id, e.target.value as string)}
                        sx={{ textTransform: 'capitalize' }}
                      >
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="approved">Approved</MenuItem>
                        <MenuItem value="rejected">Rejected</MenuItem>
                      </Select>
                    </TableCell>

                    {/* <TableCell sx={{ padding: '13px 20px', fontSize: '14px' }} className="text-black border-bottom">
                      <Switch
                        checked={course.is_active ?? false}
                        onChange={(e) => handleIsActiveChange(course._id, e.target.checked)}
                        color="primary"
                      />
                    </TableCell> */}
                    <TableCell>
                      <IconButton aria-label="view" color="primary">
                        <i className="material-symbols-outlined" style={{ fontSize: "16px" }}>visibility</i>
                      </IconButton>
                      <IconButton aria-label="edit" color="secondary">
                        <i className="material-symbols-outlined" style={{ fontSize: "16px" }}>edit</i>
                      </IconButton>
                      {/* <IconButton aria-label="delete" color="error" onClick={() => handleDelete(course.id)}>
                        <i className="material-symbols-outlined" style={{ fontSize: "16px" }}>delete</i>
                      </IconButton> */}
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
                autoHideDuration={1000}
                onClose={() => setSnackbarOpen(false)}
              >
                <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
                  {snackbarMessage}
                </Alert>
              </Snackbar>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[10, 25, 50]}
                    colSpan={6}
                    count={courses.length}
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
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredCourses.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          ActionsComponent={TablePaginationActions}
        />
      </Card>
    </>
  );
};

export default Courses;
