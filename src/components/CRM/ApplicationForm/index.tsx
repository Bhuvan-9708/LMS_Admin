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


interface CourseID {
    _id: string;
    title: string;
}
interface EventID {
    _id: string;
    title: string;
}

interface Query {
    _id: string;
    name: string;
    email: string;
    phone: string;
    course_id?: string | CourseID;
    event_id?: string;
}

export default function HireFromUs() {
    const [formData, setFormData] = useState<Query[]>([]);
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
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/shop/application/`);
            if (!response.ok) throw new Error("Failed to fetch query details");

            const data = await response.json();
            if (data && Array.isArray(data.data)) {
                setFormData(data.data);
                setTotalItems(data.totalCount);
                console.log("Fetched Queries:", data.data);
            } else {
                setFormData([]);
            }
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/formData/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Failed to delete query");

            setFormData((prevQueries) => prevQueries.filter((query) => query._id !== id));
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

    const filteredQueries = formData.filter((query) =>
        Object.values(query)
            .join(" ")
            .toLowerCase()
            .includes(searchTerm)
    );

    const isCourseID = (course: string | CourseID): course is CourseID => {
        return (course as CourseID)._id !== undefined;
    };
    const isEventID = (event: string | EventID): event is EventID => {
        return (event as EventID)._id !== undefined;
    };

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
                            placeholder="Search Application..."
                            onChange={handleSearchChange}
                        />
                    </Box>
                </Box>

                {error && <Alert severity="error">{error}</Alert>}

                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 800 }} aria-label="query list table">
                        <TableHead className="bg-primary-50">
                            <TableRow>
                                {["Name", "Email", "Phone", "Course Title", "Event Title", "Actions"].map((header, index) => (
                                    <TableCell key={index} sx={{ fontWeight: "500", fontSize: "14px" }}>
                                        {header}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
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
                                            <TableCell>
                                                {query.course_id && isCourseID(query.course_id) ? query.course_id.title : "-"}
                                            </TableCell>
                                            <TableCell>
                                                {query.event_id && isEventID(query.event_id) ? query.event_id.title : "-"}
                                            </TableCell>
                                            <TableCell>
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
