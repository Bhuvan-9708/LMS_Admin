"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Switch,
  Button,
  IconButton,
  Box,
  TablePagination,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import styles from "@/components/LMS/Search.module.css";
import { useRouter } from "next/navigation";

interface Query {
  _id: string;
  name: string;
  email: string;
  phone: string;
  course_id?: string;
  event_id?: string;
  query: string;
}

export default function QueryList() {
  const [queries, setQueries] = useState<Query[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const router = useRouter();

  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/connect-with-us/`);
      if (!response.ok) throw new Error("Failed to fetch query details");

      const data = await response.json();
      if (data && Array.isArray(data.data)) {
        setQueries(data.data);
        setTotalItems(data.pagination.totalItems);
      } else {
        setQueries([]);
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/queries/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete query");

      setQueries((prevQueries) => prevQueries.filter((query) => query._id !== id));
    } catch (error) {
      console.error("Error deleting query:", error);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredQueries = queries.filter((query) =>
    Object.values(query)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm)
  );

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
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: "25px" }}>
          <Box component="form" className={styles.searchBox} sx={{ width: { sm: "265px" } }}>
            <label>
              <i className="material-symbols-outlined">search</i>
            </label>
            <input
              type="text"
              className={styles.inputSearch}
              placeholder="Search queries..."
              onChange={handleSearchChange}
            />
          </Box>
          <Button variant="contained" color="primary" onClick={() => router.push("/cms/create-query")}>
            Add Query
          </Button>
        </Box>

        {error && <Alert severity="error">{error}</Alert>}

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 800 }} aria-label="query list table">
            <TableHead className="bg-primary-50">
              <TableRow>
                {["Name", "Email", "Phone", "Course ID", "Event ID", "Query", "Actions"].map(
                  (header, index) => (
                    <TableCell key={index} sx={{ fontWeight: "500", fontSize: "14px" }}>
                      {header}
                    </TableCell>
                  )
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : (
                filteredQueries
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((query) => (
                    <TableRow key={query._id}>
                      <TableCell>{query.name}</TableCell>
                      <TableCell>{query.email}</TableCell>
                      <TableCell>{query.phone}</TableCell>
                      <TableCell>{query.course_id || "-"}</TableCell>
                      <TableCell>{query.event_id || "-"}</TableCell>
                      <TableCell>{query.query}</TableCell>
                      <TableCell>
                        <IconButton
                          aria-label="edit"
                          color="secondary"
                          onClick={() => router.push(`/cms/edit-query/${query._id}`)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton aria-label="delete" color="error" onClick={() => handleDelete(query._id)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalItems}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </Card>
    </>
  );
}
