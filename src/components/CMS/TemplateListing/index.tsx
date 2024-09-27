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

const Templates: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const Router = useRouter();

  const handleAddCourses = () => {
    Router.push('/lms/create-course');
  }

  React.useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("http://localhost:5000/courses");
        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }
        const data = await response.json();
        setCourses(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

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

  const handleToggleActive = async (id: string, newStatus: boolean) => {
    try {
      const response = await fetch(`http://localhost:5000/courses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: newStatus }),
      });
      if (!response.ok) {
        throw new Error("Failed to update status");
      }
      setCourses(prevCourses =>
        prevCourses.map(course =>
          course.id === id ? { ...course, isActive: newStatus } : course
        )
      );
    } catch (error) {
      console.error("Failed to update course status", error);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`http://localhost:5000/courses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) {
        throw new Error("Failed to update status");
      }
      setCourses(prevCourses =>
        prevCourses.map(course =>
          course.id === id ? { ...course, status: newStatus } : course
        )
      );
    } catch (error) {
      console.error("Failed to update course status", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/courses/${id}`, {
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

          <Box sx={{ padding: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Button variant="contained" color="primary" onClick={handleAddCourses}>
              Add Course
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
                  {["ID", "Course Name", "Category", "Created By", "Price", "Status", "Active", "Action"].map((header, index) => (
                    <TableCell
                      key={index} // Add a unique key for each cell
                      sx={{
                        fontWeight: "500",
                        padding: "10px 24px",
                        fontSize: "14px",
                      }}
                      className="text-black border-bottom"
                    >
                      {header} {/* Use the header value here */}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredCourses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>{course.id}</TableCell>
                    <TableCell>{course.title}</TableCell>
                    <TableCell>{course.category}</TableCell>
                    <TableCell>{course.startDate}</TableCell>
                    <TableCell>{course.price}</TableCell>
                    <TableCell>
                      <Select value={course.status} onChange={(e) => handleStatusChange(course.id, e.target.value)}>
                        <MenuItem value="Published">Published</MenuItem>
                        <MenuItem value="Draft">Draft</MenuItem>
                        <MenuItem value="Archived">Archived</MenuItem>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={course.isActive}
                        onChange={(e) => handleToggleActive(course.id, e.target.checked)}
                        inputProps={{ "aria-label": "controlled" }}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton aria-label="view" color="primary">
                        <i className="material-symbols-outlined" style={{ fontSize: "16px" }}>visibility</i>
                      </IconButton>
                      <IconButton aria-label="edit" color="secondary">
                        <i className="material-symbols-outlined" style={{ fontSize: "16px" }}>edit</i>
                      </IconButton>
                      <IconButton aria-label="delete" color="error" onClick={() => handleDelete(course.id)}>
                        <i className="material-symbols-outlined" style={{ fontSize: "16px" }}>delete</i>
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={8} />
                  </TableRow>
                )}
              </TableBody>

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

export default Templates;
